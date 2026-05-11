import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetScribe — 보호자 커뮤니케이션 자동화",
  description: "한국 동물병원 수의사를 위한 AI 안내문 자동 생성 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
