'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

interface ReservationStatsProps {
  reservations: any[]
}

/**
 * 예약 통계 컴포넌트
 */
export function ReservationStats ({ reservations }: ReservationStatsProps) {
  // 통계 계산
  const stats = {
    totalRevenue: reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.total_price || 0), 0),
    totalReservations: reservations.length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
    completedReservations: reservations.filter(r => r.status === 'completed').length,
    cancelledReservations: reservations.filter(r => r.status === 'cancelled').length,
  }

  const completionRate = stats.totalReservations > 0
    ? ((stats.completedReservations / stats.totalReservations) * 100).toFixed(1)
    : 0

  const cancellationRate = stats.totalReservations > 0
    ? ((stats.cancelledReservations / stats.totalReservations) * 100).toFixed(1)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            총 매출
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            {(stats.totalRevenue / 10000).toFixed(0)}만원
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            완료된 예약 {stats.completedReservations}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            완료율
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            {completionRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.completedReservations} / {stats.totalReservations}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            취소율
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-red-600" />
            {cancellationRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.cancelledReservations} / {stats.totalReservations}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            처리 대기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-yellow-600" />
            {stats.pendingReservations}건
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            승인 필요
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
