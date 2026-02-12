'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getPaymentById, processRefund, updatePaymentStatus } from '@/app/actions/admin/payments'
import { useRouter } from 'next/navigation'

interface PaymentDetailModalProps {
  paymentId: string
  onClose: () => void
}

const statusLabels = {
  pending: '대기중',
  completed: '완료',
  failed: '실패',
  refunded: '환불'
}

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'destructive',
  refunded: 'secondary'
} as const

const paymentMethodLabels: Record<string, string> = {
  card: '신용/체크카드',
  transfer: '계좌이체',
  kakao: '카카오페이',
  toss: '토스'
}

export function PaymentDetailModal ({ paymentId, onClose }: PaymentDetailModalProps) {
  const router = useRouter()
  const [payment, setPayment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadPayment()
  }, [paymentId])

  async function loadPayment () {
    setIsLoading(true)
    try {
      const data = await getPaymentById(paymentId)
      setPayment(data)
    } catch (error) {
      console.error('결제 정보 로드 오류:', error)
      alert('결제 정보를 불러오는데 실패했습니다.')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefund () {
    const reason = prompt('환불 사유를 입력하세요:')
    if (!reason) return

    setIsUpdating(true)
    const result = await processRefund(paymentId, reason)
    setIsUpdating(false)

    if (result.success) {
      alert('환불 처리가 완료되었습니다.')
      router.refresh()
      onClose()
    } else {
      alert(result.error)
    }
  }

  async function handleStatusChange (newStatus: 'pending' | 'completed' | 'failed' | 'refunded') {
    if (!confirm(`결제 상태를 "${statusLabels[newStatus]}"(으)로 변경하시겠습니까?`)) return

    setIsUpdating(true)
    const result = await updatePaymentStatus(paymentId, newStatus)
    setIsUpdating(false)

    if (result.success) {
      router.refresh()
      loadPayment()
    } else {
      alert(result.error)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background rounded-2xl p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">결제 상세</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 상태 */}
          <div>
            <label className="text-sm text-muted-foreground">결제 상태</label>
            <div className="mt-1">
              <Badge variant={statusColors[payment.payment_status as keyof typeof statusColors]} className="text-base px-4 py-1">
                {statusLabels[payment.payment_status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">결제 ID</label>
              <div className="mt-1 font-mono text-sm">{payment.id}</div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">결제수단</label>
              <div className="mt-1 font-medium">
                {paymentMethodLabels[payment.payment_method] || payment.payment_method}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">결제 금액</label>
              <div className="mt-1 font-bold text-primary text-xl">
                {payment.amount.toLocaleString()}원
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">결제 일시</label>
              <div className="mt-1 font-medium">
                {payment.paid_at 
                  ? format(new Date(payment.paid_at), 'yyyy.MM.dd HH:mm:ss')
                  : '-'
                }
              </div>
            </div>

            {payment.transaction_id && (
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">거래 ID</label>
                <div className="mt-1 font-mono text-sm">{payment.transaction_id}</div>
              </div>
            )}
          </div>

          {/* 예약 정보 */}
          {payment.reservations && (
            <>
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">예약 정보</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">상품</label>
                    <div className="mt-1">
                      <div className="font-medium">{payment.reservations.products?.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.reservations.products?.category}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">예약일</label>
                      <div className="mt-1 font-medium">
                        {format(new Date(payment.reservations.reservation_date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">시간</label>
                      <div className="mt-1 font-medium">
                        {payment.reservations.start_time} - {payment.reservations.end_time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 고객 정보 */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">고객 정보</h3>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-muted-foreground">이름</label>
                    <div className="mt-1 font-medium">{payment.reservations.users?.name}</div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">이메일</label>
                    <div className="mt-1">{payment.reservations.users?.email}</div>
                  </div>
                  {payment.reservations.users?.phone && (
                    <div>
                      <label className="text-sm text-muted-foreground">연락처</label>
                      <div className="mt-1">{payment.reservations.users.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 환불 정보 */}
          {payment.refunded_at && (
            <div className="border-t pt-6">
              <h3 className="font-bold mb-4 text-red-600">환불 정보</h3>
              <div>
                <label className="text-sm text-muted-foreground">환불 일시</label>
                <div className="mt-1 font-medium">
                  {format(new Date(payment.refunded_at), 'yyyy.MM.dd HH:mm:ss')}
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          {payment.payment_status === 'completed' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleRefund}
                disabled={isUpdating}
                variant="destructive"
                className="flex-1"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                환불 처리
              </Button>
            </div>
          )}

          {payment.payment_status === 'pending' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                결제 확인
              </Button>
              <Button
                onClick={() => handleStatusChange('failed')}
                disabled={isUpdating}
                variant="destructive"
                className="flex-1"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                결제 실패
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
