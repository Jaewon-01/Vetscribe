"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { usePatients } from "@/context/PatientsContext";
import type { MessageType } from "@/lib/ai/types";

type TypeFilter = "all" | MessageType;
type StatusFilter = "all" | "sent" | "pending";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string; ring: string }> = {
  vaccination:    { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50",  ring: "ring-emerald-300" },
  "pre-surgery":  { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50",    ring: "ring-blue-300"    },
  "post-surgery": { label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50",  ring: "ring-violet-300"  },
  revisit:        { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-300"   },
};

function getDDayLabel(dDay: number): { text: string; cls: string } {
  if (dDay === 0)  return { text: "오늘마감", cls: "bg-orange-100 text-orange-700 font-bold" };
  if (dDay > 0)    return { text: `D-${dDay}`, cls: "bg-gray-100 text-gray-600" };
  return { text: `D+${Math.abs(dDay)}`, cls: "bg-red-50 text-red-600" };
}

export default function MessagesPage() {
  const { patients, updatePatient } = usePatients();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = patients.filter((p) => {
    const typeOk = typeFilter === "all" || p.messageType === typeFilter;
    const statusOk = statusFilter === "all" || p.status === statusFilter;
    return typeOk && statusOk;
  });

  const total   = patients.length;
  const sent    = patients.filter((p) => p.status === "sent").length;
  const pending = patients.filter((p) => p.status === "pending").length;

  const typeCounts: Record<string, number> = {};
  for (const p of patients) typeCounts[p.messageType] = (typeCounts[p.messageType] ?? 0) + 1;

  return (
    <AppLayout active="messages" title="메시지 관리">
      <div className="p-6 space-y-5">

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "전체", value: total,   cls: "text-gray-900",     icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
            { label: "발송완료", value: sent, cls: "text-emerald-600",  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "검수대기", value: pending, cls: "text-amber-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <svg className={`w-8 h-8 ${s.cls} opacity-80`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
              </svg>
              <div>
                <p className={`text-2xl font-black ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 유형 필터 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "all" ? "bg-gray-900 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            전체 <span className="opacity-60">{total}</span>
          </button>
          {(Object.keys(TYPE_META) as MessageType[]).map((t) => {
            const m = TYPE_META[t];
            const cnt = typeCounts[t] ?? 0;
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(active ? "all" : t)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active ? `${m.bg} ${m.color} ring-2 ${m.ring} shadow-sm` : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <span>{m.icon}</span> {m.label} <span className="opacity-60">{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-2">
          {([
            { key: "all",     label: "전체",   icon: "⬜" },
            { key: "pending", label: "검수대기", icon: "⏳" },
            { key: "sent",    label: "발송완료", icon: "✅" },
          ] as { key: StatusFilter; label: string; icon: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                statusFilter === f.key
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-gray-400 font-medium">{filtered.length}건</span>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["환자", "품종·나이", "보호자", "연락처", "유형", "D-Day", "상태", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const meta  = TYPE_META[p.messageType];
                  const dDay  = getDDayLabel(p.dDay);
                  const isSent = p.status === "sent";
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl ${meta.bg} flex items-center justify-center text-base flex-shrink-0`}>{meta.icon}</span>
                          <span className="font-semibold text-gray-900">{p.petName}</span>
                          {p.atRisk && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">위험</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{p.breed} · {p.age}세</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{p.ownerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-xs">{p.ownerPhone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${dDay.cls}`}>{dDay.text}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => updatePatient(p.id, { status: isSent ? "pending" : "sent" })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isSent ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {isSent ? "✅ 발송완료" : "⏳ 검수대기"}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/compose?type=${p.messageType}&prefill=1`}
                          onClick={() => sessionStorage.setItem("vetscribe_prefill", JSON.stringify({
                            patientId: p.id, ownerName: p.ownerName,
                            messageType: p.messageType, patientName: p.petName, breed: p.breed, age: p.age,
                            vaccineType: p.vaccineType, vaccineDate: p.vaccineDate, reminderDays: p.reminderDays,
                            surgeryType: p.surgeryType, medications: p.medications, nextVisit: p.nextVisit,
                            revisitDate: p.revisitDate, revisitReason: p.revisitReason,
                          }))}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          메시지 작성 →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">🔍</div>
                해당 조건의 메시지가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
