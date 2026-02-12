import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentsTable } from '@/components/admin/payments/PaymentsTable'
import { getAllPayments, getPaymentStats } from '@/app/actions/admin/payments'

interface SearchParams {
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'
  search?: string
}

export default async function AdminPaymentsPage ({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const payments = await getAllPayments({
    status: params.status,
    search: params.search
  })
  const stats = await getPaymentStats()

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '결제 관리' }]} />

      {/* 페이지 헤더 */}
      <PageHeader
        title="결제 관리"
        description="결제 내역을 확인하고 환불을 처리하세요"
      />

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">총 결제</div>
            <div className="text-2xl font-black">{stats.total}건</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">결제 완료</div>
            <div className="text-2xl font-black text-green-600">{stats.completed}건</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">대기중</div>
            <div className="text-2xl font-black text-yellow-600">{stats.pending}건</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">환불</div>
            <div className="text-2xl font-black text-red-600">{stats.refunded}건</div>
          </CardContent>
        </Card>
      </div>

      {/* 결제 목록 */}
      <PaymentsTable payments={payments} />
    </div>
  )
}
