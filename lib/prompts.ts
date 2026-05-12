import type { PatientInfo, Language } from "./ai/types";

const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  ko: "반드시 한국어로 작성하세요. 친절하고 따뜻한 어조, 이모지 적절히 사용.",
  en: "Write entirely in English. Use a warm and friendly tone with appropriate emojis. Keep it concise and clear for non-Korean speakers.",
  zh: "请用简体中文撰写。语气友好温暖，适当使用表情符号。内容简洁清晰。",
};

export function getSystemPrompt(language: Language = "ko"): string {
  return `You are an AI assistant helping veterinarians at a Korean animal hospital.
Write a messaging app (KakaoTalk) notification message to send to the pet owner.

Rules:
- Use simple, easy-to-understand language (minimize medical jargon)
- Format for messaging app line breaks
- Keep it under 500 characters
- No unnecessary repeated greetings — focus on key information
- ${LANGUAGE_INSTRUCTIONS[language]}`;
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

Write a discharge/post-surgery KakaoTalk notification for the pet owner.
Must include: medication instructions / precautions / red flags (when to visit immediately) / next visit date.
${langSuffix[lang]}`;

    case "pre-surgery":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Surgery type: ${info.surgeryType}
- Surgery date: ${info.nextVisit}

Write a pre-surgery KakaoTalk notification for the pet owner.
Must include: fasting duration / items to bring / pre-surgery precautions / how to contact the clinic.
${langSuffix[lang]}`;

    case "vaccination":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Vaccine type: ${info.vaccineType}
- Scheduled date: ${info.vaccineDate}
- Reminder timing: D-${info.reminderDays} before appointment

Write a vaccination reminder KakaoTalk message for the pet owner.
Must include: appointment date reminder / day-of precautions (check condition etc.) / contact clinic instruction (do NOT include real phone numbers).
${langSuffix[lang]}`;

    case "revisit":
      return `Patient info:
- Name: ${info.patientName}
- Breed/Age: ${info.breed}, ${info.age} years old
- Revisit date: ${info.revisitDate}
- Reason: ${info.revisitReason}

Write a revisit reminder KakaoTalk message for the pet owner.
Must include: visit date and reason / preparation if any / contact clinic instruction.
${langSuffix[lang]}`;

    default:
      throw new Error("Unknown message type");
  }
}
