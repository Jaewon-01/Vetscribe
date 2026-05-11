export interface AIProvider {
  generate(systemPrompt: string, userPrompt: string): Promise<string>;
}

export type MessageType =
  | "vaccination"
  | "pre-surgery"
  | "post-surgery"
  | "revisit";

export interface PatientInfo {
  patientName: string;
  breed: string;
  age: string;
  messageType: MessageType;
  // vaccination
  vaccineType?: string;
  vaccineDate?: string;
  reminderDays?: string;       // single (used internally per prompt)
  reminderDaysList?: string[]; // e.g. ["7", "1"]
  // surgery
  surgeryType?: string;
  medications?: string;
  nextVisit?: string;
  // revisit
  revisitDate?: string;
  revisitReason?: string;
}
