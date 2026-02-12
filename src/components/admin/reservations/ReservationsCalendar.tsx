'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'

interface ReservationsCalendarProps {
  reservations: any[]
}

/**
 * 예약 캘린더 컴포넌트
 * 월별 캘린더 뷰로 예약 표시
 */
export function ReservationsCalendar ({ reservations }: ReservationsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // 선택된 날짜의 예약 필터링
  const selectedDateReservations = reservations.filter(r => {
    if (!selectedDate) return false
    const reservationDate = new Date(r.reservation_date)
    return reservationDate.toDateString() === selectedDate.toDateString()
  })

  // 날짜별 예약 수 계산
  const reservationsByDate = reservations.reduce((acc, r) => {
    const date = r.reservation_date
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 예약이 있는 날짜 표시
  function hasReservation (date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd')
    return reservationsByDate[dateStr] || 0
  }

  // 상태별 색상
  function getStatusColor (status: string) {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 캘린더 */}
      <Card className="border-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>예약 캘린더</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border-2"
            locale={ko}
            modifiers={{
              hasReservation: (date) => hasReservation(date) > 0
            }}
            modifiersStyles={{
              hasReservation: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'hsl(var(--primary))'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* 선택된 날짜의 예약 목록 */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {selectedDate ? format(selectedDate, 'M월 d일 (E)', { locale: ko }) : '날짜 선택'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedDateReservations.length}개의 예약
          </p>
        </CardHeader>
        <CardContent>
          {selectedDateReservations.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                예약이 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateReservations
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`p-4 rounded-xl border-2 ${getStatusColor(reservation.status)}`}
                  >
                    {/* 시간 */}
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-bold text-sm">
                        {reservation.start_time} - {reservation.end_time}
                      </span>
                    </div>

                    {/* 상품명 */}
                    <div className="font-semibold mb-1">
                      {reservation.products?.name || '-'}
                    </div>

                    {/* 고객명 */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      <span>{reservation.users?.name || '-'}</span>
                    </div>

                    {/* 상태 */}
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {reservation.status === 'pending' && '승인대기'}
                        {reservation.status === 'confirmed' && '승인완료'}
                        {reservation.status === 'cancelled' && '취소됨'}
                        {reservation.status === 'completed' && '이용완료'}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
