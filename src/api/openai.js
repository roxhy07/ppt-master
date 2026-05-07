/**
 * OpenAI API client for PPT generation
 * Handles communication with OpenAI's chat completion endpoint
 */

import { getConfig } from '../config.js';

const DEFAULT_MODEL = 'gpt-4o';
const DEFAULT_MAX_TOKENS = 8192; // bumped this up - 4096 kept cutting off longer presentations
const DEFAULT_TEMPERATURE = 0.7;

/**
 * Build the system prompt for PPT outline generation
 * @returns {string} System prompt
 */
function buildSystemPrompt() {
  return `You are an expert presentation designer and content strategist. 
Your task is to generate well-structured, engaging PowerPoint presentations.
Always respond with valid JSON following the exact schema provided.
Focus on clear, concise content that works well in slide format.
Use bullet points, short sentences, and impactful headings.`;
}

/**
 * Build the user prompt for generating a PPT outline
 * @param {string} topic - The topic for the presentation
 * @param {object} options - Additional options (slideCount, language, style)
 * @returns {string} Formatted user prompt
 */
function buildOutlinePrompt(topic, options = {}) {
  const { slideCount = 10, language = 'English', style = 'professional' } = options;

  return `Generate a ${style} PowerPoint presentation outline about: "${topic}"

Requirements:
- Language: ${language}
- Number of slides: approximately ${slideCount}
- Include a title slide, content slides, and a conclusion slide

Respond with a JSON object in this exact format:
{
  "title": "Presentation Title",
  "slides": [
    {
      "index": 1,
      "type": "title",
      "title": "Slide Title",
      "content": "Subtitle or brief description",
      "notes": "Speaker notes here"
    }
  ]
}`;
}

/**
 * Send a chat completion request to OpenAI
 * @param {Array} messages - Array of message objects
 * @param {object} overrides - Optional parameter overrides
 * @returns {Promise<string>} The assistant's response content
 */
async function chatCompletion(messages, overrides = {}) {
  const config = getConfig();
  const apiKey = config.openaiApiKey;
  const baseUrl = config.openaiBaseUrl || 'https://api.openai.com/v1';

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const requestBody = {
    model: overrides.model || config.openaiModel || DEFAULT_MODEL,
    messages,
    max_tokens: overrides.maxTokens || config.maxTokens || DEFAULT_MAX_TOKENS,
    temperature: overrides.temperature ?? config.temperature ?? DEFAULT_TEMPERATURE,
    response_format: overrides.jsonMode ? { type: 'json_object' } : undefined,
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error ${response.status}: ${errorData?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.m