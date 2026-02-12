import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { MetricCard } from '@/components/admin/analytics/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecentReservationsTable } from '@/components/admin/dashboard/RecentReservationsTable'
import { WeeklySalesChart } from '@/components/admin/dashboard/WeeklySalesChart'
import { ReservationStatusChart } from '@/components/admin/dashboard/ReservationStatusChart'
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Package,
  Clock
} from 'lucide-react'
import { getDashboardMetrics, getRecentReservations, getWeeklySalesData, getReservationStatusDistribution } from '@/app/actions/admin/dashboard'

export default async function DashboardPage () {
  const metrics = await getDashboardMetrics()
  const recentReservations = await getRecentReservations(5)
  const weeklySalesData = await getWeeklySalesData()
  const reservationStatusData = await getReservationStatusDistribution()

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '대시보드' }]} />

      {/* 페이지 헤더 */}
      <PageHeader
        title="대시보드"
        description="주요 지표를 한눈에 확인하세요"
      />

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="오늘의 매출"
          value={`${(metrics.todayRevenue / 10000).toFixed(0)}만원`}
          description="실시간 매출 현황"
          icon={DollarSign}
        />

        <MetricCard
          title="오늘의 예약"
          value={`${metrics.todayReservations}건`}
          description="금일 예약 건수"
          icon={Calendar}
        />

        <MetricCard
          title="이번 달 매출"
          value={`${(metrics.monthRevenue / 10000).toFixed(0)}만원`}
          description="월간 누적 매출"
          icon={TrendingUp}
          trend={metrics.revenueGrowth !== 0 ? {
            value: Math.abs(metrics.revenueGrowth),
            isPositive: metrics.revenueGrowth > 0
          } : undefined}
        />

        <MetricCard
          title="이번 달 예약"
          value={`${metrics.monthReservations}건`}
          description="월간 누적 예약"
          icon={Users}
        />

        <MetricCard
          title="활성 상품"
          value={`${metrics.activeProducts}개`}
          description="현재 예약 가능"
          icon={Package}
        />

        <MetricCard
          title="대기중인 예약"
          value={`${metrics.pendingReservations}건`}
          description="확인 필요"
          icon={Clock}
        />
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 매출 차트 */}
        <WeeklySalesChart data={weeklySalesData} />

        {/* 예약 차트 */}
        <ReservationStatusChart data={reservationStatusData} />
      </div>

      {/* 최근 예약 목록 */}
      <RecentReservationsTable reservations={recentReservations} />
    </div>
  )
}
