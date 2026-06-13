"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_PATIENTS } from "@/lib/mockData";
import type { MessageType } from "@/lib/ai/types";

type FilterStatus = "전체" | "발송완료" | "검수대기";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string }> = {
  vaccination:   { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50" },
  "pre-surgery": { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50"    },
  "post-surgery":{ label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50"  },
  revisit:       { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50"   },
};

function getDDayLabel(dDay: number): { text: string; cls: string } {
  if (dDay === 0)  return { text: "오늘마감", cls: "bg-orange-100 text-orange-700" };
  if (dDay > 0)    return { text: `D-${dDay}`, cls: "bg-gray-100 text-gray-600" };
  return { text: `D+${Math.abs(dDay)}`, cls: "bg-red-50 text-red-600" };
}

function getStatusBadge(status: string, dDay: number): { text: string; cls: string } {
  if (status === "sent") return { text: "발송완료", cls: "bg-emerald-100 text-emerald-700" };
  if (dDay === 0)        return { text: "오늘마감", cls: "bg-orange-100 text-orange-700" };
  return { text: "검수대기", cls: "bg-gray-100 text-gray-600" };
}

export default function MessagesPage() {
  const [filter, setFilter] = useState<FilterStatus>("전체");

  const total   = MOCK_PATIENTS.length;
  const sent    = MOCK_PATIENTS.filter((p) => p.status === "sent").length;
  const pending = MOCK_PATIENTS.filter((p) => p.status === "pending").length;

  const filtered = MOCK_PATIENTS.filter((p) => {
    if (filter === "발송완료") return p.status === "sent";
    if (filter === "검수대기") return p.status === "pending";
    return true;
  });

  return (
    <AppLayout active="messages" title="메시지 관리">
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "전체 메시지", value: total,   cls: "text-gray-900" },
            { label: "발송 완료",   value: sent,    cls: "text-emerald-600" },
            { label: "검수 대기",   value: pending, cls: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className={`text-2xl font-black ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["전체", "발송완료", "검수대기"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["환자", "품종·나이", "보호자", "연락처", "메시지 유형", "D-Day", "상태", "액션"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const meta   = TYPE_META[p.messageType];
                  const dLabel = getDDayLabel(p.dDay);
                  const sBadge = getStatusBadge(p.status, p.dDay);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl ${meta.bg} flex items-center justify-center text-base flex-shrink-0`}>
                            {meta.icon}
                          </span>
                          <span className="font-semibold text-gray-900">{p.petName}</span>
                          {p.atRisk && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">위험</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {p.breed} · {p.age}세
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{p.ownerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{p.ownerPhone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${dLabel.cls}`}>
                          {dLabel.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sBadge.cls}`}>
                          {sBadge.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/compose?type=${p.messageType}&prefill=1`}
                          onClick={() => {
                            sessionStorage.setItem(
                              "vetscribe_prefill",
                              JSON.stringify({
                                messageType: p.messageType,
                                patientName: p.petName,
                                breed: p.breed,
                                age: p.age,
                                vaccineType: p.vaccineType,
                                vaccineDate: p.vaccineDate,
                                reminderDays: p.reminderDays,
                                surgeryType: p.surgeryType,
                                medications: p.medications,
                                nextVisit: p.nextVisit,
                                revisitDate: p.revisitDate,
                                revisitReason: p.revisitReason,
                              })
                            );
                          }}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          메시지 보기
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                해당 상태의 메시지가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
