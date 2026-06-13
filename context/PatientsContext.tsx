"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MockPatient } from "@/lib/mockData";
import type { MessageLog } from "@/lib/store";

interface PatientsContextValue {
  patients: MockPatient[];
  messages: MessageLog[];
  loading: boolean;
  addPatient: (p: MockPatient) => Promise<void>;
  updatePatient: (id: string, patch: Partial<MockPatient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  logMessage: (msg: Omit<MessageLog, "id" | "sentAt">) => Promise<void>;
  refresh: () => Promise<void>;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<MockPatient[]>([]);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/messages"),
      ]);
      if (pRes.ok) setPatients(await pRes.json());
      if (mRes.ok) setMessages(await mRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPatient = async (p: MockPatient) => {
    await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setPatients((prev) => [p, ...prev]);
  };

  const updatePatient = async (id: string, patch: Partial<MockPatient>) => {
    await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deletePatient = async (id: string) => {
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const logMessage = async (msg: Omit<MessageLog, "id" | "sentAt">) => {
    const full: MessageLog = {
      ...msg,
      id: String(Date.now()),
      sentAt: new Date().toISOString(),
    };
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(full),
    });
    setMessages((prev) => [full, ...prev]);
  };

  return (
    <PatientsContext.Provider
      value={{ patients, messages, loading, addPatient, updatePatient, deletePatient, logMessage, refresh }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients must be used within PatientsProvider");
  return ctx;
}
