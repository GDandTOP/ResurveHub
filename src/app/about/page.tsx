"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Zap, DollarSign, Shield, Clock, Heart, CheckCircle, Users, Award, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full text-lg font-semibold mb-4 font-[family-name:var(--font-noto-sans-kr)] shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              <span className="tracking-wide">Young King Space를 소개합니다</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              서비스 소개
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.01em]">
              공간 예약의 새로운 기준
              <br>
              </br>
               Young King Space만의 특별한 장점을 경험해보세요
            </p>
          </div>
        </div>
      </div>

      {/* 주요 기능 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              왜 저희를 선택해야 할까요?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)]">
              Young King Space만의 특별한 장점을 경험해보세요
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

      {/* 통계 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              숫자로 보는 Young King Space
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)]">
              많은 고객들이 신뢰하는 서비스입니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div className="text-5xl font-black mb-2 text-primary font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">50+</div>
              <div className="text-xl text-muted-foreground font-[family-name:var(--font-noto-sans-kr)]">예약 가능 공간</div>
              <p className="mt-2 text-sm text-muted-foreground">
                다양한 규모와 용도의 공간을 제공합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="text-5xl font-black mb-2 text-primary font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">1,000+</div>
              <div className="text-xl text-muted-foreground font-[family-name:var(--font-noto-sans-kr)]">만족한 고객</div>
              <p className="mt-2 text-sm text-muted-foreground">
                신뢰할 수 있는 서비스 품질
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <div className="text-5xl font-black mb-2 text-primary font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.02em]">24/7</div>
              <div className="text-xl text-muted-foreground font-[family-name:var(--font-noto-sans-kr)]">예약 시스템</div>
              <p className="mt-2 text-sm text-muted-foreground">
                언제든지 원하는 시간에 예약
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 이용 방법 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
              이용 방법
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-noto-sans-kr)]">
              간단한 3단계로 공간을 예약하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl">공간 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  원하는 공간을 둘러보고 조건에 맞는 공간을 선택하세요
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-2xl">날짜/시간 예약</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  원하는 날짜와 시간을 선택하고 예약 정보를 입력하세요
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-2xl">결제 완료</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  안전한 결제를 진행하고 예약을 확정하세요
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
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">지금 바로 시작하세요</h2>
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
