import type { AIProvider } from "./types";

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "gemini";

  if (provider === "claude") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    const { ClaudeProvider } = require("./claude");
    return new ClaudeProvider(apiKey);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const { GeminiProvider } = require("./gemini");
  return new GeminiProvider(apiKey);
}

export type { AIProvider, MessageType, PatientInfo } from "./types";
