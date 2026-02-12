'use client'

import { useState } from 'react'
import { signup } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Lock, CheckCircle2, User } from 'lucide-react'

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signup(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-2 shadow-xl">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">
                회원가입 성공!
              </h3>
              <p className="text-lg text-muted-foreground">
                이메일로 전송된 인증 링크를 확인해주세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">계정 만들기</CardTitle>
        <CardDescription className="text-base">
          이메일과 비밀번호로 간편하게 가입하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full h-12 pl-10 pr-4 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="홍길동"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full h-12 pl-10 pr-4 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  className="w-full h-12 pl-10 pr-4 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="대소문자+숫자+특수문자 10자 이상"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                대소문자, 숫자, 특수문자를 포함한 10자 이상
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  className="w-full h-12 pl-10 pr-4 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? '처리 중...' : '회원가입'}
          </Button>

          <div className="text-center text-base pt-2">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              로그인
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
