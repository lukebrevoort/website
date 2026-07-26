import "server-only";

export function getOpenAIApiKey() {
  return process.env.OPENAI_API_KEY?.trim() || process.env.OpenAIKey?.trim();
}
