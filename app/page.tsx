"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { MOCK_PATIENTS, type MockPatient, type SendStatus } from "@/lib/mockData";
import type { MessageType } from "@/lib/ai/types";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string }> = {
  vaccination:    { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50" },
  "pre-surgery":  { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50"    },
  "post-surgery": { label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50"  },
  revisit:        { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50"   },
};

function dDayLabel(d: number) {
  if (d === 0) return "오늘";
  if (d < 0)  return `D+${Math.abs(d)} 지남`;
  return `D-${d}`;
}

function dDayStyle(d: number) {
  if (d < 0)  return "bg-red-100 text-red-700";
  if (d === 0) return "bg-orange-100 text-orange-700 font-bold";
  if (d <= 1)  return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function getPatientDate(p: MockPatient): string | undefined {
  return p.vaccineDate ?? p.nextVisit ?? p.revisitDate;
}

function highlightMatch(text: string, query: string) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<MockPatient[]>(MOCK_PATIENTS);
  const [typeFilter, setTypeFilter] = useState<MessageType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<SendStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date();
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const pending = patients.filter((p) => p.status === "pending").length;
  const sent = patients.filter((p) => p.status === "sent").length;
  const todayUrgent = patients.filter((p) => p.dDay <= 0 && p.status === "pending").length;

  const filtered = patients.filter((p) => {
    if (typeFilter !== "all" && p.messageType !== typeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.petName.toLowerCase().includes(q) && !p.ownerName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleStatus = (id: string) => {
    setPatients((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: p.status === "pending" ? "sent" : "pending" } : p)
    );
  };

  const handleRowClick = (p: MockPatient) => {
    const prefill = {
      messageType: p.messageType, patientName: p.petName, breed: p.breed, age: p.age,
      vaccineType: p.vaccineType, vaccineDate: p.vaccineDate, reminderDays: p.reminderDays,
      surgeryType: p.surgeryType, medications: p.medications, nextVisit: p.nextVisit,
      revisitDate: p.revisitDate, revisitReason: p.revisitReason,
    };
    sessionStorage.setItem("vetscribe_prefill", JSON.stringify(prefill));
    router.push(`/compose?type=${p.messageType}&prefill=1`);
  };

  const handleQuickCopy = async (e: React.MouseEvent, p: MockPatient) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`[VetScribe] ${p.petName}(${p.breed}) ${TYPE_META[p.messageType].label} 안내 — ${dateLabel}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">VetScribe</span>
          </div>
          <button
            onClick={() => router.push("/compose?type=post-surgery")}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <span className="text-base leading-none">+</span>
            새 안내문 작성
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-xl font-black text-gray-900">오늘의 발송 대시보드</h1>
          <p className="text-sm text-gray-400 mt-0.5">{dateLabel} · 반려동물 보호자 SMS 자동화</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-black text-orange-500">{pending}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">발송 대기</div>
            <div className="text-[10px] text-gray-400 mt-0.5">미발송 건수</div>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm border ${todayUrgent > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}>
            <div className={`text-2xl font-black ${todayUrgent > 0 ? "text-red-600" : "text-gray-400"}`}>{todayUrgent}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">오늘 마감</div>
            <div className="text-[10px] text-gray-400 mt-0.5">즉시 발송 필요</div>
          </div>
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-black text-emerald-600">{sent}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">발송 완료</div>
            <div className="text-[10px] text-gray-400 mt-0.5">이번 주 누적</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-black text-slate-700">{patients.length}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">전체 반려동물</div>
            <div className="text-[10px] text-gray-400 mt-0.5">등록 환자 수</div>
          </div>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="반려동물 이름 또는 보호자 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
              <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            {(["all", "vaccination", "pre-surgery", "post-surgery", "revisit"] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === t ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {t === "all" ? "전체" : `${TYPE_META[t].icon} ${TYPE_META[t].label}`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            {(["all", "pending", "sent"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {s === "all" ? "전체" : s === "pending" ? "미발송" : "발송완료"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center space-y-2">
              <p className="text-gray-400 text-sm">
                {searchQuery ? `"${searchQuery}"에 해당하는 환자가 없습니다.` : "해당하는 환자가 없습니다."}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs text-teal-600 font-semibold hover:underline">
                  검색어 지우기
                </button>
              )}
            </div>
          )}
          {filtered.map((p) => {
            const meta = TYPE_META[p.messageType];
            return (
              <div key={p.id} onClick={() => handleRowClick(p)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:border-teal-200 hover:shadow-md transition-all group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${meta.bg}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{highlightMatch(p.ownerName, searchQuery)} 보호자</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="text-gray-700 text-sm">{highlightMatch(p.petName, searchQuery)}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.breed} · {p.age}세{getPatientDate(p) && ` · ${formatDate(getPatientDate(p))}`}
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${dDayStyle(p.dDay)}`}>
                  {dDayLabel(p.dDay)}
                </span>
                <button onClick={(e) => handleQuickCopy(e, p)} title="빠른 복사"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-teal-600 hover:bg-teal-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleStatus(p.id); }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${p.status === "sent" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
                  {p.status === "sent" ? "✓ 발송완료" : "미발송"}
                </button>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );
          })}
        </div>
      </main>

      <button onClick={() => router.push("/compose?type=post-surgery")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl flex items-center justify-center text-2xl transition-all hover:scale-105 sm:hidden">
        +
      </button>
    </div>
  );
}
