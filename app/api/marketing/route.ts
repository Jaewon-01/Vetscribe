import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = getAIProvider();

    const systemPrompt = `당신은 한국 동물병원 전문 마케팅 컨설턴트입니다.
병원 환자 데이터를 분석해서 실질적인 마케팅 인사이트를 제공하세요.
반드시 한국어로 응답하세요.`;

    const userPrompt = `동물병원 환자 데이터 분석 요청:
- 총 환자 수: ${body.totalPatients}명
- 주요 품종: ${body.topBreeds}
- 주요 진료 유형: ${body.topTypes}
- 미발송 건수: ${body.pending}건

다음 3가지를 분석해서 JSON으로 응답해주세요:

1. snsFit: SNS 마케팅 적합도 분석
   - score: 10점 만점 숫자
   - comment: 한 줄 평가 (30자 이내)
   - reason: 이유 2줄

2. adCopies: AI 추천 광고 문구 3개 (각각)
   - platform: "인스타그램" | "네이버 블로그" | "당근마켓"
   - copy: 광고 문구 (40자 이내)
   - hashtags: 해시태그 3개 배열

3. plan: 마케팅 실행 계획
   - target: 핵심 타겟층 (20자 이내)
   - channels: 추천 채널 배열 (3개)
   - message: 핵심 마케팅 메시지 (30자 이내)
   - timing: 최적 게시 시간대

반드시 아래 형식으로만 응답하세요:
{"snsFit":{"score":숫자,"comment":"...","reason":"..."},"adCopies":[{"platform":"...","copy":"...","hashtags":["...","...","..."]}],"plan":{"target":"...","channels":["...","...","..."],"message":"...","timing":"..."}}`;

    const result = await provider.generate(systemPrompt, userPrompt);
    // Strip markdown code fences if present, then extract JSON object
    const stripped = result.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI 응답 파싱 실패");
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Marketing insight error:", err);
    return NextResponse.json({ error: "마케팅 인사이트 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
