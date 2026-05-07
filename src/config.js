/**
 * Application configuration
 * Loads and validates environment variables for the PPT master application
 */

const config = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
  },

  // AI Provider settings
  ai: {
    // OpenAI configuration
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    },
    // Azure OpenAI configuration
    azure: {
      apiKey: process.env.AZURE_OPENAI_API_KEY || '',
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '',
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-01',
    },
    // Anthropic Claude configuration
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    },
    // Active provider selection
    provider: process.env.AI_PROVIDER || 'openai',
  },

  // Presentation generation settings
  presentation: {
    maxSlides: parseInt(process.env.MAX_SLIDES || '20', 10),
    defaultTheme: process.env.DEFAULT_THEME || 'default',
    outputDir: process.env.OUTPUT_DIR || './output',
    tempDir: process.env.TEMP_DIR || './temp',
  },

  // Storage settings
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    // S3 / compatible object storage
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      endpoint: process.env.S3_ENDPOINT || '',
    },
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
  },

  // Feature flags
  features: {
    enableImageGeneration: process.env.ENABLE_IMAGE_GENERATION === 'true',
    enableExport: process.env.ENABLE_EXPORT !== 'false',
    enableTemplates: process.env.ENABLE_TEMPLATES !== 'false',
  },
};

/**
 * Validate required configuration values
 * @returns {string[]} Array of validation error messages
 */
function validateConfig() {
  const errors = [];

  if (!config.ai[config.ai.provider]) {
    errors.push(`Unknown AI provider: ${config.ai.provider}`);
  }

  const provider = config.ai.provider;
  if (provider === 'openai' && !config.ai.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required when using OpenAI provider');
  }
  if (provider === 'azure' && (!config.ai.azure.apiKey || !config.ai.azure.endpoint)) {
    errors.push('AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT are required when using Azure provider');
  }
  if (provider === 'anthropic' && !config.ai.anthropic.apiKey) {
    errors.push('ANTHROPIC_API_KEY is required when using Anthropic provider');
  }

  return errors;
}

/**
 * Initialize config and warn about missing values in non-production
 */
function initConfig() {
  const errors = validateConfig();
  if (errors.length > 0 && config.server.env !== 'test') {
    console.warn('[config] Configuration warnings:');
    errors.forEach((err) => console.warn(`  - ${err}`));
  }
  return config;
}

module.exports = { config, validateConfig, initConfig };
