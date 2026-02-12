'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface TodayReservationsProps {
  reservations: any[]
}

/**
 * 오늘의 예약 컴포넌트
 * 오늘 날짜의 예약을 시간순으로 표시
 */
export function TodayReservations ({ reservations }: TodayReservationsProps) {
  if (reservations.length === 0) {
    return null
  }

  // 시간순 정렬
  const sortedReservations = [...reservations].sort((a, b) => 
    a.start_time.localeCompare(b.start_time)
  )

  // 상태별 스타일
  function getStatusStyle (status: string) {
    const styles = {
      pending: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
      confirmed: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
      cancelled: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
      completed: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          오늘의 예약 ({format(new Date(), 'M월 d일 (E)', { locale: ko })})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          총 {reservations.length}건의 예약이 있습니다
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReservations.map((reservation) => (
            <Card 
              key={reservation.id} 
              className={`border-l-4 ${getStatusStyle(reservation.status)}`}
            >
              <CardContent className="pt-6 space-y-3">
                {/* 시간 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">
                      {reservation.start_time} - {reservation.end_time}
                    </span>
                  </div>
                  <Badge 
                    variant={
                      reservation.status === 'pending' ? 'warning' :
                      reservation.status === 'confirmed' ? 'success' :
                      reservation.status === 'cancelled' ? 'destructive' :
                      'default'
                    }
                  >
                    {reservation.status === 'pending' && '대기'}
                    {reservation.status === 'confirmed' && '승인'}
                    {reservation.status === 'cancelled' && '취소'}
                    {reservation.status === 'completed' && '완료'}
                  </Badge>
                </div>

                {/* 상품 */}
                <div className="font-semibold text-lg">
                  {reservation.products?.name || '-'}
                </div>

                {/* 고객 정보 */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{reservation.users?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{reservation.users?.phone || '-'}</span>
                  </div>
                </div>

                {/* 금액 & 인원 */}
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {reservation.number_of_people}명
                  </span>
                  <span className="font-bold text-primary">
                    {(reservation.total_price || 0).toLocaleString()}원
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
