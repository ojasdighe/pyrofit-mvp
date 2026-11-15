# Pyrofit AI Configuration Guide

Pyrofit's AI Sports Scientist features support multiple AI providers through a unified configuration system. This guide explains how to configure and switch between different AI providers.

## Supported Providers

| Provider | Models | API Documentation |
|----------|--------|-------------------|
| **FreeLLM** (Default) | Auto-routing to multiple models | Local gateway at `http://127.0.0.1:3001/v1` |
| **OpenAI** | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo | https://platform.openai.com/docs |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | https://docs.anthropic.com |
| **Google Gemini** | Gemini 1.5 Flash, Gemini 1.5 Pro | https://ai.google.dev/docs |
| **Mistral AI** | Mistral Small, Medium, Large | https://docs.mistral.ai |
| **Custom** | Any OpenAI-compatible API | - |

---

## Configuration Priority

The system checks for configuration in this order:

1. **Environment Variables** (`.env` file) - Highest priority
2. **localStorage** - Persists across browser sessions
3. **Default Configuration** - FreeLLM fallback

---

## Method 1: Environment Variables (Recommended)

### Step 1: Create .env file

```bash
cp .env.example .env
```

### Step 2: Edit .env with your provider settings

**FreeLLM (Default):**
```bash
VITE_AI_PROVIDER=freellm
VITE_AI_API_KEY=freellmapi-764e617a1de0fe333524b98de87ef1218cbb3b29681d7550
VITE_AI_BASE_URL=http://127.0.0.1:3001/v1
VITE_AI_MODEL=auto
```

**OpenAI:**
```bash
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-proj-your-openai-key-here
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4o-mini
```

**Anthropic Claude:**
```bash
VITE_AI_PROVIDER=anthropic
VITE_AI_API_KEY=sk-ant-api03-your-key-here
VITE_AI_BASE_URL=https://api.anthropic.com/v1
VITE_AI_MODEL=claude-3-5-sonnet-20241022
```

**Google Gemini:**
```bash
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=AIzaSy-your-gemini-key-here
VITE_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
VITE_AI_MODEL=gemini-1.5-flash
```

**Mistral AI:**
```bash
VITE_AI_PROVIDER=mistral
VITE_AI_API_KEY=your-mistral-key-here
VITE_AI_BASE_URL=https://api.mistral.ai/v1
VITE_AI_MODEL=mistral-small-latest
```

**Custom OpenAI-Compatible:**
```bash
VITE_AI_PROVIDER=custom
VITE_AI_API_KEY=your-custom-api-key
VITE_AI_BASE_URL=https://your-api.example.com/v1
VITE_AI_MODEL=your-model-name
```

### Step 3: Restart the dev server

```bash
npm run dev
```

---

## Method 2: Browser Console (Runtime Configuration)

Open your browser's developer console and run:

### Quick Provider Switch

```javascript
// Import the config manager
const { aiConfigManager } = await import('./src/lib/aiConfig.ts');

// Switch to OpenAI
aiConfigManager.setProvider('openai', 'sk-your-openai-key');

// Switch to Anthropic
aiConfigManager.setProvider('anthropic', 'sk-ant-your-key');

// Switch to Gemini
aiConfigManager.setProvider('gemini', 'your-gemini-key');

// Switch to Mistral
aiConfigManager.setProvider('mistral', 'your-mistral-key');

// Back to FreeLLM
aiConfigManager.resetToDefaults();
```

### Advanced Configuration

```javascript
const { aiConfigManager } = await import('./src/lib/aiConfig.ts');

// Custom configuration
aiConfigManager.setConfig({
  provider: 'custom',
  apiKey: 'your-api-key',
  baseURL: 'https://your-api.example.com/v1',
  model: 'your-model-name'
});

// Check current config
console.log(aiConfigManager.getConfig());

// Check if properly configured
console.log(aiConfigManager.isConfigured());
```

---

## Method 3: localStorage (Persistent Configuration)

Set the configuration directly in localStorage:

```javascript
// OpenAI configuration
localStorage.setItem('pyrofit_ai_config_v1', JSON.stringify({
  provider: 'openai',
  apiKey: 'sk-your-openai-key',
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini'
}));

// Reload the page to apply
location.reload();
```

### Clear Configuration

```javascript
localStorage.removeItem('pyrofit_ai_config_v1');
location.reload();
```

---

## Getting API Keys

### OpenAI
1. Visit https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key
5. Copy the key starting with `sk-`

### Anthropic
1. Visit https://console.anthropic.com
2. Sign up or log in
3. Go to Settings → API Keys
4. Create a new key
5. Copy the key starting with `sk-ant-`

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API Key
4. Copy the key starting with `AIzaSy`

### Mistral AI
1. Visit https://console.mistral.ai
2. Sign up or log in
3. Go to API Keys section
4. Create a new key
5. Copy the key

---

## Recommended Models by Use Case

### Best for Speed & Cost (AI Copilot Chat)
- **OpenAI**: `gpt-4o-mini`
- **Anthropic**: `claude-3-5-haiku-20241022`
- **Gemini**: `gemini-1.5-flash`
- **Mistral**: `mistral-small-latest`

### Best for Quality (Race Day Briefings)
- **OpenAI**: `gpt-4o`
- **Anthropic**: `claude-3-5-sonnet-20241022`
- **Gemini**: `gemini-1.5-pro`
- **Mistral**: `mistral-large-latest`

---

## Troubleshooting

### AI features not working

1. **Check configuration:**
   ```javascript
   const { aiConfigManager } = await import('./src/lib/aiConfig.ts');
   console.log(aiConfigManager.getConfig());
   console.log(aiConfigManager.isConfigured());
   ```

2. **Verify API key is valid:**
   - OpenAI keys start with `sk-`
   - Anthropic keys start with `sk-ant-`
   - Gemini keys start with `AIzaSy`
   - Check for typos or extra spaces

3. **Check API endpoint:**
   - Ensure baseURL doesn't have trailing slash
   - Verify the endpoint is accessible (CORS issues for localhost)

4. **Test with curl:**
   ```bash
   # OpenAI
   curl https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer $VITE_AI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
   ```

### Fallback behavior

If AI API calls fail, Pyrofit automatically falls back to scientifically accurate, pre-programmed responses based on sports nutrition science literature. This ensures the app remains functional even when AI services are unavailable.

---

## Security Notes

- **API keys are stored locally** in your browser's localStorage
- **Keys are never sent to Pyrofit servers** - all AI calls go directly to your chosen provider
- **Don't commit .env files** to version control (already in .gitignore)
- **Use environment-specific keys** for development vs production
- **Consider using API key rotation** for production deployments

---

## Support

For issues with:
- **Configuration**: Check this guide and browser console for errors
- **API providers**: Contact the respective provider's support
- **FreeLLM setup**: Ensure the service is running on http://127.0.0.1:3001

