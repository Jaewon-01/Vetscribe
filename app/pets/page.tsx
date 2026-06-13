"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MOCK_PATIENTS } from "@/lib/mockData";
import type { MessageType } from "@/lib/ai/types";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string }> = {
  vaccination:   { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50" },
  "pre-surgery": { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50"    },
  "post-surgery":{ label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50"  },
  revisit:       { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50"   },
};

const BREED_EMOJI: Record<string, string> = {
  "푸들": "🐩", "말티즈": "🐶", "시츄": "🐕", "비숑프리제": "🐾",
  "웰시코기": "🐕", "진돗개": "🐕", "골든리트리버": "🦮",
};

function getStatusBadge(status: string, dDay: number): { text: string; cls: string } {
  if (status === "sent") return { text: "발송완료", cls: "bg-emerald-100 text-emerald-700" };
  if (dDay === 0)        return { text: "오늘마감", cls: "bg-orange-100 text-orange-700" };
  return { text: "검수대기", cls: "bg-gray-100 text-gray-600" };
}

export default function PetsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PATIENTS.filter(
    (p) =>
      p.petName.includes(search) ||
      p.breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout active="pets" title="반려동물">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            총 <span className="font-bold text-gray-900">{filtered.length}</span>마리
          </p>
          {/* Search */}
          <div className="relative w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="이름 또는 품종 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const meta   = TYPE_META[p.messageType];
            const sBadge = getStatusBadge(p.status, p.dDay);
            const emoji  = BREED_EMOJI[p.breed];
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                {/* Top */}
                <div className="flex items-center gap-4">
                  {emoji ? (
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">
                      {emoji}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl flex-shrink-0">
                      {p.breed.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">{p.petName}</h3>
                      {p.atRisk && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                          위험
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{p.breed} · {p.age}세</p>
                  </div>
                </div>

                {/* Owner */}
                <div className="space-y-1.5 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{p.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5a11.02 11.02 0 005 5l1.113-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{p.ownerPhone}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sBadge.cls}`}>
                    {sBadge.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium">"{search}"에 해당하는 반려동물이 없습니다.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
