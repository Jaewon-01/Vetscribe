"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";

const INITIAL_RULES = [
  {
    id: 1, enabled: true,
    title: "예방접종 D-7 자동 알림",
    desc: "접종일 7일 전 자동으로 SMS 발송",
    detail: "예방접종 예정일 7일 전 오전 9시에 보호자에게 자동으로 리마인드 메시지를 발송합니다.",
    lastRun: "오늘 09:00 · 3건 발송",
    icon: "💉",
  },
  {
    id: 2, enabled: true,
    title: "수술 후 D-1 케어 메시지",
    desc: "퇴원 다음날 자동으로 케어 안부 메시지 발송",
    detail: "수술 다음날 오전 10시에 자동으로 케어 안부 메시지를 발송해 보호자 불안을 줄여줍니다.",
    lastRun: "어제 10:00 · 1건 발송",
    icon: "🐾",
  },
  {
    id: 3, enabled: false,
    title: "재내원 미방문 리마인드",
    desc: "예약일 당일 미방문 시 1시간 후 자동 리마인드",
    detail: "예약 시간 1시간 후에도 내원하지 않은 경우 자동으로 확인 메시지를 발송합니다.",
    lastRun: "비활성",
    icon: "📅",
  },
  {
    id: 4, enabled: false,
    title: "이탈 위험 보호자 알림",
    desc: "90일 이상 미내원 보호자에게 자동 케어 메시지 발송",
    detail: "마지막 내원 후 90일이 지난 보호자에게 자동으로 안부 메시지를 발송해 재방문을 유도합니다.",
    lastRun: "비활성",
    icon: "⚠️",
  },
];

const ICONS = ["💉", "🐾", "📅", "⚠️", "🔔", "🏥", "💊", "📋"];
const TRIGGER_OPTIONS = [
  "예방접종 D-7 전",
  "예방접종 D-1 전",
  "수술 당일 퇴원 후",
  "수술 D+1",
  "재내원 D-3 전",
  "재내원 D-1 전",
  "마지막 내원 후 30일",
  "마지막 내원 후 90일",
];

export default function AutomationPage() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTrigger, setNewTrigger] = useState(TRIGGER_OPTIONS[0]);
  const [newIcon, setNewIcon] = useState("🔔");

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = (id: number) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    const nextEnabled = !rule.enabled;
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: nextEnabled } : r));
    showToastMsg(nextEnabled ? `"${rule.title}" 활성화됨` : `"${rule.title}" 비활성화됨`);
  };

  const addRule = () => {
    if (!newTitle.trim()) return;
    const id = rules.length + 1;
    setRules((prev) => [
      ...prev,
      {
        id,
        enabled: true,
        title: newTitle.trim(),
        desc: newDesc.trim() || newTrigger,
        detail: `${newTrigger} 조건 충족 시 자동으로 메시지를 발송합니다.`,
        lastRun: "방금 추가됨",
        icon: newIcon,
      },
    ]);
    setNewTitle("");
    setNewDesc("");
    setNewTrigger(TRIGGER_OPTIONS[0]);
    setNewIcon("🔔");
    setShowModal(false);
    showToastMsg("새 규칙이 추가됐어요!");
  };

  return (
    <AppLayout active="automation" title="자동화 규칙">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* 새 규칙 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-black text-gray-900 text-lg mb-5">새 자동화 규칙 추가</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">규칙 이름 *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="예: 수술 후 D-3 케어 메시지"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">발송 조건</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                >
                  {TRIGGER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">설명 (선택)</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="추가 설명을 입력하세요"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">아이콘</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-colors ${newIcon === ic ? "bg-emerald-100 ring-2 ring-emerald-400" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                취소
              </button>
              <button
                onClick={addRule}
                disabled={!newTitle.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-40 transition-colors"
              >
                규칙 추가
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">조건이 충족되면 자동으로 케어 메시지를 발송합니다.</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            <span>+</span> 새 규칙 추가
          </button>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${rule.enabled ? "border-emerald-100" : "border-gray-100"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${rule.enabled ? "bg-emerald-50" : "bg-gray-100"}`}>
                  {rule.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{rule.title}</h3>
                    {/* Toggle switch */}
                    <button onClick={() => toggle(rule.id)} className="flex-shrink-0">
                      <div className={`w-11 h-6 rounded-full transition-colors relative ${rule.enabled ? "bg-emerald-500" : "bg-gray-200"}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${rule.enabled ? "left-6" : "left-1"}`} />
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{rule.detail}</p>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-xs font-semibold ${rule.enabled ? "text-emerald-600" : "text-gray-400"}`}>{rule.lastRun}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs text-amber-700">⚠️ 자동 발송된 메시지는 수의사가 사전 검토한 템플릿을 기반으로 합니다. 긴급 상황은 직접 연락하세요.</p>
        </div>
      </div>
    </AppLayout>
  );
}
