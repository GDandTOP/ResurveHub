import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Playfair_Display } from "next/font/google";
import "./globals.css";
import { RootLayoutWrapper } from "@/components/layout/RootLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 고급스러운 한글 폰트
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

// 세련된 영문 디스플레이 폰트
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ReserveHub - 공간 예약 플랫폼",
  description: "스터디룸, 회의실, 세미나실을 간편하게 예약하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <RootLayoutWrapper>{children}</RootLayoutWrapper>
      </body>
    </html>
  );
}
