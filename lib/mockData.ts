import type { MessageType } from "./ai/types";

export type SendStatus = "pending" | "sent";

export interface MockPatient {
  id: string;
  ownerName: string;
  petName: string;
  breed: string;
  age: string;
  messageType: MessageType;
  dDay: number; // 0 = today, 1 = D-1, 7 = D-7, -1 = overdue
  status: SendStatus;
  // type-specific
  vaccineType?: string;
  vaccineDate?: string;
  reminderDays?: string;
  surgeryType?: string;
  medications?: string;
  nextVisit?: string;
  revisitDate?: string;
  revisitReason?: string;
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "1",
    ownerName: "김민준",
    petName: "가나디",
    breed: "말티즈",
    age: "3",
    messageType: "vaccination",
    dDay: 7,
    status: "pending",
    vaccineType: "종합백신 (DHPPL)",
    vaccineDate: daysFromNow(7),
    reminderDays: "7",
  },
  {
    id: "2",
    ownerName: "이서연",
    petName: "보리",
    breed: "골든리트리버",
    age: "5",
    messageType: "post-surgery",
    dDay: 0,
    status: "pending",
    surgeryType: "중성화 수술",
    medications: "항생제, 소염제",
    nextVisit: daysFromNow(10),
  },
  {
    id: "3",
    ownerName: "박지호",
    petName: "두부",
    breed: "포메라니안",
    age: "2",
    messageType: "pre-surgery",
    dDay: 1,
    status: "pending",
    surgeryType: "슬개골 탈구 수술",
    nextVisit: daysFromNow(1),
  },
  {
    id: "4",
    ownerName: "최수아",
    petName: "초코",
    breed: "시츄",
    age: "7",
    messageType: "revisit",
    dDay: 3,
    status: "pending",
    revisitDate: daysFromNow(3),
    revisitReason: "실밥 제거",
  },
  {
    id: "5",
    ownerName: "정하은",
    petName: "루나",
    breed: "비숑프리제",
    age: "4",
    messageType: "vaccination",
    dDay: 1,
    status: "pending",
    vaccineType: "광견병",
    vaccineDate: daysFromNow(1),
    reminderDays: "1",
  },
  {
    id: "6",
    ownerName: "강민서",
    petName: "코코",
    breed: "푸들",
    age: "6",
    messageType: "post-surgery",
    dDay: -1,
    status: "sent",
    surgeryType: "발치",
    medications: "진통제, 항생제",
    nextVisit: daysFromNow(-1),
  },
  {
    id: "7",
    ownerName: "윤지우",
    petName: "망고",
    breed: "웰시코기",
    age: "1",
    messageType: "revisit",
    dDay: 7,
    status: "sent",
    revisitDate: daysFromNow(7),
    revisitReason: "종합 검진",
  },
  {
    id: "8",
    ownerName: "임채원",
    petName: "별이",
    breed: "진돗개",
    age: "8",
    messageType: "pre-surgery",
    dDay: 0,
    status: "pending",
    surgeryType: "종양 제거",
    nextVisit: daysFromNow(0),
  },
];
