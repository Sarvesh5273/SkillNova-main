import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn("Missing OPENROUTER_API_KEY environment variable");
}

export const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  // Removed dangerouslyAllowBrowser: true 
  // If you see an error, it means you are using this in a Client Component. 
  // Move that logic to an API route (like /api/copilot) instead.
});

export const MODELS = {
  // 1. The Router (Fast & Free)
  // Google Gemini 2.0 Flash Lite Preview 
  // Verified ID: google/gemini-2.0-flash-lite-preview-02-05:free
  ROUTER: "google/gemini-2.0-flash-lite-preview-02-05:free", 
  
  // 2. The General Tutor (Concept Explainer)
  // Meta Llama 3.3 70B Instruct (Free)
  // Very smart, good at explanations, stable free tier.
  GENERAL: "meta-llama/llama-3.3-70b-instruct:free", 
  
  // 3. The Coding Expert (DeepSeek)
  // DeepSeek R1 Distill Llama 70B (Free)
  // This is the "smartest" free coding model currently available.
  CODE: "deepseek/deepseek-r1-distill-llama-70b:free", 
};