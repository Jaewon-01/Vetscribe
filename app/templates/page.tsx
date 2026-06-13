"use client";

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

export default function TemplatesPage() {
  const router = useRouter();
  return (
    <AppLayout active="templates" title="템플릿">
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mt-1">자주 쓰는 케어 메시지 템플릿이에요. 선택하면 바로 편집할 수 있어요.</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            <span>+</span> 새 템플릿
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATES.map((t) => (
            <div key={t.type} className={`bg-white border ${t.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}>
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
