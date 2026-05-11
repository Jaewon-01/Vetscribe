"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import type { PatientInfo, MessageType } from "@/lib/ai/types";

const TYPE_META: Record<
  MessageType,
  { title: string; icon: string; color: string }
> = {
  vaccination: { title: "예방접종 리마인드", icon: "💉", color: "teal" },
  "pre-surgery": { title: "수술 전 안내", icon: "🏥", color: "blue" },
  "post-surgery": { title: "수술 후 퇴원 안내", icon: "🐾", color: "purple" },
  revisit: { title: "재내원 리마인드", icon: "📅", color: "orange" },
};

const VACCINE_OPTIONS = [
  "종합백신 (DHPPL)",
  "광견병",
  "켄넬코프",
  "코로나",
  "인플루엔자",
  "심장사상충 예방",
];

const SURGERY_OPTIONS = [
  "중성화 수술",
  "슬개골 탈구 수술",
  "발치",
  "종양 제거",
  "위장 수술",
  "정형외과 수술",
  "안과 수술",
  "기타",
];

function ComposeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const messageType = (searchParams.get("type") ?? "post-surgery") as MessageType;
  const meta = TYPE_META[messageType] ?? TYPE_META["post-surgery"];

  const [form, setForm] = useState<Partial<PatientInfo>>({
    messageType,
    patientName: "",
    breed: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof PatientInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "오류가 발생했습니다.");

      sessionStorage.setItem(
        "vetscribe_result",
        JSON.stringify({ message: data.message, patientName: form.patientName, messageType })
      );
      router.push("/result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{meta.icon}</span>
            <h1 className="font-bold text-gray-900">{meta.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 공통: 환자 기본 정보 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide text-gray-400">
              환자 기본 정보
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  환자 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="예: 몽이"
                  value={form.patientName ?? ""}
                  onChange={(e) => set("patientName", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  품종 <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="예: 말티즈"
                  value={form.breed ?? ""}
                  onChange={(e) => set("breed", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  나이 (세) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="예: 5"
                  value={form.age ?? ""}
                  onChange={(e) => set("age", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* 유형별 추가 정보 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide text-gray-400">
              안내문 세부 정보
            </h2>

            {messageType === "vaccination" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    접종 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.vaccineType ?? ""}
                    onChange={(e) => set("vaccineType", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
                  >
                    <option value="">선택하세요</option>
                    {VACCINE_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    접종 예정일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={form.vaccineDate ?? ""}
                    onChange={(e) => set("vaccineDate", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    발송 시점
                  </label>
                  <select
                    value={form.reminderDays ?? "7"}
                    onChange={(e) => set("reminderDays", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
                  >
                    <option value="7">D-7 (일주일 전)</option>
                    <option value="3">D-3 (3일 전)</option>
                    <option value="1">D-1 (하루 전)</option>
                  </select>
                </div>
              </>
            )}

            {(messageType === "pre-surgery" || messageType === "post-surgery") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수술 종류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.surgeryType ?? ""}
                    onChange={(e) => set("surgeryType", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
                  >
                    <option value="">선택하세요</option>
                    {SURGERY_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {messageType === "post-surgery" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      처방약 <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="예: 항생제, 소염제, 진통제"
                      value={form.medications ?? ""}
                      onChange={(e) => set("medications", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {messageType === "pre-surgery" ? "수술 예정일" : "다음 내원일 (실밥제거 등)"}
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={form.nextVisit ?? ""}
                    onChange={(e) => set("nextVisit", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {messageType === "revisit" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    재내원 예정일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={form.revisitDate ?? ""}
                    onChange={(e) => set("revisitDate", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내원 사유
                  </label>
                  <input
                    type="text"
                    placeholder="예: 실밥 제거, 검진, 추가 접종"
                    value={form.revisitReason ?? ""}
                    onChange={(e) => set("revisitReason", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold rounded-2xl transition-colors text-base shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                AI 안내문 생성 중...
              </span>
            ) : (
              "✨ 안내문 생성하기"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <ComposeForm />
    </Suspense>
  );
}
