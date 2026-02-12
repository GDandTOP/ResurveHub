import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Target, Eye, Heart, Users, Award, TrendingUp, Sparkles } from 'lucide-react'

export default function CompanyPage () {
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
              <span className="tracking-wide">Young King Space 이야기</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              회사 소개
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              공간의 가치를 새롭게 정의하다
              <br />
              Young King Space와 함께하는 스마트한 공간 경험
            </p>
          </div>
        </div>
      </div>

      {/* 회사 소개 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                Young King Space는
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                공간 예약 플랫폼의 선두주자로서, 누구나 쉽고 간편하게 필요한 공간을 찾고 예약할 수 있는 서비스를 제공합니다.
                <br />
                <br />
                우리는 단순한 공간 대여를 넘어, 사용자와 공간 제공자를 연결하는 신뢰할 수 있는 플랫폼을 구축하고 있습니다.
                <br />
                <br />
                모임, 스터디, 회의, 세미나 등 다양한 목적에 맞는 공간을 제공하며,
                실시간 예약 시스템과 안전한 결제 시스템으로 최고의 사용자 경험을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 미션 & 비전 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                미션 & 비전
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl mb-3">미션</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed space-y-3">
                    <p className="font-semibold text-foreground">
                      "모든 사람에게 필요한 공간을 제공한다"
                    </p>
                    <p>
                      우리는 공간이 필요한 모든 순간에 최적의 솔루션을 제공하여,
                      사용자들의 목적을 달성할 수 있도록 돕습니다.
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl mb-3">비전</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed space-y-3">
                    <p className="font-semibold text-foreground">
                      "공간 경제의 혁신을 이끌어가는 리더"
                    </p>
                    <p>
                      기술과 서비스의 혁신을 통해 공간 공유 경제의 새로운 기준을 제시하고,
                      지속 가능한 공간 활용 문화를 만들어갑니다.
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 가치 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                핵심 가치
              </h2>
              <p className="text-xl text-muted-foreground">
                Young King Space가 추구하는 가치
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 text-center hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">고객 중심</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    고객의 니즈를 최우선으로 생각하며, 최고의 서비스를 제공하기 위해 노력합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">혁신</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    끊임없는 혁신을 통해 더 나은 서비스를 제공하고, 업계를 선도합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">신뢰</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    투명하고 정직한 서비스로 고객과 파트너의 신뢰를 얻습니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 성과 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                주요 성과
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <div className="text-5xl font-black mb-2 text-primary [letter-spacing:-0.02em]">50+</div>
                <div className="text-xl text-muted-foreground">제휴 공간</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="text-5xl font-black mb-2 text-primary [letter-spacing:-0.02em]">1,000+</div>
                <div className="text-xl text-muted-foreground">가입 회원</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <div className="text-5xl font-black mb-2 text-primary [letter-spacing:-0.02em]">5,000+</div>
                <div className="text-xl text-muted-foreground">누적 예약</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <div className="text-5xl font-black mb-2 text-primary [letter-spacing:-0.02em]">4.8</div>
                <div className="text-xl text-muted-foreground">평균 만족도</div>
              </div>
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
              Young King Space와 함께 성장하세요
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              파트너십 및 채용 문의를 환영합니다
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a
                href="/partnership"
                className="inline-flex items-center justify-center px-12 h-16 text-xl font-bold bg-white text-primary rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 [letter-spacing:-0.01em]"
              >
                파트너십 문의
              </a>
              <a
                href="/careers"
                className="inline-flex items-center justify-center px-12 h-16 text-xl font-bold bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 hover:bg-white/30 [letter-spacing:-0.01em]"
              >
                채용 정보
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
