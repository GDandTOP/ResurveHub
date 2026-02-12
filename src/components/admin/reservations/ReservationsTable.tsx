'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react'
import { updateReservationStatus, cancelReservation } from '@/app/actions/admin/reservations'
import { useRouter } from 'next/navigation'
import { ReservationDetailModal } from './ReservationDetailModal'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ReservationsTableProps {
  reservations: any[]
}

/**
 * 예약 테이블 컴포넌트
 * 예약 목록을 테이블 형태로 표시
 */
export function ReservationsTable ({ reservations }: ReservationsTableProps) {
  const router = useRouter()
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // 상태 뱃지 스타일
  function getStatusBadge (status: string) {
    const styles = {
      pending: { variant: 'warning' as const, label: '승인대기', icon: Clock },
      confirmed: { variant: 'success' as const, label: '승인완료', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, label: '취소됨', icon: XCircle },
      completed: { variant: 'default' as const, label: '이용완료', icon: CheckCircle }
    }
    
    const config = styles[status as keyof typeof styles] || styles.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  // 예약 상태 변경
  async function handleStatusChange (id: string, newStatus: any) {
    // 상태별 확인 메시지
    const confirmMessages = {
      confirmed: '예약을 승인하시겠습니까?',
      cancelled: '예약을 취소하시겠습니까?',
      completed: '완료 처리 하시겠습니까?'
    }

    const message = confirmMessages[newStatus as keyof typeof confirmMessages] || '예약 상태를 변경하시겠습니까?'
    
    if (!confirm(message)) {
      return
    }

    setProcessingId(id)
    
    try {
      if (newStatus === 'cancelled') {
        const result = await cancelReservation(id, '관리자 취소')
        if (result.success) {
          alert(result.message || '예약이 취소되었습니다.')
          router.refresh()
        } else {
          alert(result.error)
        }
      } else {
        const result = await updateReservationStatus(id, newStatus)
        if (result.success) {
          const successMessages = {
            confirmed: '예약이 승인되었습니다.',
            completed: '완료 처리되었습니다.'
          }
          alert(successMessages[newStatus as keyof typeof successMessages] || '예약 상태가 변경되었습니다.')
          router.refresh()
        } else {
          alert(result.error)
        }
      }
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  // 상세보기
  function handleViewDetails (reservation: any) {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  if (reservations.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-20 text-center">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">예약이 없습니다</h3>
          <p className="text-muted-foreground">
            검색 조건에 맞는 예약이 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b-2">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold">예약일시</th>
                  <th className="text-left py-4 px-4 font-semibold">상품</th>
                  <th className="text-left py-4 px-4 font-semibold">고객정보</th>
                  <th className="text-left py-4 px-4 font-semibold">시간</th>
                  <th className="text-left py-4 px-4 font-semibold">금액</th>
                  <th className="text-left py-4 px-4 font-semibold">상태</th>
                  <th className="text-right py-4 px-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr 
                    key={reservation.id} 
                    className={`border-b hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    {/* 예약 날짜 */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(reservation.reservation_date), 'M월 d일 (E)', { locale: ko })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(reservation.created_at), 'yy.MM.dd HH:mm')}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 상품 정보 */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {reservation.products?.images?.[0] && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={reservation.products.images[0]}
                              alt={reservation.products.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium line-clamp-1">
                            {reservation.products?.name || '-'}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {reservation.products?.category || '-'}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    {/* 고객 정보 */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{reservation.users?.name || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{reservation.users?.phone || '-'}</span>
                        </div>
                      </div>
                    </td>

                    {/* 시간 */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div>{reservation.start_time} ~</div>
                          <div>{reservation.end_time}</div>
                        </div>
                      </div>
                    </td>

                    {/* 금액 */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold">
                          {(reservation.total_price || 0).toLocaleString()}원
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {reservation.number_of_people}명
                      </div>
                    </td>

                    {/* 상태 */}
                    <td className="py-4 px-4">
                      {getStatusBadge(reservation.status)}
                    </td>

                    {/* 작업 버튼 */}
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {reservation.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                              disabled={processingId === reservation.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                              disabled={processingId === reservation.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {reservation.status === 'confirmed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, 'completed')}
                              disabled={processingId === reservation.id}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="완료 처리"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                              disabled={processingId === reservation.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="예약 취소"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 상세보기 모달 */}
      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedReservation(null)
          }}
        />
      )}
    </>
  )
}
