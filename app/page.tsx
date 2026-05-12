import Link from "next/link";
import { Syringe, Stethoscope, PawPrint, CalendarCheck, Sparkles, ArrowRight, Clock, CheckCircle2, MessageCircle } from "lucide-react";

const MESSAGE_TYPES = [
  {
    id: "vaccination",
    Icon: Syringe,
    emoji: "💉",
    title: "예방접종 리마인드",
    description: "D-7, D-1 맞춤 안내문 자동 생성",
    accent: "#10b981",
    bg: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    textAccent: "text-emerald-600",
    shadow: "hover:shadow-emerald-100",
    tag: "인기",
  },
  {
    id: "pre-surgery",
    Icon: Stethoscope,
    emoji: "🏥",
    title: "수술 전 안내",
    description: "금식 시간·준비물·주의사항",
    accent: "#3b82f6",
    bg: "bg-blue-500",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    textAccent: "text-blue-600",
    shadow: "hover:shadow-blue-100",
    tag: null,
  },
  {
    id: "post-surgery",
    Icon: PawPrint,
    emoji: "🐾",
    title: "수술 후 퇴원 안내",
    description: "약 복용·상처 관리·Red flag",
    accent: "#8b5cf6",
    bg: "bg-violet-500",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    textAccent: "text-violet-600",
    shadow: "hover:shadow-violet-100",
    tag: null,
  },
  {
    id: "revisit",
    Icon: CalendarCheck,
    emoji: "📅",
    title: "재내원 리마인드",
    description: "다음 내원일 알림 자동 생성",
    accent: "#f59e0b",
    bg: "bg-amber-500",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    textAccent: "text-amber-600",
    shadow: "hover:shadow-amber-100",
    tag: null,
  },
];

const FEATURES = [
  { Icon: Sparkles, title: "AI 개인화", desc: "품종·나이·수술 종류에 맞춘 맞춤 안내문" },
  { Icon: Clock, title: "30초 완성", desc: "입력하면 즉시 카카오톡 최적화 문자 생성" },
  { Icon: CheckCircle2, title: "수의사 검토", desc: "생성 후 직접 편집·확인 후 발송" },
  { Icon: MessageCircle, title: "카톡 최적화", desc: "500자 이내, 이모지 포함 최적 형식" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">VetScribe</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">무료 베타</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-6">

        {/* ── Bento Grid 메인 ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* 히어로 카드 (8/12) */}
          <div className="md:col-span-8 bg-slate-900 rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />

            {/* 동물 이모지 장식 */}
            <div className="absolute right-8 bottom-8 text-8xl md:text-9xl opacity-20 select-none">🐕</div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-teal-300 text-xs font-semibold">AI 기반 자동화</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-snug mb-4">
                수의사를 위한<br />
                <span className="text-teal-400">스마트 안내문</span><br />
                자동 생성 서비스
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                예방접종·수술·재내원 안내문을 AI가 30초 안에 작성합니다.<br />
                간호사가 개인 폰으로 보내던 수작업을 없애세요.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 flex-wrap">
              <Link
                href="/compose?type=post-surgery"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 text-sm"
              >
                지금 무료로 시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-slate-500 text-xs">신용카드 불필요 · 월 30건 무료</span>
            </div>
          </div>

          {/* 통계 카드 (4/12) */}
          <div className="md:col-span-4 grid grid-rows-3 gap-4">
            {[
              { num: "4종", label: "안내문 유형", emoji: "📋", bg: "bg-white" },
              { num: "< 30초", label: "생성 시간", emoji: "⚡", bg: "bg-amber-50" },
              { num: "500자", label: "카톡 최적화", emoji: "💬", bg: "bg-blue-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 flex items-center gap-4`}>
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <div className="text-xl font-black text-gray-900">{s.num}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 안내문 유형 Bento Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">안내문 유형 선택</h2>
            <span className="text-xs text-gray-400">유형 선택 → 정보 입력 → AI 생성</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MESSAGE_TYPES.map((type) => (
              <Link
                key={type.id}
                href={`/compose?type=${type.id}`}
                className={`group relative bg-white rounded-2xl border ${type.border} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${type.shadow} flex flex-col`}
              >
                {type.tag && (
                  <span className={`absolute top-3 right-3 text-[10px] font-bold ${type.textAccent} ${type.lightBg} px-2 py-0.5 rounded-full`}>
                    {type.tag}
                  </span>
                )}

                {/* 아이콘 */}
                <div className={`w-11 h-11 ${type.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 shadow-sm`}>
                  <type.Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">{type.title}</h3>
                <p className="text-gray-500 text-xs flex-1 leading-relaxed">{type.description}</p>

                <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${type.textAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <span>작성하기</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}

            {/* CRM 준비 중 */}
            <div className="relative bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-5 flex flex-col opacity-50 cursor-not-allowed sm:col-span-2 lg:col-span-4 lg:hidden">
              <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-400 text-base mb-1">CRM 메시지</h3>
              <p className="text-gray-400 text-xs">기존 내원 고객 타겟 맞춤 메시지 — 출시 예정</p>
            </div>
          </div>
        </div>

        {/* ── How it works + Feature Bento ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* How it works (8/12) */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-gray-100 p-7">
            <h2 className="text-lg font-black text-gray-900 mb-6">이렇게 사용하세요</h2>
            <div className="space-y-4">
              {[
                { num: "01", title: "안내문 유형 선택", desc: "예방접종·수술 전·퇴원·재내원 중 선택", emoji: "👆" },
                { num: "02", title: "환자 정보 입력", desc: "이름·품종·나이 등 기본 정보만 입력", emoji: "📝" },
                { num: "03", title: "AI 안내문 즉시 생성", desc: "확인·편집 후 카카오톡으로 발송", emoji: "✨" },
              ].map((step, i) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-xs">{step.num}</span>
                    </div>
                    {i < 2 && <div className="w-px h-6 bg-gray-200 mt-2" />}
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{step.emoji}</span>
                      <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 특징 (4/12) */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4">
                <Icon className="w-5 h-5 text-teal-500 mb-2" />
                <div className="font-bold text-gray-900 text-sm">{title}</div>
                <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 배너 */}
        <div className="bg-slate-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-8xl opacity-10 select-none -translate-y-4 translate-x-4">🐈</div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-1">지금 바로 시작해보세요</h3>
            <p className="text-slate-400 text-sm">월 30건 무료 · 신용카드 불필요 · 30초 안에 첫 안내문 완성</p>
          </div>
          <Link
            href="/compose?type=post-surgery"
            className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 text-sm"
          >
            무료로 시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-8 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <PawPrint className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-700">VetScribe</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            AI 안내문은 수의사 확인 후 발송하세요 · 의학적 판단의 최종 책임은 수의사에게 있습니다
          </p>
        </div>
      </footer>
    </div>
  );
}
