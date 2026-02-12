import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Calendar, Search, CreditCard, CheckCircle, Clock, Users, AlertCircle, Sparkles } from 'lucide-react'

export default function HowToReservePage () {
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full text-lg font-semibold mb-4 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              <span className="tracking-wide">간편한 예약 프로세스</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              예약 방법
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              3단계로 완성하는 간단한 공간 예약
              <br />
              지금 바로 시작해보세요
            </p>
          </div>
        </div>
      </div>

      {/* 예약 단계 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
              예약 프로세스
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              단 3단계만으로 원하는 공간을 예약할 수 있습니다
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary mb-2">STEP 1</div>
                    <CardTitle className="text-3xl mb-3">공간 검색 및 선택</CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      원하는 조건에 맞는 공간을 찾아보세요
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">공간 목록 페이지에서 다양한 공간을 둘러보세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">필터를 활용하여 수용 인원, 가격대 등을 설정하세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">공간 상세 페이지에서 시설 정보와 사진을 확인하세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary mb-2">STEP 2</div>
                    <CardTitle className="text-3xl mb-3">날짜 및 시간 선택</CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      원하는 날짜와 시간대를 선택하세요
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">캘린더에서 원하는 날짜를 선택하세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">예약 가능한 시간대를 확인하고 선택하세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">필요한 시간만큼 시간대를 선택하세요 (최소 1시간)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">예약 정보를 확인하고 다음 단계로 진행하세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary mb-2">STEP 3</div>
                    <CardTitle className="text-3xl mb-3">결제 및 예약 완료</CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      안전한 결제로 예약을 완료하세요
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">예약 내역과 총 금액을 최종 확인하세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">결제 방법을 선택하고 결제를 진행하세요</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">예약 완료! 이메일로 예약 확인서가 발송됩니다</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-base">마이페이지에서 예약 내역을 확인할 수 있습니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 유의사항 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                예약 시 유의사항
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">예약 시간</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    최소 1시간 단위로 예약 가능합니다. 예약 시간 15분 전까지 입실을 완료해주세요.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">취소 정책</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    예약일 24시간 전까지 무료 취소 가능합니다. 이후 취소 시 수수료가 발생할 수 있습니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">인원 제한</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    각 공간의 최대 수용 인원을 준수해주세요. 초과 시 입실이 제한될 수 있습니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">회원 혜택</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    회원 가입 후 예약 시 다양한 혜택과 적립금을 받으실 수 있습니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
              지금 바로 예약하세요
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              원하는 공간을 찾아 간편하게 예약하고 이용해보세요
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-2xl px-12 h-16 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-white text-primary [letter-spacing:-0.01em]" 
              asChild
            >
              <Link href="/products">공간 둘러보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
