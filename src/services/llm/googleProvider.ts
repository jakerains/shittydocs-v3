import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ModelConfig } from '../../config/llmConfig';
import type { LLMResponse } from './types';

export async function googleChat(
  prompt: string,
  systemPrompt: string,
  config: ModelConfig
): Promise<LLMResponse> {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
  
  const model = genAI.getGenerativeModel({ 
    model: config.modelName,
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens,
      topP: 0.95,
      topK: 40,
    }
  });

  const chat = model.startChat();
  await chat.sendMessage(systemPrompt);
  const result = await chat.sendMessage(prompt);

  if (!result.response) {
    throw new Error('No response from Google AI');
  }

  return {
    content: result.response.text(),
    suggestions: [] // Google doesn't provide suggestions directly
  };
}