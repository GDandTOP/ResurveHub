import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MyPageContent from '@/components/mypage/MyPageContent'
import { getUserReservations } from '@/lib/api/reservations'

export default async function MyPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // 사용자의 예약 목록 가져오기
  const reservations = await getUserReservations()

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              마이페이지
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              내 정보와 예약 내역을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="container mx-auto px-4 py-12">
        <MyPageContent user={user} reservations={reservations} />
      </div>
    </div>
  )
}
