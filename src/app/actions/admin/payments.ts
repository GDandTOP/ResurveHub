'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 결제 목록 조회 (관리자용)
 */
export async function getAllPayments (filters?: {
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
}) {
  const supabase = await createServerSupabaseClient()

  try {
    let query = supabase
      .from('payments')
      .select(`
        *,
        reservations (
          id, 
          reservation_date, 
          start_time, 
          end_time,
          products (id, name, category),
          users (id, name, email, phone)
        )
      `)
      .order('created_at', { ascending: false })

    // 상태 필터
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('payment_status', filters.status)
    }

    // 날짜 범위 필터
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    // 검색어가 있으면 필터링
    if (filters?.search && data) {
      const searchLower = filters.search.toLowerCase()
      return data.filter(payment =>
        payment.id.toLowerCase().includes(searchLower) ||
        payment.transaction_id?.toLowerCase().includes(searchLower) ||
        payment.reservations?.users?.name?.toLowerCase().includes(searchLower) ||
        payment.reservations?.users?.email?.toLowerCase().includes(searchLower)
      )
    }

    return data
  } catch (error) {
    console.error('결제 목록 조회 오류:', error)
    throw new Error('결제 목록을 가져오는데 실패했습니다.')
  }
}

/**
 * 결제 상세 조회
 */
export async function getPaymentById (id: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        reservations (
          *,
          products (id, name, category, price_per_hour, images),
          users (id, name, email, phone)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('결제 상세 조회 오류:', error)
    throw new Error('결제 정보를 가져오는데 실패했습니다.')
  }
}

/**
 * 결제 통계 조회
 */
export async function getPaymentStats () {
  const supabase = await createServerSupabaseClient()

  try {
    // 전체 결제
    const { count: totalCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })

    // 완료된 결제
    const { count: completedCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('payment_status', 'completed')

    // 대기중인 결제
    const { count: pendingCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('payment_status', 'pending')

    // 환불된 결제
    const { count: refundedCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('payment_status', 'refunded')

    return {
      total: totalCount || 0,
      completed: completedCount || 0,
      pending: pendingCount || 0,
      refunded: refundedCount || 0
    }
  } catch (error) {
    console.error('결제 통계 조회 오류:', error)
    throw new Error('결제 통계를 가져오는데 실패했습니다.')
  }
}

/**
 * 환불 처리 (포트원 결제 취소 포함)
 */
export async function processRefund (paymentId: string, reason?: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // 1. 결제 정보 조회
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*, reservations (*)')
      .eq('id', paymentId)
      .single()

    if (fetchError) throw fetchError

    if (payment.payment_status !== 'completed') {
      return { 
        success: false, 
        error: '완료된 결제만 환불할 수 있습니다.' 
      }
    }

    // 2. 포트원 결제 취소 API 호출
    if (payment.transaction_id) {
      const apiSecret = process.env.PORTONE_V2_API_SECRET

      if (!apiSecret) {
        console.error('포트원 API 시크릿이 설정되지 않았습니다.')
        return {
          success: false,
          error: '결제 시스템 설정 오류가 발생했습니다.'
        }
      }

      try {
        // 포트원 V2 API로 결제 취소 요청
        const cancelResponse = await fetch(
          `https://api.portone.io/payments/${payment.transaction_id}/cancel`,
          {
            method: 'POST',
            headers: {
              'Authorization': `PortOne ${apiSecret}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason: reason || '관리자 환불 처리',
            }),
          }
        )

        const cancelData = await cancelResponse.json()

        if (!cancelResponse.ok) {
          console.error('포트원 결제 취소 실패:', cancelData)
          return {
            success: false,
            error: `결제 취소 실패: ${cancelData.message || '알 수 없는 오류'}`
          }
        }

        console.log('✅ 포트원 결제 취소 성공:', cancelData)
      } catch (portoneError) {
        console.error('포트원 API 호출 오류:', portoneError)
        return {
          success: false,
          error: '결제 취소 API 호출 중 오류가 발생했습니다.'
        }
      }
    }

    // 3. 결제 상태를 환불로 변경
    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        payment_status: 'refunded',
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (updateError) throw updateError

    // 4. 예약 상태를 취소로 변경
    if (payment.reservation_id) {
      await supabase
        .from('reservations')
        .update({ 
          status: 'cancelled',
          special_requests: reason ? `환불 사유: ${reason}` : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.reservation_id)
    }

    // 5. 캐시 무효화
    revalidatePath('/admin/payments')
    revalidatePath('/admin/reservations')
    
    return { 
      success: true,
      message: '결제가 취소되고 환불 처리되었습니다.'
    }
  } catch (error) {
    console.error('환불 처리 오류:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '환불 처리에 실패했습니다.'
    }
  }
}

/**
 * 결제 상태 변경
 */
export async function updatePaymentStatus (
  id: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  const supabase = await createServerSupabaseClient()

  try {
    const updateData: any = {
      payment_status: status,
      updated_at: new Date().toISOString()
    }

    // 상태에 따라 추가 필드 설정
    if (status === 'completed' && !updateData.paid_at) {
      updateData.paid_at = new Date().toISOString()
    }
    if (status === 'refunded' && !updateData.refunded_at) {
      updateData.refunded_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/payments')
    return { success: true, data }
  } catch (error) {
    console.error('결제 상태 변경 오류:', error)
    return { success: false, error: '결제 상태 변경에 실패했습니다.' }
  }
}
