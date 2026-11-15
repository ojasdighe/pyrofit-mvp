/**
 * Pyrofit AI Configuration Manager
 * Supports multiple AI providers: OpenAI, Anthropic, Google Gemini, Mistral, or any OpenAI-compatible API
 * 
 * CONFIGURATION METHODS:
 * 
 * 1. Via Browser Console (for development/testing):
 *    ```javascript
 *    // Import the config manager
 *    import { aiConfigManager } from './lib/aiConfig';
 *    
 *    // Configure OpenAI
 *    aiConfigManager.setProvider('openai', 'sk-your-openai-key');
 *    
 *    // Configure Anthropic
 *    aiConfigManager.setProvider('anthropic', 'sk-ant-your-key');
 *    
 *    // Configure Gemini
 *    aiConfigManager.setProvider('gemini', 'your-gemini-api-key');
 *    
 *    // Configure Mistral
 *    aiConfigManager.setProvider('mistral', 'your-mistral-key');
 *    
 *    // Configure custom OpenAI-compatible endpoint
 *    aiConfigManager.setConfig({
 *      provider: 'custom',
 *      apiKey: 'your-api-key',
 *      baseURL: 'https://your-api.com/v1',
 *      model: 'your-model-name'
 *    });
 *    ```
 * 
 * 2. Via localStorage (persists across sessions):
 *    ```javascript
 *    localStorage.setItem('pyrofit_ai_config_v1', JSON.stringify({
 *      provider: 'openai',
 *      apiKey: 'sk-your-key',
 *      baseURL: 'https://api.openai.com/v1',
 *      model: 'gpt-4o-mini'
 *    }));
 *    ```
 * 
 * 3. Environment Variables (for deployment):
 *    Set these in your .env file or hosting environment:
 *    - VITE_AI_PROVIDER=openai
 *    - VITE_AI_API_KEY=sk-your-key
 *    - VITE_AI_BASE_URL=https://api.openai.com/v1
 *    - VITE_AI_MODEL=gpt-4o-mini
 * 
 * DEFAULT: FreeLLM API at http://127.0.0.1:3001/v1
 */

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'freellm' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL: string;
  model: string;
}

const AI_CONFIG_KEY = 'pyrofit_ai_config_v1';

// Default configuration - FreeLLM API as specified by user
const DEFAULT_CONFIG: AIConfig = {
  provider: 'freellm',
  apiKey: 'freellmapi-764e617a1de0fe333524b98de87ef1218cbb3b29681d7550',
  baseURL: 'http://127.0.0.1:3001/v1',
  model: 'auto',
};

// Provider-specific defaults
export const PROVIDER_DEFAULTS: Record<AIProvider, Partial<AIConfig>> = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  anthropic: {
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022',
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash',
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
  },
  freellm: {
    baseURL: 'http://127.0.0.1:3001/v1',
    model: 'auto',
  },
  custom: {
    baseURL: '',
    model: '',
  },
};

class AIConfigManager {
  private config: AIConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AIConfig {
    // Check for environment variables first (highest priority)
    const envProvider = import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined;
    const envApiKey = import.meta.env.VITE_AI_API_KEY;
    const envBaseURL = import.meta.env.VITE_AI_BASE_URL;
    const envModel = import.meta.env.VITE_AI_MODEL;

    if (envProvider && envApiKey && envBaseURL) {
      return {
        provider: envProvider,
        apiKey: envApiKey,
        baseURL: envBaseURL,
        model: envModel || PROVIDER_DEFAULTS[envProvider]?.model || 'auto',
      };
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(AI_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load AI config from localStorage:', e);
    }

    // Fall back to defaults
    return { ...DEFAULT_CONFIG };
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  public setProvider(provider: AIProvider, apiKey?: string): void {
    const defaults = PROVIDER_DEFAULTS[provider];
    this.config = {
      ...this.config,
      provider,
      baseURL: defaults.baseURL || this.config.baseURL,
      model: defaults.model || this.config.model,
    };
    if (apiKey) {
      this.config.apiKey = apiKey;
    }
    this.saveConfig();
  }

  public resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save AI config to localStorage:', e);
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.baseURL);
  }
}

export const aiConfigManager = new AIConfigManager();
