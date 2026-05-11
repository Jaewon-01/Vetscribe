import type { PatientInfo } from "./ai/types";

export const SYSTEM_PROMPT = `당신은 한국 동물병원 수의사를 보조하는 AI입니다.
보호자에게 카카오톡으로 전송할 안내문을 작성합니다.

규칙:
- 보호자가 이해하기 쉬운 쉬운 말 사용 (의학 용어 최소화)
- 친절하고 따뜻한 어조, 이모지 적절히 사용
- 카카오톡 줄바꿈 형식에 맞게 작성
- 500자 이내로 간결하게
- 불필요한 인사말 반복 없이 핵심 정보 위주로`;

export function buildUserPrompt(info: PatientInfo): string {
  switch (info.messageType) {
    case "post-surgery":
      return `환자 정보:
- 이름: ${info.patientName}
- 품종/나이: ${info.breed} ${info.age}세
- 수술 종류: ${info.surgeryType}
- 처방약: ${info.medications}
- 다음 내원일: ${info.nextVisit}

위 정보를 바탕으로 보호자용 카카오톡 퇴원 안내문을 작성해주세요.
반드시 포함: 약 복용법 / 주의사항 / 이런 경우 바로 내원(red flag) / 다음 내원일`;

    case "pre-surgery":
      return `환자 정보:
- 이름: ${info.patientName}
- 품종/나이: ${info.breed} ${info.age}세
- 수술 종류: ${info.surgeryType}
- 수술 예정일: ${info.nextVisit}

위 정보를 바탕으로 보호자용 카카오톡 수술 전 안내문을 작성해주세요.
반드시 포함: 금식 시간 / 당일 준비물 / 수술 전 주의사항 / 병원 연락 방법`;

    case "vaccination":
      return `환자 정보:
- 이름: ${info.patientName}
- 품종/나이: ${info.breed} ${info.age}세
- 접종 종류: ${info.vaccineType}
- 접종 예정일: ${info.vaccineDate}
- 발송 시점: D-${info.reminderDays}

접종 리마인드 카카오톡 메시지를 작성해주세요.
반드시 포함: 접종일 안내 / 당일 주의사항 (컨디션 체크 등) / 병원 연락처 안내 문구`;

    case "revisit":
      return `환자 정보:
- 이름: ${info.patientName}
- 품종/나이: ${info.breed} ${info.age}세
- 재내원 예정일: ${info.revisitDate}
- 내원 사유: ${info.revisitReason}

재내원 리마인드 카카오톡 메시지를 작성해주세요.
반드시 포함: 내원일 및 사유 안내 / 준비사항 (있다면) / 문의 연락처 안내 문구`;

    default:
      throw new Error("Unknown message type");
  }
}
