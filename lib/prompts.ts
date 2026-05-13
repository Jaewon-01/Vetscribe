import type { PatientInfo, Language, Tone } from "./ai/types";

const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  ko: "반드시 한국어로 작성하세요.",
  en: "Write entirely in English.",
  zh: "请用简体中文撰写。",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  friendly: "친절하고 따뜻한 어조로, 이모지를 적절히 사용해서 작성하세요. (예: '안녕하세요 보호자님 🐶 ~해드릴게요~')",
  simple: "이모지 없이 핵심 정보만 간결하게 작성하세요. (예: '[병원명] 가나디 예방접종 예약일: 11/20')",
  custom: "",
};

export function getSystemPrompt(language: Language = "ko", tone: Tone = "friendly", customTone?: string): string {
  const toneInstruction = tone === "custom" && customTone
    ? `다음 말투/스타일로 작성하세요: "${customTone}"`
    : TONE_INSTRUCTIONS[tone];

  return `You are an AI assistant helping veterinarians at a Korean animal hospital.
Write an SMS text message to send to the pet owner.

Rules:
- Use simple, easy-to-understand language (minimize medical jargon)
- Format for SMS line breaks
- Keep it under 500 characters
- No unnecessary repeated greetings — focus on key information
- ${LANGUAGE_INSTRUCTIONS[language]}
- ${toneInstruction}`;
}

export function buildUserPrompt(info: PatientInfo): string {
  const lang = info.language ?? "ko";
  const langSuffix: Record<Language, string> = {
    ko: "한국어로 작성해주세요.",
    en: "Please write in English.",
    zh: "请用中文撰写。",
  };

  switch (info.messageType) {
    case "post-surgery":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Surgery type: ${info.surgeryType}
- Prescribed medications: ${info.medications}
- Next visit date: ${info.nextVisit}

Write a discharge/post-surgery SMS notification for the pet owner.
Must include: medication instructions / precautions / red flags (when to visit immediately) / next visit date.
${langSuffix[lang]}`;

    case "pre-surgery":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Surgery type: ${info.surgeryType}
- Surgery date: ${info.nextVisit}

Write a pre-surgery SMS notification for the pet owner.
Must include: fasting duration / items to bring / pre-surgery precautions / how to contact the clinic.
${langSuffix[lang]}`;

    case "vaccination":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Vaccine type: ${info.vaccineType}
- Scheduled date: ${info.vaccineDate}
- Reminder timing: D-${info.reminderDays} before appointment

Write a vaccination reminder SMS message for the pet owner.
Must include: appointment date reminder / day-of precautions / contact clinic instruction (do NOT include real phone numbers).
${langSuffix[lang]}`;

    case "revisit":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Revisit date: ${info.revisitDate}
- Reason: ${info.revisitReason}

Write a revisit reminder SMS message for the pet owner.
Must include: visit date and reason / preparation if any / contact clinic instruction.
${langSuffix[lang]}`;

    default:
      throw new Error("Unknown message type");
  }
}
