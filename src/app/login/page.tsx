import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              로그인
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              ReserveHub에 다시 오신 것을 환영합니다
            </p>
          </div>
        </div>
      </div>

      {/* 폼 섹션 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
