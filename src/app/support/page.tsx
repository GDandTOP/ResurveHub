'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Mail, Phone, MessageCircle, Clock, MapPin, Sparkles } from 'lucide-react'

export default function SupportPage () {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              <span className="tracking-wide">언제든 도와드립니다</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              고객센터
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              궁금하신 사항이 있으신가요?
              <br />
              친절하게 안내해드리겠습니다
            </p>
          </div>
        </div>
      </div>

      {/* 연락처 정보 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                연락처 정보
              </h2>
              <p className="text-xl text-muted-foreground">
                다양한 방법으로 문의하실 수 있습니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">전화 문의</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg space-y-2">
                    <p className="text-foreground font-semibold text-xl">1588-0000</p>
                    <p>평일 09:00 - 18:00</p>
                    <p className="text-sm">(점심시간 12:00-13:00)</p>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">이메일 문의</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg space-y-2">
                    <p className="text-foreground font-semibold break-all">support@yourspace.com</p>
                    <p>24시간 접수 가능</p>
                    <p className="text-sm">영업일 기준 24시간 이내 답변</p>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">카카오톡 문의</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg space-y-2">
                    <p className="text-foreground font-semibold">@yourspace</p>
                    <p>평일 09:00 - 18:00</p>
                    <p className="text-sm">빠른 답변 제공</p>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 문의 양식 섹션 */}
      <div className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                온라인 문의
              </h2>
              <p className="text-xl text-muted-foreground">
                문의 내용을 남겨주시면 빠르게 답변드리겠습니다
              </p>
            </div>

            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold">
                      이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="홍길동"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold">
                      문의 유형 *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">선택해주세요</option>
                      <option value="reservation">예약 관련</option>
                      <option value="payment">결제 관련</option>
                      <option value="cancel">취소/환불 관련</option>
                      <option value="partnership">파트너십 문의</option>
                      <option value="etc">기타 문의</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold">
                      문의 내용 *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="문의하실 내용을 자세히 작성해주세요"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg h-14 font-bold"
                  >
                    문의하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 운영 시간 및 위치 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
                오시는 길
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">운영 시간</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">평일</span>
                    <span className="font-semibold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">점심시간</span>
                    <span className="font-semibold">12:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">주말 및 공휴일</span>
                    <span className="font-semibold text-red-500">휴무</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">주소</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-lg">
                  <p className="font-semibold">
                    서울특별시 강남구 테헤란로 123
                  </p>
                  <p className="text-muted-foreground">
                    Young King Space 빌딩 5층
                  </p>
                  <p className="text-base text-muted-foreground">
                    지하철 2호선 강남역 3번 출구 도보 5분
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ 링크 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
              자주 묻는 질문
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              궁금하신 내용을 빠르게 확인해보세요
            </p>
            <div className="pt-4">
              <a
                href="/faq"
                className="inline-flex items-center justify-center px-12 h-16 text-2xl font-bold bg-white text-primary rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 [letter-spacing:-0.01em]"
              >
                FAQ 보러가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
