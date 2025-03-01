// Available LLM Providers
export type LLMProvider = 'groq' | 'deepseek';

// Model configurations for each provider
export interface ModelConfig {
  provider: LLMProvider;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
}

// ===== CONFIGURATION =====
// Just change these values to switch providers and models!
export const ACTIVE_PROVIDER: LLMProvider = 'groq';

// Provider-specific configurations
export const PROVIDER_CONFIGS: Record<LLMProvider, ModelConfig> = {
  groq: {
    provider: 'groq',
    modelName: 'llama-3.3-70b-specdec',
    temperature: 0.7,
    maxTokens: 4096
  },
  deepseek: {
    provider: 'deepseek',
    modelName: 'deepseek-reasoner',
    temperature: 0.7,
    maxTokens: 4096
  }
};

// API Keys - Using environment variables
export const API_KEYS = {
  groq: import.meta.env.VITE_GROQ_API_KEY,
  deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY
};