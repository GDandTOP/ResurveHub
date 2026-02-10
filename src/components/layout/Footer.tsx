"use client";

import Link from "next/link";

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
        { name: "예약 방법", href: "#" },
        { name: "자주 묻는 질문", href: "#" },
      ],
    },
    {
      title: "회사",
      links: [
        { name: "회사 소개", href: "#" },
        { name: "파트너십", href: "#" },
        { name: "채용", href: "#" },
      ],
    },
    {
      title: "고객 지원",
      links: [
        { name: "고객센터", href: "#" },
        { name: "이용약관", href: "#" },
        { name: "개인정보처리방침", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  R
                </span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ReserveHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              공간 예약의 새로운 기준
              <br />
              간편하고 빠른 예약 서비스
            </p>
          </div>

          {/* 링크 섹션 */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} ReserveHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
