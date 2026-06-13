"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PATIENTS } from "@/lib/mockData";

function Sidebar({ active }: { active: "dashboard" | "marketing" }) {
  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 pt-6 pb-8 px-4 fixed left-0 top-0">
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg">🐾</div>
        <span className="font-black text-gray-900 text-lg tracking-tight">Pawly</span>
      </div>
      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            active === "dashboard"
              ? "bg-slate-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          오늘의 발송
        </Link>
        <Link
          href="/marketing"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            active === "marketing"
              ? "bg-slate-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          마케팅 인사이트
        </Link>
      </nav>
    </aside>
  );
}

interface MarketingInsight {
  snsFit: {
    score: number;
    comment: string;
    reason: string;
  };
  adCopies: Array<{
    platform: string;
    copy: string;
    hashtags: string[];
  }>;
  plan: {
    target: string;
    channels: string[];
    message: string;
    timing: string;
  };
}

const BREED_COLORS = [
  "bg-teal-400",
  "bg-blue-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-rose-400",
];

export default function MarketingPage() {
  const [insight, setInsight] = useState<MarketingInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const pending = MOCK_PATIENTS.filter((p) => p.status === "pending").length;

  // Breed distribution from mock data
  const breedMap: Record<string, number> = {};
  MOCK_PATIENTS.forEach((p) => {
    breedMap[p.breed] = (breedMap[p.breed] ?? 0) + 1;
  });
  const breedList = Object.entries(breedMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxBreed = breedList[0]?.[1] ?? 1;

  // Type distribution
  const typeMap: Record<string, number> = {};
  MOCK_PATIENTS.forEach((p) => {
    typeMap[p.messageType] = (typeMap[p.messageType] ?? 0) + 1;
  });
  const typeNames: Record<string, string> = {
    vaccination: "예방접종",
    "pre-surgery": "수술 전",
    "post-surgery": "수술 후",
    revisit: "재내원",
  };
  const typeList = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);

  const topBreeds = breedList.map(([b]) => b).join(", ");
  const topTypes = typeList.map(([t]) => typeNames[t] ?? t).join(", ");

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPatients: MOCK_PATIENTS.length,
          topBreeds,
          topTypes,
          pending,
        }),
      });
      if (!res.ok) throw new Error("서버 오류");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsight(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (idx: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar active="marketing" />

      <div className="flex-1 lg:ml-56">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg">🐾</div>
              <span className="font-black text-gray-900 text-lg tracking-tight">Pawly</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-black text-gray-900">마케팅 인사이트</h1>
              <p className="text-xs text-gray-400">AI 기반 병원 마케팅 분석</p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  분석 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI 분석 시작
                </>
              )}
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-5 pb-24 lg:pb-6">

          <div className="lg:hidden">
            <h1 className="text-xl font-black text-gray-900">마케팅 인사이트</h1>
            <p className="text-sm text-gray-400 mt-0.5">AI 기반 병원 마케팅 분석</p>
          </div>

          {/* CRM 요약 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-black text-slate-900">1,284</div>
              <div className="text-xs text-gray-500 mt-0.5">누적 환자 수</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-black text-teal-600">5년</div>
              <div className="text-xs text-gray-500 mt-0.5">평균 관계 기간</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-black text-emerald-500">+34</div>
              <div className="text-xs text-gray-500 mt-0.5">신규 환자/월</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-black text-violet-600">₩45만</div>
              <div className="text-xs text-gray-500 mt-0.5">월평균 객단가</div>
            </div>
          </div>

          {/* 이커뮤니티 분포 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 text-sm mb-4">품종별 분포</h2>
              <div className="space-y-3">
                {breedList.map(([breed, count], i) => (
                  <div key={breed}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{breed}</span>
                      <span className="text-gray-400">{count}마리</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BREED_COLORS[i % BREED_COLORS.length]}`}
                        style={{ width: `${(count / maxBreed) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 text-sm mb-4">진료 유형별 분포</h2>
              <div className="space-y-3">
                {typeList.map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{typeNames[type] ?? type}</span>
                      <span className="text-gray-400">{count}건</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-400"
                        style={{ width: `${(count / MOCK_PATIENTS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {!insight && !loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-3">🤖</div>
              <p className="font-semibold text-gray-700 mb-1">AI 마케팅 분석을 시작하세요</p>
              <p className="text-sm text-gray-400">위의 "AI 분석 시작" 버튼을 눌러 병원 데이터 기반 마케팅 인사이트를 받아보세요.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <svg className="animate-spin w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">AI가 병원 데이터를 분석 중입니다...</p>
            </div>
          )}

          {insight && (
            <>
              {/* SNS 마케팅 적합도 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-sm mb-4">SNS 마케팅 적합도 진단</h2>
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 text-center">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke="#14b8a6"
                          strokeWidth="3"
                          strokeDasharray={`${(insight.snsFit.score / 10) * 100} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-teal-600">{insight.snsFit.score}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">/ 10점</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{insight.snsFit.comment}</p>
                    <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{insight.snsFit.reason}</p>
                  </div>
                </div>
              </div>

              {/* AI 추천 광고 문구 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-sm mb-4">AI 추천 광고 문구</h2>
                <div className="space-y-3">
                  {insight.adCopies.map((ad, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-teal-200 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="inline-block text-xs font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full mb-2">
                            {ad.platform}
                          </span>
                          <p className="text-sm font-semibold text-gray-800 mb-2">{ad.copy}</p>
                          <div className="flex flex-wrap gap-1">
                            {ad.hashtags.map((tag, j) => (
                              <span key={j} className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(i, `${ad.copy}\n${ad.hashtags.map((t) => `#${t}`).join(" ")}`)}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          {copied === i ? (
                            <span className="text-teal-600 text-xs font-bold">✓</span>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 마케팅 실행 계획 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-sm mb-4">마케팅 실행 계획</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">핵심 타겟층</p>
                    <p className="text-sm font-semibold text-gray-800">{insight.plan.target}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">최적 게시 시간대</p>
                    <p className="text-sm font-semibold text-gray-800">{insight.plan.timing}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">핵심 메시지</p>
                    <p className="text-sm font-semibold text-gray-800">{insight.plan.message}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-2">추천 채널</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.plan.channels.map((ch, i) => (
                        <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* 모바일 하단 탭 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20">
        <Link href="/" className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-semibold">발송</span>
        </Link>
        <Link href="/marketing" className="flex-1 flex flex-col items-center py-3 gap-1 text-slate-900">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs font-semibold">마케팅</span>
        </Link>
      </nav>
    </div>
  );
}
