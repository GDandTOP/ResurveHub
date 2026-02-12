import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { StatCard } from '@/components/admin/analytics/StatCard'
import { DailySalesChart } from '@/components/admin/analytics/DailySalesChart'
import { DailyReservationsChart } from '@/components/admin/analytics/DailyReservationsChart'
import { SalesByProductChart } from '@/components/admin/analytics/SalesByProductChart'
import { ReservationsByTimeSlotChart } from '@/components/admin/analytics/ReservationsByTimeSlotChart'
import { CategorySalesChart } from '@/components/admin/analytics/CategorySalesChart'
import { CategoryReservationsChart } from '@/components/admin/analytics/CategoryReservationsChart'
import { StatusDistributionChart } from '@/components/admin/analytics/StatusDistributionChart'
import { DayOfWeekChart } from '@/components/admin/analytics/DayOfWeekChart'
import { AverageAmountChart } from '@/components/admin/analytics/AverageAmountChart'
import { MonthlySalesChart } from '@/components/admin/analytics/MonthlySalesChart'
import { TopProductsTable } from '@/components/admin/analytics/TopProductsTable'
import {
  getDailySalesData,
  getDailyReservationsData,
  getSalesByProduct,
  getReservationsByTimeSlot,
  getTopProducts,
  getMonthlySalesData,
  getReservationsByCategory,
  getReservationsByStatus,
  getReservationsByDayOfWeek,
  getSalesByCategory,
  getAverageReservationAmount,
  getOverallStats
} from '@/app/actions/admin/analytics'
import { DollarSign, Calendar, CheckCircle, TrendingUp } from 'lucide-react'

interface SearchParams {
  period?: '7' | '30' | '90'
}

export default async function AdminAnalyticsPage ({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const days = parseInt(params.period || '30')

  // 모든 데이터를 병렬로 가져오기
  const [
    overallStats,
    salesData,
    reservationsData,
    productSalesData,
    timeSlotData,
    topProducts,
    monthlySalesData,
    categoryReservationsData,
    statusData,
    dayOfWeekData,
    categorySalesData,
    averageAmountData
  ] = await Promise.all([
    getOverallStats(),
    getDailySalesData(days),
    getDailyReservationsData(days),
    getSalesByProduct(10),
    getReservationsByTimeSlot(),
    getTopProducts(10),
    getMonthlySalesData(),
    getReservationsByCategory(),
    getReservationsByStatus(),
    getReservationsByDayOfWeek(),
    getSalesByCategory(),
    getAverageReservationAmount(days)
  ])

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '통계 분석' }]} />

      {/* 페이지 헤더 */}
      <PageHeader
        title="통계 및 분석"
        description="매출과 예약 데이터를 시각화하여 확인하세요"
      />

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 매출"
          value={`${(overallStats.totalRevenue / 10000).toFixed(0)}만원`}
          icon={DollarSign}
          description="전체 누적 매출"
        />
        <StatCard
          title="이번 달 매출"
          value={`${(overallStats.monthRevenue / 10000).toFixed(0)}만원`}
          icon={TrendingUp}
          description="이번 달 누적"
        />
        <StatCard
          title="총 예약"
          value={`${overallStats.totalReservations}건`}
          icon={Calendar}
          description="전체 누적 예약"
        />
        <StatCard
          title="확정 예약"
          value={`${overallStats.confirmedReservations}건`}
          icon={CheckCircle}
          description="확정/완료된 예약"
        />
      </div>

      {/* 기간 선택 */}
      <div className="flex gap-2">
        <a
          href="/admin/analytics?period=7"
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            days === 7
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground hover:bg-accent/80'
          }`}
        >
          최근 7일
        </a>
        <a
          href="/admin/analytics?period=30"
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            days === 30
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground hover:bg-accent/80'
          }`}
        >
          최근 30일
        </a>
        <a
          href="/admin/analytics?period=90"
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            days === 90
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground hover:bg-accent/80'
          }`}
        >
          최근 90일
        </a>
      </div>

      {/* 메인 차트: 매출 & 예약 추이 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesChart data={salesData} />
        <DailyReservationsChart data={reservationsData} />
      </div>

      {/* 상품 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByProductChart data={productSalesData} />
        <ReservationsByTimeSlotChart data={timeSlotData} />
      </div>

      {/* 카테고리 & 상태 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategorySalesChart data={categorySalesData} />
        <CategoryReservationsChart data={categoryReservationsData} />
        <StatusDistributionChart data={statusData} />
      </div>

      {/* 추가 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DayOfWeekChart data={dayOfWeekData} />
        <AverageAmountChart data={averageAmountData} />
      </div>

      {/* 월별 매출 (전체 너비) */}
      <MonthlySalesChart data={monthlySalesData} />

      {/* 인기 상품 TOP 10 */}
      <TopProductsTable products={topProducts} />
    </div>
  )
}
