import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Reservation {
  id: string
  reservation_date: string
  start_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  products: {
    name: string
    category: string
  } | null
  users: {
    name: string
    email: string
  } | null
}

interface RecentReservationsTableProps {
  reservations: Reservation[]
}

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'secondary'
} as const

const statusLabels = {
  pending: '대기',
  confirmed: '확정',
  cancelled: '취소',
  completed: '완료'
}

export function RecentReservationsTable ({ reservations }: RecentReservationsTableProps) {
  if (!reservations || reservations.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">최근 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            최근 예약이 없습니다
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">최근 예약</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">예약일</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">시간</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">상품</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">고객</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b hover:bg-accent/50 transition-colors">
                  <td className="py-3 px-4">
                    {format(new Date(reservation.reservation_date), 'M월 d일 (E)', { locale: ko })}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {reservation.start_time}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{reservation.products?.name}</div>
                      <div className="text-xs text-muted-foreground">{reservation.products?.category}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{reservation.users?.name}</div>
                      <div className="text-xs text-muted-foreground">{reservation.users?.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[reservation.status]}>
                      {statusLabels[reservation.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
