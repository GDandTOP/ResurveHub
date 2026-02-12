import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Handshake, TrendingUp, Shield, Users, DollarSign, Award, CheckCircle, Sparkles } from 'lucide-react'

export default function PartnershipPage () {
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
              <span className="tracking-wide">함께 성장하는 파트너</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              파트너십
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              Young King Space와 함께
              <br />
              새로운 기회를 만들어가세요
            </p>
          </div>
        </div>
      </div>

      {/* 파트너십 소개 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                왜 Young King Space와 함께해야 할까요?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Young King Space는 공간 제공자와 사용자를 연결하는 신뢰할 수 있는 플랫폼입니다.
                <br />
                우리와 함께라면 더 많은 고객을 만나고 안정적인 수익을 창출할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 파트너 혜택 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                파트너 혜택
              </h2>
              <p className="text-xl text-muted-foreground">
                Young King Space 파트너가 되면 누릴 수 있는 특별한 혜택
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">넓은 고객층</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    플랫폼을 통해 더 많은 잠재 고객에게 공간을 노출시킬 수 있습니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">안정적 수익</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    실시간 예약 시스템으로 공간 활용률을 높이고 수익을 극대화하세요.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">안전한 거래</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    검증된 결제 시스템으로 안전하게 거래하고 정산받으세요.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">마케팅 지원</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    전문적인 마케팅 지원으로 공간의 가치를 높여드립니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">관리 시스템</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    편리한 관리 시스템으로 예약, 정산, 통계를 한눈에 확인하세요.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Handshake className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">전담 지원</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    파트너 전담팀이 운영을 적극적으로 지원해드립니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 파트너 유형 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                파트너 유형
              </h2>
              <p className="text-xl text-muted-foreground">
                다양한 형태의 파트너십을 제공합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-3xl mb-4">공간 제공 파트너</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-lg leading-relaxed">
                    회의실, 스터디룸, 세미나실 등 다양한 공간을 보유하신 분들을 위한 파트너십입니다.
                  </CardDescription>
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">공간 등록 및 관리 지원</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">예약 시스템 및 결제 처리</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">마케팅 및 프로모션 지원</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">월 단위 정산 서비스</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-3xl mb-4">전략적 제휴 파트너</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-lg leading-relaxed">
                    기업, 교육기관, 공공기관 등과의 전략적 파트너십으로 상생하는 관계를 만들어갑니다.
                  </CardDescription>
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">맞춤형 제휴 조건 협의</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">공동 마케팅 및 프로모션</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">전용 관리 시스템 제공</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-base">전담 매니저 배정</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 파트너 등록 프로세스 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                파트너 등록 프로세스
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-xl">문의 접수</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    파트너십 문의 양식 작성 및 제출
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle className="text-xl">상담 진행</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    전담팀과 상세 상담 및 공간 검토
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle className="text-xl">계약 체결</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    파트너십 조건 협의 및 계약
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">4</span>
                  </div>
                  <CardTitle className="text-xl">운영 시작</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    공간 등록 및 예약 서비스 시작
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
              지금 바로 시작하세요
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              Young King Space와 함께 성장할 파트너를 기다립니다
            </p>
            <div className="pt-4">
              <a
                href="/support"
                className="inline-flex items-center justify-center px-12 h-16 text-2xl font-bold bg-white text-primary rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 [letter-spacing:-0.01em]"
              >
                파트너십 문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
