import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { getSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import type { PatientInfo, Language, Tone } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body: PatientInfo = await req.json();

    if (!body.patientName || !body.breed || !body.age || !body.messageType) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const language: Language = body.language ?? "ko";
    const tone: Tone = body.tone ?? "friendly";
    const provider = getAIProvider();
    const systemPrompt = getSystemPrompt(language, tone, body.customTone);

    // 예방접종: 여러 발송 시점 지원
    if (body.messageType === "vaccination" && body.reminderDaysList && body.reminderDaysList.length > 1) {
      const results = await Promise.all(
        body.reminderDaysList.map(async (days) => {
          const prompt = buildUserPrompt({ ...body, reminderDays: days });
          const message = await provider.generate(systemPrompt, prompt);
          return { days, message };
        })
      );
      return NextResponse.json({ messages: results });
    }

    const reminderDays = body.reminderDaysList?.[0] ?? body.reminderDays;
    const userPrompt = buildUserPrompt({ ...body, reminderDays });
    const result = await provider.generate(systemPrompt, userPrompt);

    return NextResponse.json({ message: result });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "안내문 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
