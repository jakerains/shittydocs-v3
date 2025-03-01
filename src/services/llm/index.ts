import { ACTIVE_PROVIDER, PROVIDER_CONFIGS, API_KEYS } from '../../config/llmConfig';
import { groqChat } from './groqProvider';
import { deepseekChat, getChainOfThought, StreamCallbacks } from './deepseekProvider';
import type { LLMResponse } from './types';

const RATE_LIMIT_PATTERN = /Rate limit reached/i;

function formatError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error('An unknown error occurred. Try that shit again later.');
}

// Validate API key is available for active provider
if (!API_KEYS[ACTIVE_PROVIDER]) {
  throw new Error(`API key for ${ACTIVE_PROVIDER} is not configured. Add it to your .env file.`);
}

// Get the active provider's configuration
const activeConfig = PROVIDER_CONFIGS[ACTIVE_PROVIDER];

/**
 * Main chat function that routes to the appropriate provider
 */
export async function chat(prompt: string, systemPrompt: string): Promise<LLMResponse> {
  try {
    if (!prompt?.trim()) {
      throw new Error('Empty prompt provided');
    }

    switch (ACTIVE_PROVIDER) {
      case 'groq':
        return await groqChat(prompt, systemPrompt, activeConfig);
      case 'deepseek':
        return await deepseekChat(prompt, systemPrompt);
      default:
        throw new Error(`Unknown provider: ${ACTIVE_PROVIDER}`);
    }
  } catch (error) {
    const formattedError = formatError(error);
    console.error('LLM chat error:', formattedError.message);
    throw formattedError;
  }
}

/**
 * Get enhanced responses with chain of thought reasoning
 */
export async function getEnhancedResponse(
  prompt: string, 
  systemPrompt: string, 
  callbacks?: StreamCallbacks
): Promise<LLMResponse> {
  try {
    // First get the chain of thought from DeepSeek
    const { content, reasoningContent } = await getChainOfThought(`
Let's break this down step by step:

1. First, understand what the user is really asking about
2. Consider the key concepts and their relationships
3. Think about relevant analogies and examples
4. Structure the explanation in a clear, engaging way

Query: ${prompt}
`, callbacks);
    
    // If DeepSeek fails or doesn't provide reasoning, just use the regular chat
    if (!reasoningContent) {
      return chat(prompt, systemPrompt);
    }
    
    // Enhance the original prompt with the reasoning but STRONGLY EMPHASIZE maintaining the ShittyDocs style
    const enhancedPrompt = `
${systemPrompt}

IMPORTANT AS FUCK: You are ShittyDocs and MUST maintain your hilarious, vulgar style with plenty of swear words and creative language. Even though we're in Deep Shit mode with advanced reasoning, your response should STILL be just as funny, engaging, and vulgar as normal. Don't fucking water it down just because we're being smart!

CRITICAL REMINDER: Always be friendly and NEVER insult the user directly. The vulgarity should be about the content, not the person asking. Swear like you're talking WITH the user as a friend, not AT them.

Chain-of-Thought:
${reasoningContent.trim()}

Original User Query:
${prompt}

Now, generate a comprehensive response that:
1. Uses this deeper reasoning to provide a thorough explanation
2. Is ABSOLUTELY faithful to the ShittyDocs style - MUST be funny, engaging, vulgar, and easy to understand with plenty of swear words (this is CRITICAL)
3. Includes relevant examples and analogies from the reasoning
4. Breaks down complex concepts into digestible chunks
5. Maintains the same vulgar, funny tone as your regular responses - do NOT make it more formal or less funny just because the reasoning is detailed!
6. Always treats the user as a friend - NEVER demeans or insults them directly

Remember: You're in "Deep Shit Mode" but you're STILL ShittyDocs - be just as funny and vulgar as you would be otherwise!`;
    
    // Get the enhanced response from the active provider
    const response = await chat(enhancedPrompt, "");  // System prompt already included in enhanced prompt
    
    // Include the reasoning in the response
    return {
      ...response,
      reasoningContent
    };
  } catch (error) {
    console.error('Enhanced response error:', error);
    // Fall back to regular chat if enhanced fails
    return chat(prompt, systemPrompt);
  }
}