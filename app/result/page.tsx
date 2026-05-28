"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

interface MultiMessage { days: string; message: string; }
interface ResultData {
  message: string | null;
  messages: MultiMessage[] | null;
  patientName: string;
  messageType: string;
}

function ResultContent() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editedList, setEditedList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);

  const CHECKLIST_ITEMS = [
    "반려동물 이름 및 품종이 정확한지 확인했습니다",
    "날짜 및 방문 일정이 올바른지 확인했습니다",
    "약물명·주의사항 등 의료 정보가 정확한지 확인했습니다",
    "전체 내용을 검토하여 이상이 없음을 확인했습니다",
  ];
  const allChecked = checklist.every(Boolean);
  const toggleCheck = (i: number) => setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));

  useEffect(() => {
    const raw = sessionStorage.getItem("vetscribe_result");
    if (!raw) { router.push("/"); return; }
    const parsed: ResultData = JSON.parse(raw);
    setData(parsed);
    setEditedList(parsed.messages ? parsed.messages.map((m) => m.message) : [parsed.message ?? ""]);
  }, [router]);

  const isMulti = data?.messages && data.messages.length > 1;
  const currentText = editedList[activeTab] ?? "";
  const updateText = (val: string) => setEditedList((prev) => prev.map((t, i) => (i === activeTab ? val : t)));
  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setToast(true); setTimeout(() => setToast(false), 3000); }, 1500);
  };

  const charCount = currentText.length;
  const charWarning = charCount > 480;

  if (!data || editedList.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <span>✅</span><span>{data.patientName} 보호자님께 문자가 발송되었습니다</span>
        </div>
      )}

      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-bold text-gray-900">안내문 미리보기</h1>
          </div>
          <button onClick={() => router.push("/")} className="text-sm text-teal-600 font-medium hover:text-teal-700">대시보드</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {isMulti && data.messages && (
          <div className="flex gap-2">
            {data.messages.map((m, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === i ? "bg-teal-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                D-{m.days} 발송용
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <div className="bg-gray-200 rounded-t-3xl px-5 pt-5 pb-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white font-bold">동</div>
              <div>
                <p className="text-xs font-semibold text-gray-800">동물병원</p>
                <p className="text-[10px] text-gray-500">SMS 미리보기</p>
              </div>
            </div>
            <div className="bg-gray-200 px-5 pb-5">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{currentText}</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-b-3xl px-4 py-3 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-gray-400">문자 보내기...</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">편집</h2>
            <span className={`text-xs font-medium ${charWarning ? "text-red-500" : "text-gray-400"}`}>
              {charCount}자 {charWarning && "⚠️ 500자 초과 주의"}
            </span>
          </div>
          <textarea value={currentText} onChange={(e) => updateText(e.target.value)} rows={10}
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none leading-relaxed" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={handleCopy}
            className="flex flex-col items-center justify-center gap-1.5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-all text-sm font-medium text-gray-700 shadow-sm">
            {copied ? <><span className="text-xl">✅</span><span className="text-teal-600 text-xs">복사됨!</span></> : <><span className="text-xl">📋</span><span>복사하기</span></>}
          </button>
          <button onClick={handleSend} disabled={sending || !allChecked}
            className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl transition-all text-sm font-bold text-white shadow-sm ${allChecked ? "bg-slate-900 hover:bg-slate-800" : "bg-gray-300 cursor-not-allowed"} disabled:opacity-60`}>
            {sending ? (
              <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg><span className="text-xs">발송 중...</span></>
            ) : (
              <><span className="text-xl">📱</span><span>문자 발송</span></>
            )}
          </button>
          <button onClick={() => router.back()}
            className="flex flex-col items-center justify-center gap-1.5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 shadow-sm">
            <span className="text-xl">✏️</span><span>다시 작성</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">발송 전 수의사 확인 체크리스트</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allChecked ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-600"}`}>
              {checklist.filter(Boolean).length}/{CHECKLIST_ITEMS.length}
            </span>
          </div>
          <div className="space-y-2">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} type="button" onClick={() => toggleCheck(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${checklist[i] ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200 hover:border-gray-300"}`}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${checklist[i] ? "bg-emerald-500" : "bg-white border-2 border-gray-300"}`}>
                  {checklist[i] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-xs font-medium ${checklist[i] ? "text-emerald-700 line-through decoration-emerald-400" : "text-gray-600"}`}>{item}</span>
              </button>
            ))}
          </div>
          {!allChecked && (
            <p className="text-xs text-amber-600 font-medium">⚠️ 모든 항목을 확인해야 문자 발송이 가능합니다. AI 생성 내용은 수의사가 검토 후 발송하세요.</p>
          )}
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
