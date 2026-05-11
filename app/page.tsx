import Link from "next/link";

const MESSAGE_TYPES = [
  {
    id: "vaccination",
    icon: "💉",
    title: "예방접종 리마인드",
    description: "접종일 D-7, D-1 안내",
    color: "from-green-50 to-green-100 border-green-200 hover:border-green-400",
    iconBg: "bg-green-100",
  },
  {
    id: "pre-surgery",
    icon: "🏥",
    title: "수술 전 안내",
    description: "금식·준비물·주의사항",
    color: "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    id: "post-surgery",
    icon: "🐾",
    title: "수술 후 퇴원 안내",
    description: "약 복용·상처 관리·red flag",
    color: "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
  },
  {
    id: "revisit",
    icon: "📅",
    title: "재내원 리마인드",
    description: "다음 내원일 자동 안내",
    color: "from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400",
    iconBg: "bg-orange-100",
  },
  {
    id: "crm",
    icon: "📣",
    title: "CRM 메시지",
    description: "MVP 이후 출시 예정",
    color: "from-gray-50 to-gray-100 border-gray-200",
    iconBg: "bg-gray-100",
    disabled: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-none">VetScribe</h1>
            <p className="text-xs text-gray-500 mt-0.5">보호자 커뮤니케이션 자동화</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">안내문 유형 선택</h2>
          <p className="text-gray-500 text-sm">
            발송할 안내문 유형을 선택하면 AI가 맞춤 카카오톡 메시지를 생성합니다
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MESSAGE_TYPES.map((type) =>
            type.disabled ? (
              <div
                key={type.id}
                className={`relative rounded-2xl border-2 bg-gradient-to-r p-5 opacity-50 cursor-not-allowed ${type.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${type.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                  </div>
                  <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    준비 중
                  </span>
                </div>
              </div>
            ) : (
              <Link
                key={type.id}
                href={`/compose?type=${type.id}`}
                className={`relative rounded-2xl border-2 bg-gradient-to-r p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${type.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${type.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                  </div>
                  <svg
                    className="ml-auto text-gray-400 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          )}
        </div>

        <div className="mt-10 p-4 bg-teal-50 border border-teal-100 rounded-xl">
          <p className="text-xs text-teal-700 text-center">
            🔒 AI 안내문은 수의사 확인 후 발송하세요. 모든 생성 내용은 편집 가능합니다.
          </p>
        </div>
      </main>
    </div>
  );
}
