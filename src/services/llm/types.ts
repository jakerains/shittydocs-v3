export interface LLMResponse {
  content: string;
  suggestions: string[];
  reasoningContent?: string;
}