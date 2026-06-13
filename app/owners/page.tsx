"use client";

import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { usePatients } from "@/context/PatientsContext";
import type { MockPatient } from "@/lib/mockData";
import type { MessageType } from "@/lib/ai/types";

const TYPE_META: Record<MessageType, { label: string; icon: string; color: string; bg: string; ring: string }> = {
  vaccination:    { label: "예방접종", icon: "💉", color: "text-emerald-700", bg: "bg-emerald-50",  ring: "ring-emerald-300" },
  "pre-surgery":  { label: "수술 전",  icon: "🏥", color: "text-blue-700",    bg: "bg-blue-50",    ring: "ring-blue-300"    },
  "post-surgery": { label: "수술 후",  icon: "🐾", color: "text-violet-700",  bg: "bg-violet-50",  ring: "ring-violet-300"  },
  revisit:        { label: "재내원",   icon: "📅", color: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-300"   },
};

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700", "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",   "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",       "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",   "bg-orange-100 text-orange-700",
];

const MESSAGE_TYPES: MessageType[] = ["vaccination", "pre-surgery", "post-surgery", "revisit"];

type TypeFilter = "all" | MessageType;
type StatusFilter = "all" | "sent" | "pending";

interface OwnerForm {
  ownerName: string; ownerPhone: string; petName: string;
  breed: string; age: string; messageType: MessageType;
}
const EMPTY_FORM: OwnerForm = { ownerName: "", ownerPhone: "", petName: "", breed: "", age: "", messageType: "vaccination" };

function getUniqueOwners(patients: MockPatient[]) {
  const seen = new Map<string, MockPatient>();
  for (const p of patients) { if (!seen.has(p.ownerName)) seen.set(p.ownerName, p); }
  return Array.from(seen.values());
}

export default function OwnersPage() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState<OwnerForm>(EMPTY_FORM);
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const openAdd  = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p: MockPatient) => {
    setEditId(p.id);
    setForm({ ownerName: p.ownerName, ownerPhone: p.ownerPhone, petName: p.petName, breed: p.breed, age: p.age, messageType: p.messageType });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.ownerName.trim() || !form.petName.trim()) return;
    if (editId) { await updatePatient(editId, form); showToast("보호자 정보가 수정됐어요!"); }
    else {
      await addPatient({ id: String(Date.now()), ...form, dDay: 0, status: "pending" });
      showToast("새 보호자가 등록됐어요!");
    }
    setShowModal(false);
  };
  const handleDelete = async (id: string) => { await deletePatient(id); setShowModal(false); showToast("삭제됐어요."); };

  const allOwners = getUniqueOwners(patients);
  const typeCounts: Record<string, number> = {};
  for (const p of allOwners) typeCounts[p.messageType] = (typeCounts[p.messageType] ?? 0) + 1;

  const filtered = allOwners.filter((p) => {
    const q = search.toLowerCase();
    const searchOk = !q || p.ownerName.includes(q) || p.ownerPhone.includes(q) || p.petName.includes(q);
    const typeOk   = typeFilter === "all" || p.messageType === typeFilter;
    const statusOk = statusFilter === "all" || p.status === statusFilter;
    return searchOk && typeOk && statusOk;
  });

  return (
    <AppLayout active="owners" title="보호자">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          {toast}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-black text-gray-900 text-lg mb-5">{editId ? "보호자 정보 수정" : "새 보호자 등록"}</h2>
            <div className="space-y-3">
              {[
                { label: "보호자 이름 *", key: "ownerName", placeholder: "예: 이서연" },
                { label: "연락처", key: "ownerPhone", placeholder: "010-0000-0000" },
                { label: "반려동물 이름 *", key: "petName", placeholder: "예: 보리" },
                { label: "품종", key: "breed", placeholder: "예: 푸들" },
                { label: "나이 (세)", key: "age", placeholder: "예: 3" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder={placeholder} value={form[key as keyof OwnerForm]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">메시지 유형</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={form.messageType} onChange={(e) => setForm((f) => ({ ...f, messageType: e.target.value as MessageType }))}>
                  {MESSAGE_TYPES.map((t) => <option key={t} value={t}>{TYPE_META[t].icon} {TYPE_META[t].label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              {editId && <button onClick={() => handleDelete(editId)} className="px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50">삭제</button>}
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={!form.ownerName.trim() || !form.petName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-40">
                {editId ? "저장" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-semibold text-gray-500">
            전체 보호자 <span className="font-black text-gray-900">{filtered.length}명</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input type="text" placeholder="이름·연락처·반려동물 검색" value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm w-52 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl whitespace-nowrap">
              <span>+</span> 새 보호자
            </button>
          </div>
        </div>

        {/* 메시지 유형 필터 */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTypeFilter("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "all" ? "bg-gray-900 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}>
            👤 전체 <span className="opacity-60">{allOwners.length}</span>
          </button>
          {(Object.keys(TYPE_META) as MessageType[]).map((t) => {
            const m = TYPE_META[t];
            const cnt = typeCounts[t] ?? 0;
            const active = typeFilter === t;
            return (
              <button key={t} onClick={() => setTypeFilter(active ? "all" : t)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active ? `${m.bg} ${m.color} ring-2 ${m.ring} shadow-sm` : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>
                <span>{m.icon}</span> {m.label} <span className="opacity-60">{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-2">
          {([
            { key: "all",     label: "전체",    icon: "⬜" },
            { key: "pending", label: "검수대기", icon: "⏳" },
            { key: "sent",    label: "발송완료", icon: "✅" },
          ] as { key: StatusFilter; label: string; icon: string }[]).map((f) => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === f.key ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["보호자", "연락처", "반려동물", "메시지 유형", "상태", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p, idx) => {
                  const meta      = TYPE_META[p.messageType];
                  const avatarCls = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const isSent    = p.status === "sent";
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${avatarCls} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                            {p.ownerName.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{p.ownerName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">{p.ownerPhone}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-800">{p.petName}</span>
                        <span className="text-gray-400 ml-1.5 text-xs">{p.breed} · {p.age}세</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${isSent ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                          {isSent ? "✅ 발송완료" : "⏳ 검수대기"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button onClick={() => openEdit(p)} className="text-xs font-semibold text-gray-400 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300 px-2.5 py-1.5 rounded-lg transition-colors">
                          수정
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">🔍</div>
                조건에 맞는 보호자가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
