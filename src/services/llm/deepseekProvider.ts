import type { LLMResponse } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepseekResponse {
  content: string;
  reasoningContent?: string;
}

export interface StreamCallbacks {
  onReasoningChunk?: (chunk: string) => void;
  onContentChunk?: (chunk: string) => void;
}

export async function getChainOfThought(
  prompt: string, 
  callbacks?: StreamCallbacks
): Promise<DeepseekResponse> {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    // Check if we should use streaming
    const useStream = !!callbacks;

    // Define common request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'user', content: prompt }
        ],
        stream: useStream,
        temperature: 0.7,
        max_tokens: 4000
      })
    };

    if (useStream) {
      // Handle streaming response
      const response = await fetch(DEEPSEEK_API_URL, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'DeepSeek API request failed');
      }
      
      if (!response.body) {
        throw new Error('Response body is not readable');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let completeReasoningContent = '';
      let completeContent = '';
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            // Handle [DONE] marker which is a separate data line
            if (line.includes('[DONE]')) continue;
            
            try {
              const data = JSON.parse(line.substring(5).trim());
              if (data?.choices?.[0]?.delta?.reasoning_content) {
                const reasoningChunk = data.choices[0].delta.reasoning_content;
                completeReasoningContent += reasoningChunk;
                callbacks?.onReasoningChunk?.(reasoningChunk);
              } else if (data?.choices?.[0]?.delta?.content) {
                const contentChunk = data.choices[0].delta.content;
                completeContent += contentChunk;
                callbacks?.onContentChunk?.(contentChunk);
              }
            } catch (e) {
              console.error('Error parsing stream data:', e, 'Line:', line);
            }
          }
        }
      }
      
      // Format the streamed reasoning content to improve readability
      const formattedReasoningContent = formatReasoningContent(completeReasoningContent);
      
      return {
        content: completeContent,
        reasoningContent: formattedReasoningContent
      };
    } else {
      // Handle non-streaming response
      const response = await fetch(DEEPSEEK_API_URL, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'DeepSeek API request failed');
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      const message = data.choices[0].message;
      const formattedReasoningContent = message.reasoning_content 
        ? formatReasoningContent(message.reasoning_content)
        : 'No reasoning provided for this query.';
        
      return {
        content: message.content || '',
        reasoningContent: formattedReasoningContent
      };
    }
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
}

// Helper function to format the reasoning content for better readability
function formatReasoningContent(content: string): string {
  if (!content) return '';
  
  // Add proper markdown formatting for better readability
  let formatted = content
    // Make step numbers bold
    .replace(/(\d+\.\s*)([^:\n]*:?)/g, '$1**$2**')
    // Add emphasis to key terms and conclusions
    .replace(/(conclusion|therefore|in summary|thus):/gi, '**$1:**')
    // Add horizontal rules before conclusions or summaries
    .replace(/(\n|^)(In conclusion|To summarize|Therefore,)/g, '\n---\n\n$2')
    // Ensure proper spacing between paragraphs
    .replace(/\n\n+/g, '\n\n')
    // Convert standalone * to bullet points
    .replace(/^(\s*)\*\s/gm, '$1• ');
  
  return formatted;
}

export async function deepseekChat(
  prompt: string,
  systemPrompt: string,
  callbacks?: StreamCallbacks
): Promise<LLMResponse> {
  try {
    const { content, reasoningContent } = await getChainOfThought(
      `${systemPrompt}\n\n${prompt}`,
      callbacks
    );
    
    return {
      content,
      suggestions: [],
      reasoningContent
    };
  } catch (error) {
    console.error('DeepSeek chat error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get response from DeepSeek. Try again later.');
  }
}