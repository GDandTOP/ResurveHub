import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Briefcase, Users, Heart, TrendingUp, Coffee, Laptop, Award, Sparkles } from 'lucide-react'

export default function CareersPage () {
  const openPositions = [
    {
      title: '프론트엔드 개발자',
      department: '개발팀',
      type: '정규직',
      location: '서울 강남구',
      description: 'React, Next.js를 활용한 웹 서비스 개발'
    },
    {
      title: '백엔드 개발자',
      department: '개발팀',
      type: '정규직',
      location: '서울 강남구',
      description: 'Node.js, PostgreSQL을 활용한 API 개발'
    },
    {
      title: 'UI/UX 디자이너',
      department: '디자인팀',
      type: '정규직',
      location: '서울 강남구',
      description: '사용자 경험을 고려한 UI/UX 디자인'
    },
    {
      title: '마케팅 매니저',
      department: '마케팅팀',
      type: '정규직',
      location: '서울 강남구',
      description: '디지털 마케팅 전략 수립 및 실행'
    }
  ]

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
              <span className="tracking-wide">함께 성장할 동료를 찾습니다</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              채용
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              Your Space와 함께
              <br />
              미래를 만들어갈 인재를 기다립니다
            </p>
          </div>
        </div>
      </div>

      {/* 회사 문화 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                Your Space의 문화
              </h2>
              <p className="text-xl text-muted-foreground">
                우리는 이런 환경에서 일합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">수평적 문화</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    직급에 구애받지 않고 자유롭게 의견을 나누며 협업합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">성장 기회</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    교육비 지원, 컨퍼런스 참가 등 성장을 위한 다양한 기회를 제공합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Coffee className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">워라밸</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    유연근무제, 재택근무 등 일과 삶의 균형을 중요하게 생각합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Laptop className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">최신 장비</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    업무에 필요한 최신 장비와 소프트웨어를 제공합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">복지 혜택</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    건강검진, 경조사비, 리프레시 휴가 등 다양한 복지를 제공합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">성과 보상</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    성과에 따른 인센티브와 스톡옵션 기회를 제공합니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 복지 혜택 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                복지 혜택
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">근무 환경</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-base">• 유연근무제 (코어타임 11:00-16:00)</p>
                  <p className="text-base">• 주 2회 재택근무</p>
                  <p className="text-base">• 자유로운 휴가 사용</p>
                  <p className="text-base">• 최신 장비 제공 (맥북 프로, 듀얼 모니터)</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">성장 지원</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-base">• 교육비 지원 (연 200만원)</p>
                  <p className="text-base">• 컨퍼런스 참가비 지원</p>
                  <p className="text-base">• 도서 구매 지원</p>
                  <p className="text-base">• 사내 스터디 운영</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">건강 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-base">• 종합 건강검진 지원</p>
                  <p className="text-base">• 운동비 지원 (월 10만원)</p>
                  <p className="text-base">• 간식 및 음료 제공</p>
                  <p className="text-base">• 안마의자 완비</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">기타 혜택</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-base">• 경조사비 지원</p>
                  <p className="text-base">• 명절 선물</p>
                  <p className="text-base">• 리프레시 휴가 (연 1회)</p>
                  <p className="text-base">• 팀 워크샵 (분기 1회)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 채용 공고 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                채용 중인 포지션
              </h2>
              <p className="text-xl text-muted-foreground">
                현재 모집 중인 포지션을 확인해보세요
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base">
                          {position.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold whitespace-nowrap">
                        <Briefcase className="h-4 w-4" />
                        {position.type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍 {position.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 채용 프로세스 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                채용 프로세스
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-xl">지원서 접수</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    이력서 및 포트폴리오 제출
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle className="text-xl">서류 전형</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    지원서 검토 및 평가
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle className="text-xl">실무 면접</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    실무진과의 기술 면접
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">4</span>
                  </div>
                  <CardTitle className="text-xl">최종 합격</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    처우 협의 및 입사
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
              지금 바로 지원하세요
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              Your Space와 함께 성장할 인재를 기다립니다
            </p>
            <div className="pt-4">
              <a
                href="/support"
                className="inline-flex items-center justify-center px-12 h-16 text-2xl font-bold bg-white text-primary rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 [letter-spacing:-0.01em]"
              >
                채용 문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
