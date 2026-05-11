import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider } from "./types";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    return result.response.text();
  }
}
