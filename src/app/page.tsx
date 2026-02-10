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
import { ProductCarousel } from "@/components/products/ProductCarousel";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              공간 예약의
              <br />
              <span className="bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text text-transparent">
                새로운 기준
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
              스터디룸, 회의실, 세미나실을 간편하게 예약하고
              <br className="hidden md:block" />
              효율적으로 관리하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                asChild
              >
                <Link href="/products">공간 둘러보기</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-12 font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="#features">자세히 알아보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 인기 상품 Carousel */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">인기 공간</h2>
          <p className="text-center text-muted-foreground mb-12">
            지금 가장 많이 예약되는 공간을 만나보세요
          </p>
          <ProductCarousel />
        </div>
      </div>

      {/* 기능 소개 */}
      <div id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          왜 저희를 선택해야 할까요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🏢</span>
                다양한 공간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                스터디룸부터 대형 세미나실까지 다양한 규모의 공간을 제공합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                간편한 예약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                몇 번의 클릭만으로 원하는 시간에 공간을 예약할 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">💰</span>
                합리적인 가격
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                시간당 합리적인 가격으로 필요한 만큼만 이용하실 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            원하는 공간을 찾아 예약해보세요
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/products">예약 가능한 공간 보기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
