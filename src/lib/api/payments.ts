/**
 * 결제(Payment) API 함수들
 */

import { createClient } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Payment, InsertPayment, UpdatePayment } from '@/types/database'

// ===== 조회 함수 =====

/**
 * 사용자의 모든 결제 내역 조회
 */
export async function getUserPayments(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      *,
      reservation:reservations(
        *,
        product:products(name)
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * 결제 ID로 단일 결제 조회
 */
export async function getPaymentById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      *,
      reservation:reservations(
        *,
        product:products(*),
        user:users(name, email, phone)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * 예약 ID로 결제 조회
 */
export async function getPaymentByReservationId(reservationId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reservation_id', reservationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // 결제가 없는 경우
      return null
    }
    throw new Error(error.message)
  }

  return data as Payment
}

// ===== 생성/수정 함수 =====

/**
 * 결제 생성
 */
export async function createPayment(payment: InsertPayment) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Payment
}

/**
 * 결제 상태 업데이트
 */
export async function updatePaymentStatus(
  id: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  updates?: {
    transactionId?: string
    paidAt?: string
    refundedAt?: string
  }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payments')
    .update({
      payment_status: status,
      ...updates
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Payment
}

/**
 * 결제 완료 처리
 */
export async function completePayment(id: string, transactionId: string) {
  return updatePaymentStatus(id, 'completed', {
    transactionId,
    paidAt: new Date().toISOString()
  })
}

/**
 * 결제 실패 처리
 */
export async function failPayment(id: string) {
  return updatePaymentStatus(id, 'failed')
}

// ===== 관리자 함수 =====

/**
 * 모든 결제 내역 조회 (관리자용)
 */
export async function getAllPaymentsAdmin(filters?: {
  status?: string
  method?: string
  startDate?: string
  endDate?: string
}) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('payments')
    .select(
      `
      *,
      reservation:reservations(
        *,
        product:products(name),
        user:users(name, email)
      )
    `
    )
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('payment_status', filters.status)
  }
  if (filters?.method) {
    query = query.eq('payment_method', filters.method)
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * 환불 처리 (관리자용)
 */
export async function refundPayment(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('payments')
    .update({
      payment_status: 'refunded',
      refunded_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // 관련 예약도 취소 처리
  if (data) {
    await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', data.reservation_id)
  }

  return data as Payment
}

/**
 * 총 매출 조회 (관리자용)
 */
export async function getTotalRevenue(startDate?: string, endDate?: string) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')

  if (startDate) {
    query = query.gte('paid_at', startDate)
  }
  if (endDate) {
    query = query.lte('paid_at', endDate)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  const total = data.reduce((sum, payment) => sum + payment.amount, 0)
  return total
}

/**
 * 결제 수단별 통계 (관리자용)
 */
export async function getPaymentMethodStats() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('payments')
    .select('payment_method, amount')
    .eq('payment_status', 'completed')

  if (error) {
    throw new Error(error.message)
  }

  const stats = data.reduce(
    (acc, payment) => {
      if (!acc[payment.payment_method]) {
        acc[payment.payment_method] = { count: 0, total: 0 }
      }
      acc[payment.payment_method].count++
      acc[payment.payment_method].total += payment.amount
      return acc
    },
    {} as Record<string, { count: number; total: number }>
  )

  return stats
}
