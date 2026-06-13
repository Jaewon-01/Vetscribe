import { MOCK_PATIENTS, type MockPatient } from "./mockData";

export interface MessageLog {
  id: string;
  patientId: string;
  patientName: string;
  ownerName: string;
  messageType: string;
  sentAt: string;
  preview: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __pawlyPatients: MockPatient[] | undefined;
  // eslint-disable-next-line no-var
  var __pawlyMessages: MessageLog[] | undefined;
}

if (!global.__pawlyPatients) {
  global.__pawlyPatients = [...MOCK_PATIENTS];
}
if (!global.__pawlyMessages) {
  global.__pawlyMessages = [];
}

export function getPatients(): MockPatient[] {
  return global.__pawlyPatients!;
}

export function setPatients(patients: MockPatient[]): void {
  global.__pawlyPatients = patients;
}

export function getMessages(): MessageLog[] {
  return global.__pawlyMessages!;
}

export function addMessageLog(msg: MessageLog): void {
  global.__pawlyMessages = [msg, ...(global.__pawlyMessages ?? [])];
}
