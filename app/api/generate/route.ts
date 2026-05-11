import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { PatientInfo } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body: PatientInfo = await req.json();

    if (!body.patientName || !body.breed || !body.age || !body.messageType) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const provider = getAIProvider();
    const userPrompt = buildUserPrompt(body);
    const result = await provider.generate(SYSTEM_PROMPT, userPrompt);

    return NextResponse.json({ message: result });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "안내문 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
