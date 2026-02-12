'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PaymentDetailModal } from './PaymentDetailModal'

interface Payment {
  id: string
  amount: number
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  paid_at: string | null
  created_at: string
  reservations: {
    id: string
    reservation_date: string
    products: {
      name: string
    } | null
    users: {
      name: string
      email: string
    } | null
  } | null
}

interface PaymentsTableProps {
  payments: Payment[]
}

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'destructive',
  refunded: 'secondary'
} as const

const statusLabels = {
  pending: '대기중',
  completed: '완료',
  failed: '실패',
  refunded: '환불'
}

const paymentMethodLabels: Record<string, string> = {
  card: '카드',
  transfer: '계좌이체',
  kakao: '카카오페이',
  toss: '토스'
}

export function PaymentsTable ({ payments }: PaymentsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.reservations?.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.reservations?.users?.email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="space-y-6">
        {/* 검색 & 필터 */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="결제 ID 또는 고객명으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 상태</option>
                <option value="completed">완료</option>
                <option value="pending">대기중</option>
                <option value="failed">실패</option>
                <option value="refunded">환불</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 결제 목록 */}
        <Card className="border-2">
          <CardContent className="pt-6">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {search || statusFilter !== 'all' 
                  ? '검색 결과가 없습니다'
                  : '결제 내역이 없습니다'
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">결제일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">결제 ID</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">상품</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">고객</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">금액</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">결제수단</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          {payment.paid_at 
                            ? format(new Date(payment.paid_at), 'yy.MM.dd HH:mm')
                            : format(new Date(payment.created_at), 'yy.MM.dd HH:mm')
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-xs">{payment.id.slice(0, 8)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{payment.reservations?.products?.name || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{payment.reservations?.users?.name || '-'}</div>
                            <div className="text-xs text-muted-foreground">{payment.reservations?.users?.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {payment.amount.toLocaleString()}원
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {paymentMethodLabels[payment.payment_method] || payment.payment_method}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={statusColors[payment.payment_status]}>
                            {statusLabels[payment.payment_status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedPayment && (
        <PaymentDetailModal
          paymentId={selectedPayment.id}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  )
}
