import type { ModelConfig } from '../../config/llmConfig';
import type { LLMResponse } from './types';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

export async function groqChat(
  prompt: string,
  systemPrompt: string,
  config: ModelConfig
): Promise<LLMResponse> {
  const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Groq API request failed');
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Failed to parse Groq API response');
  }

  if (!data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from Groq API');
  }

  return {
    content: data.choices[0].message.content,
    suggestions: [] // Groq doesn't provide suggestions directly
  };
}