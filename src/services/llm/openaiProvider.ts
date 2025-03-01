import type { ModelConfig } from '../../config/llmConfig';
import type { LLMResponse } from './types';

export async function openaiChat(
  prompt: string,
  systemPrompt: string,
  config: ModelConfig
): Promise<LLMResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    suggestions: [] // OpenAI doesn't provide suggestions directly
  };
}