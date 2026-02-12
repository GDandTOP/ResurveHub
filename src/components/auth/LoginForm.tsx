'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await login(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        // 성공 시 페이지 새로고침 (redirect가 이미 처리됨)
        router.refresh()
      }
    } catch (error) {
      // redirect가 throw하는 경우 정상 동작
      console.log('로그인 성공, 리다이렉트 중...')
    }
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">계정에 로그인</CardTitle>
        <CardDescription className="text-base">
          이메일과 비밀번호를 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  className="w-full h-12 pl-10 pr-4 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="비밀번호를 입력하세요"
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
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          <div className="text-center text-base pt-2">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/signup" className="font-medium text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
