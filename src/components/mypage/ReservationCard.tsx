'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/types/database'
import { Calendar, Clock, Users, MapPin, CreditCard } from 'lucide-react'
import { cancelReservationAction } from '@/app/actions/reservations'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ReservationCardProps {
  reservation: ReservationWithDetails
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('정말로 예약을 취소하시겠습니까?')) {
      return
    }

    setLoading(true)
    const result = await cancelReservationAction(reservation.id)

    if (result.success) {
      alert('예약이 취소되었습니다.')
      router.refresh()
    } else {
      alert(result.error || '예약 취소에 실패했습니다.')
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: '확정', className: 'bg-green-100 text-green-800' },
      cancelled: { label: '취소됨', className: 'bg-red-100 text-red-800' },
      completed: { label: '완료', className: 'bg-gray-100 text-gray-800' }
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const formatDate = (date: string) => {
    const d = new Date(date + 'T00:00:00')
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const weekday = weekdays[d.getDay()]
    return `${year}년 ${month}월 ${day}일 (${weekday})`
  }

  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed'
  const productImage = reservation.product.images?.[0] || '/placeholder-product.jpg'

  return (
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="md:flex">
        {/* 이미지 */}
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <Image
            src={productImage}
            alt={reservation.product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* 내용 */}
        <div className="md:w-2/3 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {reservation.product.name}
              </h3>
              {getStatusBadge(reservation.status)}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <span className="text-base">{formatDate(reservation.reservation_date)}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span className="text-base">
                {reservation.start_time} - {reservation.end_time}
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="h-5 w-5 flex-shrink-0" />
              <span className="text-base">{reservation.number_of_people}명</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <span className="text-base">{reservation.product.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <span className="text-xl font-bold text-primary">
                {reservation.total_price.toLocaleString()}원
              </span>
            </div>
          </div>

          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? '취소 처리중...' : '예약 취소'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
