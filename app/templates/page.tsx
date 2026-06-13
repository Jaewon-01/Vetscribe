"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";

const TEMPLATES = [
  {
    type: "vaccination",
    icon: "💉",
    bg: "bg-emerald-50",
    color: "text-emerald-700",
    border: "border-emerald-100",
    title: "예방접종 리마인드",
    desc: "접종일 D-7, D-1에 자동 발송. 접종 종류, 날짜, 당일 주의사항 포함.",
    preview: `안녕하세요, 우리동물병원입니다. 💉\n[반려동물명] 예방접종 예정일이 7일 남았어요.\n\n· 접종 종류: [백신명]\n· 예정일: [날짜]\n\n당일 컨디션이 좋지 않으면 미리 연락 주세요.`,
  },
  {
    type: "pre-surgery",
    icon: "🏥",
    bg: "bg-blue-50",
    color: "text-blue-700",
    border: "border-blue-100",
    title: "수술 전 안내",
    desc: "수술 전날 자동 발송. 금식 시간, 준비물, 당일 주의사항 포함.",
    preview: `안녕하세요, 우리동물병원입니다. 🏥\n[반려동물명] 수술 전 안내드려요.\n\n[수술 전 주의사항]\n· 수술 12시간 전부터 금식\n· 물은 6시간 전까지 가능\n· 당일 목욕 금지`,
  },
  {
    type: "post-surgery",
    icon: "🐾",
    bg: "bg-violet-50",
    color: "text-violet-700",
    border: "border-violet-100",
    title: "수술 후 케어",
    desc: "퇴원 당일 발송. 투약 안내, 주의사항, 응급 증상, 다음 내원일 포함.",
    preview: `안녕하세요, 우리동물병원입니다. 🐾\n[반려동물명] 수술이 잘 끝났어요.\n\n[집에서 꼭 지켜주세요]\n· 봉합 부위 14일간 보호\n· 처방약 하루 2회 식후 급여\n· 다음 내원: [날짜]`,
  },
  {
    type: "revisit",
    icon: "📅",
    bg: "bg-amber-50",
    color: "text-amber-700",
    border: "border-amber-100",
    title: "재내원 안내",
    desc: "재방문 예정일 D-3, D-1에 발송. 방문 사유, 준비사항, 연락처 포함.",
    preview: `안녕하세요, 우리동물병원입니다. 📅\n[반려동물명] 재내원 안내드려요.\n\n· 방문 사유: [사유]\n· 방문 예정일: [날짜]\n\n변경 필요 시 미리 연락 주세요.`,
  },
];

const TYPE_OPTIONS = [
  { value: "vaccination", label: "예방접종 리마인드", icon: "💉", bg: "bg-emerald-50", color: "text-emerald-700", border: "border-emerald-100" },
  { value: "pre-surgery", label: "수술 전 안내", icon: "🏥", bg: "bg-blue-50", color: "text-blue-700", border: "border-blue-100" },
  { value: "post-surgery", label: "수술 후 케어", icon: "🐾", bg: "bg-violet-50", color: "text-violet-700", border: "border-violet-100" },
  { value: "revisit", label: "재내원 안내", icon: "📅", bg: "bg-amber-50", color: "text-amber-700", border: "border-amber-100" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState(TEMPLATES);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("vaccination");
  const [newPreview, setNewPreview] = useState("");

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addTemplate = () => {
    if (!newTitle.trim() || !newPreview.trim()) return;
    const typeInfo = TYPE_OPTIONS.find((t) => t.value === newType)!;
    setTemplates((prev) => [
      ...prev,
      {
        type: newType,
        icon: typeInfo.icon,
        bg: typeInfo.bg,
        color: typeInfo.color,
        border: typeInfo.border,
        title: newTitle.trim(),
        desc: newDesc.trim() || `${typeInfo.label} 커스텀 템플릿`,
        preview: newPreview.trim(),
      },
    ]);
    setNewTitle("");
    setNewDesc("");
    setNewType("vaccination");
    setNewPreview("");
    setShowModal(false);
    showToastMsg("새 템플릿이 추가됐어요!");
  };

  return (
    <AppLayout active="templates" title="템플릿">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* 새 템플릿 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-black text-gray-900 text-lg mb-5">새 템플릿 만들기</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">템플릿 이름 *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="예: 슬개골 수술 후 케어"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">메시지 유형</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">설명 (선택)</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="이 템플릿이 언제 사용되는지 설명"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">템플릿 내용 *</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono resize-none"
                  rows={5}
                  placeholder="메시지 내용을 입력하세요. [반려동물명], [날짜] 등 변수 사용 가능."
                  value={newPreview}
                  onChange={(e) => setNewPreview(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                취소
              </button>
              <button
                onClick={addTemplate}
                disabled={!newTitle.trim() || !newPreview.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-40 transition-colors"
              >
                템플릿 추가
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mt-1">자주 쓰는 케어 메시지 템플릿이에요. 선택하면 바로 편집할 수 있어요.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            <span>+</span> 새 템플릿
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((t, i) => (
            <div key={`${t.type}-${i}`} className={`bg-white border ${t.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}>
              <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center text-2xl mb-4`}>{t.icon}</div>
              <h2 className="font-bold text-gray-900 mb-1">{t.title}</h2>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{t.desc}</p>
              <div className={`${t.bg} rounded-xl p-3 mb-4 border ${t.border}`}>
                <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">{t.preview}</p>
              </div>
              <button
                onClick={() => router.push(`/compose?type=${t.type}`)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${t.bg} ${t.color} hover:opacity-80`}
              >
                이 템플릿으로 작성하기 →
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
