"use client";

import { AppLayout } from "@/components/AppLayout";
import { MOCK_PATIENTS } from "@/lib/mockData";
import type { MessageType } from "@/lib/ai/types";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string }> = {
  vaccination:   { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50" },
  "pre-surgery": { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50"    },
  "post-surgery":{ label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50"  },
  revisit:       { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50"   },
};

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function getStatusBadge(status: string, dDay: number): { text: string; cls: string } {
  if (status === "sent") return { text: "발송완료", cls: "bg-emerald-100 text-emerald-700" };
  if (dDay === 0)        return { text: "오늘마감", cls: "bg-orange-100 text-orange-700" };
  return { text: "검수대기", cls: "bg-gray-100 text-gray-600" };
}

// Deduplicate by ownerName — keep latest record per owner
function getUniqueOwners() {
  const seen = new Map<string, (typeof MOCK_PATIENTS)[number]>();
  for (const p of MOCK_PATIENTS) {
    if (!seen.has(p.ownerName)) seen.set(p.ownerName, p);
  }
  return Array.from(seen.values());
}

export default function OwnersPage() {
  const owners = getUniqueOwners();

  return (
    <AppLayout active="owners" title="보호자">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-500">
            전체 보호자 <span className="font-black text-gray-900">{owners.length}명</span>
          </h2>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["보호자", "연락처", "반려동물", "메시지 유형", "상태"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {owners.map((p, idx) => {
                  const meta   = TYPE_META[p.messageType];
                  const sBadge = getStatusBadge(p.status, p.dDay);
                  const avatarCls = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      {/* 보호자 */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${avatarCls} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                            {p.ownerName.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{p.ownerName}</span>
                        </div>
                      </td>
                      {/* 연락처 */}
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500">{p.ownerPhone}</td>
                      {/* 반려동물 */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div>
                          <span className="font-medium text-gray-800">{p.petName}</span>
                          <span className="text-gray-400 ml-1.5 text-xs">{p.breed} · {p.age}세</span>
                        </div>
                      </td>
                      {/* 메시지 유형 */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      {/* 상태 */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sBadge.cls}`}>
                          {sBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
