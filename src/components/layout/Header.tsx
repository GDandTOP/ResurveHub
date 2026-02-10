"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

/**
 * 메인 헤더 컴포넌트
 * 네비게이션, 로고, 로그인/회원가입 버튼 포함
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "홈", href: "/" },
    { name: "공간 둘러보기", href: "/products" },
    { name: "서비스 소개", href: "#features" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
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
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-2xl font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 데스크톱 액션 버튼 */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="lg" className="text-2xl">
              로그인
            </Button>
            <Button size="lg" className="font-semibold text-2xl">
              회원가입
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3 animate-in slide-in-from-top-5">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-2xl font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-3 space-y-2 border-t">
              <Button variant="outline" size="lg" className="w-full text-2xl">
                로그인
              </Button>
              <Button size="lg" className="w-full font-semibold text-2xl">
                회원가입
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
