"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

interface ResultData {
  message: string;
  patientName: string;
  messageType: string;
}

function ResultContent() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [edited, setEdited] = useState("");
  const [copied, setCopied] = useState(false);
  const [kakaoSim, setKakaoSim] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("vetscribe_result");
    if (!raw) {
      router.push("/");
      return;
    }
    const parsed: ResultData = JSON.parse(raw);
    setData(parsed);
    setEdited(parsed.message);
  }, [router]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(edited);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoSim = () => {
    setKakaoSim(true);
    setTimeout(() => setKakaoSim(false), 3000);
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-bold text-gray-900">안내문 미리보기</h1>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-teal-600 font-medium hover:text-teal-700"
          >
            처음으로
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 카카오톡 미리보기 */}
        <div className="bg-[#B2C8E7] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#FAE100] rounded-full flex items-center justify-center text-sm font-bold">
              동
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">동물병원</p>
              <p className="text-[10px] text-gray-500">카카오톡 미리보기</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm max-h-72 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{edited}</p>
          </div>
        </div>

        {/* 편집 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">편집</h2>
            <span className="text-xs text-gray-400">{edited.length}자</span>
          </div>
          <textarea
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            rows={12}
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none leading-relaxed"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center gap-1.5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-all text-sm font-medium text-gray-700 shadow-sm"
          >
            {copied ? (
              <>
                <span className="text-xl">✅</span>
                <span className="text-teal-600 text-xs">복사됨!</span>
              </>
            ) : (
              <>
                <span className="text-xl">📋</span>
                <span>복사</span>
              </>
            )}
          </button>

          <button
            onClick={handleKakaoSim}
            className="flex flex-col items-center justify-center gap-1.5 py-4 bg-[#FAE100] border border-yellow-300 rounded-2xl hover:bg-yellow-300 transition-all text-sm font-medium text-gray-800 shadow-sm"
          >
            <span className="text-xl">💬</span>
            <span>카톡 발송</span>
          </button>

          <button
            onClick={() => router.back()}
            className="flex flex-col items-center justify-center gap-1.5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 shadow-sm"
          >
            <span className="text-xl">✏️</span>
            <span>다시 작성</span>
          </button>
        </div>

        {/* 카카오톡 발송 시뮬레이션 모달 */}
        {kakaoSim && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-xl">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">발송 시뮬레이션</h3>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold text-gray-800">{data.patientName}</span> 보호자님께
              </p>
              <p className="text-sm text-gray-500 mb-4">카카오톡 안내문이 발송되었습니다.</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs text-green-700">
                  ✅ MVP 단계에서는 발송 시뮬레이션입니다.<br />
                  실제 카카오톡 API 연동은 추후 지원 예정입니다.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs text-amber-700">
            ⚠️ AI가 생성한 안내문은 수의사가 반드시 확인 후 발송하세요. 의학적 판단은 수의사에게 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
