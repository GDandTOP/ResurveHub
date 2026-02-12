"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * 푸터 컴포넌트
 * 사이트 정보 및 링크 제공
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "서비스",
      links: [
        { name: "공간 둘러보기", href: "/products" },
        { name: "예약 방법", href: "/how-to-reserve" },
        { name: "자주 묻는 질문", href: "/faq" },
      ],
    },
    {
      title: "회사",
      links: [
        { name: "회사 소개", href: "/company" },
        { name: "파트너십", href: "/partnership" },
        { name: "채용", href: "/careers" },
      ],
    },
    {
      title: "고객 지원",
      links: [
        { name: "고객센터", href: "/support" },
        { name: "이용약관", href: "/terms" },
        { name: "개인정보처리방침", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 브랜드 섹션 */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary via-primary/95 to-primary/85 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">
                Young King Space
              </span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
              공간 예약의 새로운 기준
              <br />
              간편하고 빠른 예약 서비스
            </p>
          </div>

          {/* 링크 섹션 */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="font-semibold text-xl text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-colors hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">© {currentYear} Young King Space. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
