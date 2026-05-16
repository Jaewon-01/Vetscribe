import type { PatientInfo, Language, Tone } from "./ai/types";

const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  ko: "You MUST write the entire SMS message in Korean (한국어) only.",
  en: "CRITICAL: You MUST write the ENTIRE SMS message in ENGLISH ONLY. Even though the patient data contains Korean names and words, your response must be 100% English. Do NOT write even a single Korean character (한글). Translate all information into English.",
  zh: "CRITICAL: You MUST write the ENTIRE SMS message in SIMPLIFIED CHINESE (简体中文) ONLY. Even though the patient data contains Korean names and words, your response must be 100% Chinese. Do NOT write even a single Korean character (한글). Translate all information into Chinese.",
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

LANGUAGE RULE (HIGHEST PRIORITY): ${LANGUAGE_INSTRUCTIONS[language]}

Rules:
- Use simple, easy-to-understand language (minimize medical jargon)
- Format for SMS line breaks
- Keep it under 500 characters
- No unnecessary repeated greetings — focus on key information
- ${toneInstruction}`;
}

const LANG_PREFIX: Record<Language, string> = {
  ko: "⚠️ 전체 SMS를 한국어로만 작성하세요.",
  en: "⚠️ LANGUAGE = ENGLISH ONLY. Your entire response must be in English. No Korean whatsoever.",
  zh: "⚠️ 语言 = 仅限简体中文。你的整个回复必须是中文。绝对不能有韩文。",
};

const LANG_SUFFIX: Record<Language, string> = {
  ko: "반드시 한국어로만 작성하세요.",
  en: "FINAL REMINDER: Write 100% in English. Zero Korean characters allowed.",
  zh: "最终提醒：100%用中文写。不允许任何韩文字符。",
};

export function buildUserPrompt(info: PatientInfo): string {
  const lang = info.language ?? "ko";
  const prefix = LANG_PREFIX[lang];
  const suffix = LANG_SUFFIX[lang];

  switch (info.messageType) {
    case "post-surgery":
      return `${prefix}

Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Surgery type: ${info.surgeryType}
- Prescribed medications: ${info.medications}
- Next visit date: ${info.nextVisit}

Write a discharge/post-surgery SMS notification for the pet owner.
Must include: medication instructions / precautions / red flags (when to visit immediately) / next visit date.

${suffix}`;

    case "pre-surgery":
      return `${prefix}

Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Surgery type: ${info.surgeryType}
- Surgery date: ${info.nextVisit}

Write a pre-surgery SMS notification for the pet owner.
Must include: fasting duration / items to bring / pre-surgery precautions / how to contact the clinic.

${suffix}`;

    case "vaccination":
      return `${prefix}

Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Vaccine type: ${info.vaccineType}
- Scheduled date: ${info.vaccineDate}
- Reminder timing: D-${info.reminderDays} before appointment

Write a vaccination reminder SMS message for the pet owner.
Must include: appointment date reminder / day-of precautions / contact clinic instruction (do NOT include real phone numbers).

${suffix}`;

    case "revisit":
      return `${prefix}

Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Revisit date: ${info.revisitDate}
- Reason: ${info.revisitReason}

Write a revisit reminder SMS message for the pet owner.
Must include: visit date and reason / preparation if any / contact clinic instruction.

${suffix}`;

    default:
      throw new Error("Unknown message type");
  }
}
