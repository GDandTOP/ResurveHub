import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { getProductsServer } from "@/lib/api/products";
import { dbProductsToClientProducts } from "@/lib/utils/product-mapper";
import { Building2, Zap, DollarSign, Shield, Clock, Heart } from "lucide-react";

export default async function Home() {
  // 서버에서 상품 데이터 가져오기
  const dbProducts = await getProductsServer();
  const products = dbProductsToClientProducts(dbProducts);
  const featuredProducts = products.slice(0, 4);
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        {/* 배경 패턴 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        </div>
        
        {/* 플로팅 요소들 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 py-32 md:py-40">
          <div className="text-center max-w-4xl mx-auto space-y-8">
       
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              당신의 시간에
              <br className="hidden md:block" />
              완벽한 공간을
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto font-light font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]">
              스터디룸부터 세미나실까지,
              <br className="hidden md:block" />
              한 번의 클릭으로 시작되는 프리미엄 공간 경험
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-2xl px-12 h-16 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-white text-primary hover:bg-white/90 font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]"
                asChild
              >
                <Link href="/products">공간 둘러보기</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-2xl px-12 h-16 font-bold bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm hover:scale-105 transition-all font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]"
                asChild
              >
                <Link href="#features">자세히 알아보기</Link>
              </Button>
            </div>
            
            {/* 통계 정보 */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2 font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">50+</div>
                <div className="text-base md:text-lg opacity-80 font-light font-[family-name:var(--font-noto-sans-kr)]">예약 가능 공간</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-4xl md:text-5xl font-black mb-2 font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">1,000+</div>
                <div className="text-base md:text-lg opacity-80 font-light font-[family-name:var(--font-noto-sans-kr)]">만족한 고객</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2 font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">24/7</div>
                <div className="text-base md:text-lg opacity-80 font-light font-[family-name:var(--font-noto-sans-kr)]">예약 시스템</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 웨이브 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="oklch(0.99 0 0)"/>
          </svg>
        </div>
      </div>

      {/* 인기 상품 Carousel */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">인기 공간</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)]">
              지금 가장 많이 예약되는 공간을 만나보세요
            </p>
          </div>
          <ProductCarousel products={featuredProducts} />
        </div>
      </div>

      {/* 기능 소개 */}
      <div id="features" className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              왜 저희를 선택해야 할까요?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)]">
              ReserveHub만의 특별한 장점을 경험해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">다양한 공간</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  스터디룸부터 대형 세미나실까지 다양한 규모의 공간을 제공합니다.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">간편한 예약</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  몇 번의 클릭만으로 원하는 시간에 공간을 예약할 수 있습니다.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">합리적인 가격</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  시간당 합리적인 가격으로 필요한 만큼만 이용하실 수 있습니다.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">안전한 결제</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  신뢰할 수 있는 결제 시스템으로 안전하게 거래하세요.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">실시간 예약</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  실시간으로 예약 가능 여부를 확인하고 즉시 예약하세요.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">친절한 지원</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  언제든지 도움이 필요하시면 고객센터로 문의해주세요.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              지금 바로 시작하세요
            </h2>
            <p className="text-2xl opacity-90 font-light font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]">
              원하는 공간을 찾아 예약하고, 효율적인 공간 활용을 경험해보세요
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-2xl px-12 h-16 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-white text-primary font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]" 
              asChild
            >
              <Link href="/products">예약 가능한 공간 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
