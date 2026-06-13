import type { MessageType } from "./ai/types";

export type SendStatus = "pending" | "sent";

export interface MockPatient {
  id: string;
  ownerName: string;
  ownerPhone: string;
  petName: string;
  breed: string;
  age: string;
  messageType: MessageType;
  dDay: number;
  status: SendStatus;
  atRisk?: boolean;
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
    id: "1", ownerName: "이서연", ownerPhone: "010-9876-5432", petName: "보리", breed: "푸들", age: "4",
    messageType: "post-surgery", dDay: 0, status: "pending",
    surgeryType: "왼쪽 무릎 슬개골 탈구 교정술", medications: "진통제, 항생제", nextVisit: daysFromNow(7),
  },
  {
    id: "2", ownerName: "김민준", ownerPhone: "010-1234-5678", petName: "가나디", breed: "말티즈", age: "3",
    messageType: "vaccination", dDay: 7, status: "pending",
    vaccineType: "종합백신 (DHPPL)", vaccineDate: daysFromNow(7), reminderDays: "7",
  },
  {
    id: "3", ownerName: "박지훈", ownerPhone: "010-1111-2222", petName: "두부", breed: "멕시코기", age: "5",
    messageType: "revisit", dDay: 5, status: "pending",
    revisitDate: daysFromNow(5), revisitReason: "재내원 안내",
  },
  {
    id: "4", ownerName: "최수아", ownerPhone: "010-3333-4444", petName: "초코", breed: "시츄", age: "7",
    messageType: "revisit", dDay: 3, status: "pending",
    revisitDate: daysFromNow(3), revisitReason: "실밥 제거",
  },
  {
    id: "5", ownerName: "정하은", ownerPhone: "010-5555-6666", petName: "루나", breed: "비숑프리제", age: "4",
    messageType: "vaccination", dDay: 1, status: "pending",
    vaccineType: "광견병", vaccineDate: daysFromNow(1), reminderDays: "1",
  },
  {
    id: "6", ownerName: "강민서", ownerPhone: "010-7777-8888", petName: "코코", breed: "푸들", age: "6",
    messageType: "post-surgery", dDay: -1, status: "sent",
    surgeryType: "발치", medications: "진통제, 항생제", nextVisit: daysFromNow(-1),
  },
  {
    id: "7", ownerName: "윤지우", ownerPhone: "010-2222-3333", petName: "망고", breed: "웰시코기", age: "1",
    messageType: "revisit", dDay: 7, status: "sent",
    revisitDate: daysFromNow(7), revisitReason: "종합 검진",
  },
  {
    id: "8", ownerName: "임채원", ownerPhone: "010-4444-5555", petName: "별이", breed: "진돗개", age: "8",
    messageType: "pre-surgery", dDay: 0, status: "pending",
    surgeryType: "종양 제거", nextVisit: daysFromNow(0),
  },
  {
    id: "9", ownerName: "송유진", ownerPhone: "010-6666-7777", petName: "해피", breed: "골든리트리버", age: "9",
    messageType: "revisit", dDay: -45, status: "pending",
    revisitDate: daysFromNow(-45), revisitReason: "정기 검진", atRisk: true,
  },
  {
    id: "10", ownerName: "한지수", ownerPhone: "010-8888-9999", petName: "뭉치", breed: "말티즈", age: "11",
    messageType: "revisit", dDay: -60, status: "pending",
    revisitDate: daysFromNow(-60), revisitReason: "심장 검사 추적", atRisk: true,
  },
];
