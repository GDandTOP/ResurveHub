'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Users,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { updateReservationStatus, cancelReservation } from '@/app/actions/admin/reservations'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ReservationDetailModalProps {
  reservation: any
  open: boolean
  onClose: () => void
}

/**
 * 예약 상세 정보 모달
 */
export function ReservationDetailModal ({ reservation, open, onClose }: ReservationDetailModalProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // 상태 변경
  async function handleStatusChange (newStatus: any) {
    const confirmMessages = {
      confirmed: '예약을 승인하시겠습니까?',
      cancelled: '예약을 취소하시겠습니까?',
      completed: '완료 처리 하시겠습니까?'
    }

    if (!confirm(confirmMessages[newStatus as keyof typeof confirmMessages])) {
      return
    }

    setIsProcessing(true)

    try {
      if (newStatus === 'cancelled') {
        const result = await cancelReservation(reservation.id, '관리자 취소')
        if (result.success) {
          alert(result.message || '예약이 취소되었습니다.')
          router.refresh()
          onClose()
        } else {
          alert(result.error)
        }
      } else {
        const result = await updateReservationStatus(reservation.id, newStatus)
        if (result.success) {
          const successMessages = {
            confirmed: '예약이 승인되었습니다.',
            completed: '완료 처리되었습니다.'
          }
          alert(successMessages[newStatus as keyof typeof successMessages] || '예약 상태가 변경되었습니다.')
          router.refresh()
          onClose()
        } else {
          alert(result.error)
        }
      }
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 상태 뱃지
  function getStatusBadge (status: string) {
    const config = {
      pending: { variant: 'warning' as const, label: '승인대기', icon: Clock },
      confirmed: { variant: 'success' as const, label: '승인완료', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, label: '취소됨', icon: XCircle },
      completed: { variant: 'default' as const, label: '이용완료', icon: CheckCircle }
    }
    
    const { variant, label, icon: Icon } = config[status as keyof typeof config] || config.pending
    
    return (
      <Badge variant={variant} className="text-sm px-3 py-1">
        <Icon className="h-4 w-4 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">예약 상세 정보</DialogTitle>
          <DialogDescription>
            예약 ID: {reservation.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 상태 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-semibold">예약 상태</h3>
            {getStatusBadge(reservation.status)}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              상품 정보
            </h3>
            <div className="bg-muted/30 p-4 rounded-xl space-y-3">
              {reservation.products?.images?.[0] && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={reservation.products.images[0]}
                    alt={reservation.products.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xl">{reservation.products?.name || '-'}</h4>
                  <Badge variant="outline" className="mt-2">
                    {reservation.products?.category || '-'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">시간당</div>
                  <div className="font-bold text-lg">
                    {(reservation.products?.price_per_hour || 0).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              예약 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">예약 날짜</div>
                <div className="font-semibold">
                  {format(new Date(reservation.reservation_date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">이용 시간</div>
                <div className="font-semibold">
                  {reservation.start_time} - {reservation.end_time}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">인원</div>
                <div className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {reservation.number_of_people}명
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">총 금액</div>
                <div className="font-bold text-primary text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {(reservation.total_price || 0).toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              고객 정보
            </h3>
            <div className="bg-muted/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">이름</div>
                  <div className="font-semibold">{reservation.users?.name || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">이메일</div>
                  <div className="font-semibold">{reservation.users?.email || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">전화번호</div>
                  <div className="font-semibold">{reservation.users?.phone || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 특별 요청사항 */}
          {reservation.special_requests && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                특별 요청사항
              </h3>
              <div className="bg-muted/30 p-4 rounded-xl">
                <p className="text-sm">{reservation.special_requests}</p>
              </div>
            </div>
          )}

          {/* 결제 정보 */}
          {reservation.payments && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 정보
              </h3>
              <div className="bg-muted/30 p-4 rounded-xl grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">결제 금액</div>
                  <div className="font-bold">{(reservation.payments.amount || 0).toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">결제 수단</div>
                  <div className="font-semibold">{reservation.payments.payment_method || '-'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">결제 상태</div>
                  <Badge variant={reservation.payments.payment_status === 'completed' ? 'success' : 'warning'}>
                    {reservation.payments.payment_status === 'completed' && '결제완료'}
                    {reservation.payments.payment_status === 'pending' && '결제대기'}
                    {reservation.payments.payment_status === 'failed' && '결제실패'}
                    {reservation.payments.payment_status === 'refunded' && '환불완료'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* 작업 버튼 */}
          <div className="flex gap-3 pt-4 border-t">
            {reservation.status === 'pending' && (
              <>
                <Button
                  className="flex-1"
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  예약 승인
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  예약 취소
                </Button>
              </>
            )}

            {reservation.status === 'confirmed' && (
              <>
                <Button
                  className="flex-1"
                  onClick={() => handleStatusChange('completed')}
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  이용 완료 처리
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  예약 취소
                </Button>
              </>
            )}

            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
