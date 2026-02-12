"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, User, LogOut, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * 메인 헤더 컴포넌트
 * 네비게이션, 로고, 로그인/회원가입 버튼 포함
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const navigationItems = [
    { name: "홈", href: "/" },
    { name: "공간 둘러보기", href: "/products" },
    { name: "서비스 소개", href: "/about" },
  ];

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    
    // 현재 사용자 확인 및 관리자 권한 체크
    async function checkUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (error || !user) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        // 관리자 권한 체크
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!mounted) return;
        
        setIsAdmin(userProfile?.role === 'admin');
        setLoading(false);
      } catch (error) {
        console.error('사용자 확인 오류:', error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    checkUser();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        checkUser();
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between relative">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary via-primary/95 to-primary/85 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">
                Young King Space
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 - 화면 정중앙 배치 */}
          <nav className="hidden md:flex items-center justify-center space-x-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-6 py-3 text-xl font-medium text-muted-foreground hover:text-foreground transition-all rounded-xl hover:bg-accent/50 relative group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          {/* 데스크톱 액션 버튼 */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {loading ? (
              <div className="h-12 w-32 bg-accent/50 rounded-xl animate-pulse" />
            ) : user ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="text-xl font-medium hover:bg-accent/50 px-6 h-12"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      관리자 포털
                    </Button>
                  </Link>
                )}
                <Link href="/mypage">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="text-xl font-medium hover:bg-accent/50 px-6 h-12"
                  >
                    <User className="h-5 w-5 mr-2" />
                    마이페이지
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="lg" 
                  className="text-xl font-medium hover:bg-accent/50 px-6 h-12"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="text-xl font-medium hover:bg-accent/50 px-6 h-12"
                  >
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="text-xl font-semibold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 px-8 h-12"
                  >
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-accent/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-6 space-y-4 animate-in slide-in-from-top-5 bg-background/95 backdrop-blur-xl">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-xl font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-4 space-y-3 border-t">
              {loading ? (
                <div className="h-14 bg-accent/50 rounded-xl animate-pulse" />
              ) : user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="block">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-xl h-14"
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        관리자 포털
                      </Button>
                    </Link>
                  )}
                  <Link href="/mypage" className="block">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full text-xl h-14"
                    >
                      <User className="h-5 w-5 mr-2" />
                      마이페이지
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="lg" 
                    className="w-full text-xl h-14"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full text-xl h-14"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button 
                      size="lg" 
                      className="w-full font-semibold text-xl h-14 bg-gradient-to-r from-primary to-primary/90"
                    >
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
