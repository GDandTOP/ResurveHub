'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User as UserType } from '@supabase/supabase-js'
import { Mail, Calendar as CalendarIcon } from 'lucide-react'
import { ReservationWithDetails } from '@/types/database'
import { ReservationCard } from './ReservationCard'

interface MyPageContentProps {
  user: UserType
  reservations: ReservationWithDetails[]
}

export default function MyPageContent({ user, reservations }: MyPageContentProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 사용자 정보 카드 */}
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">계정 정보</CardTitle>
          <CardDescription className="text-base">
            현재 로그인된 계정 정보입니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">이메일</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">가입일</p>
              <p className="text-lg font-medium">
                {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예약 내역 섹션 */}
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">예약 내역</h2>
          <p className="text-muted-foreground text-base">
            나의 공간 예약 내역입니다 ({reservations.length}건)
          </p>
        </div>

        {reservations.length === 0 ? (
          <Card className="border-2 shadow-xl">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📋</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  예약 내역이 없습니다
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map(reservation => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
