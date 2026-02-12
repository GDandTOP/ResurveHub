import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { ReservationsManager } from '@/components/admin/reservations/ReservationsManager'
import { getAllReservations, getTodayReservations } from '@/app/actions/admin/reservations'

interface SearchParams {
  view?: 'list' | 'calendar'
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'all'
  search?: string
  date?: string
}

/**
 * 관리자 예약 관리 메인 페이지
 * 예약 목록, 캘린더, 통계 등을 한 곳에서 관리
 */
export default async function AdminReservationsPage ({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  
  // 모든 예약 데이터 조회
  const allReservations = await getAllReservations({
    status: params.status,
    search: params.search
  })
  
  // 오늘의 예약 조회
  const todayReservations = await getTodayReservations()

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '예약 관리' }]} />

      {/* 페이지 헤더 */}
      <PageHeader
        title="예약 관리"
        description="모든 예약을 확인하고 관리하세요"
      />

      {/* 메인 예약 관리 컴포넌트 */}
      <ReservationsManager
        initialReservations={allReservations}
        todayReservations={todayReservations}
        initialView={params.view || 'list'}
        initialStatus={params.status || 'all'}
        initialSearch={params.search || ''}
      />
    </div>
  )
}
