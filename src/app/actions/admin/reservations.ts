'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * 예약 목록 조회 (관리자용)
 */
export async function getAllReservations (filters?: {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
}) {
  const supabase = await createServerSupabaseClient()

  try {
    let query = supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category, price_per_hour),
        users (id, name, email, phone)
      `)
      .order('reservation_date', { ascending: false })

    // 상태 필터
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // 날짜 범위 필터
    if (filters?.dateFrom) {
      query = query.gte('reservation_date', filters.dateFrom)
    }
    if (filters?.dateTo) {
      query = query.lte('reservation_date', filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    // 검색어가 있으면 클라이언트 사이드에서 필터링
    if (filters?.search && data) {
      const searchLower = filters.search.toLowerCase()
      return data.filter(reservation =>
        reservation.users?.name?.toLowerCase().includes(searchLower) ||
        reservation.users?.email?.toLowerCase().includes(searchLower) ||
        reservation.products?.name?.toLowerCase().includes(searchLower)
      )
    }

    return data
  } catch (error) {
    console.error('예약 목록 조회 오류:', error)
    throw new Error('예약 목록을 가져오는데 실패했습니다.')
  }
}

/**
 * 특정 날짜의 예약 조회
 */
export async function getReservationsByDate (date: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category),
        users (id, name, email)
      `)
      .eq('reservation_date', date)
      .order('start_time', { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    console.error('날짜별 예약 조회 오류:', error)
    throw new Error('예약을 가져오는데 실패했습니다.')
  }
}

/**
 * 캘린더용 예약 데이터 조회
 */
export async function getCalendarReservations (startDate: string, endDate: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category),
        users (id, name, email)
      `)
      .gte('reservation_date', startDate)
      .lte('reservation_date', endDate)

    if (error) throw error

    // 캘린더 이벤트 형식으로 변환
    return data?.map(reservation => ({
      id: reservation.id,
      title: `${reservation.products?.name} - ${reservation.users?.name}`,
      start: new Date(`${reservation.reservation_date}T${reservation.start_time}`),
      end: new Date(`${reservation.reservation_date}T${reservation.end_time}`),
      resource: {
        ...reservation,
        product: reservation.products,
        user: reservation.users
      }
    })) || []
  } catch (error) {
    console.error('캘린더 예약 조회 오류:', error)
    throw new Error('캘린더 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 예약 상세 조회
 */
export async function getReservationById (id: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category, price_per_hour, images),
        users (id, name, email, phone),
        payments (id, amount, payment_method, payment_status, paid_at)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('예약 상세 조회 오류:', error)
    throw new Error('예약 정보를 가져오는데 실패했습니다.')
  }
}

/**
 * 예약 상태 변경
 */
export async function updateReservationStatus (
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/reservations')
    return { success: true, data }
  } catch (error) {
    console.error('예약 상태 변경 오류:', error)
    return { success: false, error: '예약 상태 변경에 실패했습니다.' }
  }
}

/**
 * 예약 취소 (결제 취소/환불 포함)
 */
export async function cancelReservation (id: string, reason?: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // 1. 예약 정보 조회
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select(`
        *,
        products (name),
        users (name, email)
      `)
      .eq('id', id)
      .single()

    if (fetchError || !reservation) {
      return { 
        success: false, 
        error: '예약 정보를 찾을 수 없습니다.' 
      }
    }

    // 2. 관련 결제 정보 조회
    const { data: payment, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', id)
      .eq('payment_status', 'completed')
      .single()

    // 3. 포트원 결제 취소 API 호출 (결제가 있는 경우)
    if (payment && payment.transaction_id) {
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
              reason: reason || '관리자 예약 취소',
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
        // 포트원 API 오류가 있어도 계속 진행 (수동 환불 가능)
      }
    }

    // 4. 결제 상태를 환불로 변경
    if (payment) {
      const { error: paymentUpdateError } = await supabase
        .from('payments')
        .update({ 
          payment_status: 'refunded',
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)

      if (paymentUpdateError) {
        console.error('결제 상태 업데이트 오류:', paymentUpdateError)
      }
    }

    // 5. 예약 상태를 취소로 변경
    const { error: reservationError } = await supabase
      .from('reservations')
      .update({ 
        status: 'cancelled', 
        special_requests: reason ? `취소 사유: ${reason}` : null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)

    if (reservationError) throw reservationError

    // 6. 캐시 무효화
    revalidatePath('/admin/reservations')
    revalidatePath('/admin/payments')
    revalidatePath('/mypage')

    return { 
      success: true,
      message: payment 
        ? '예약이 취소되고 결제가 환불 처리되었습니다.'
        : '예약이 취소되었습니다.'
    }
  } catch (error) {
    console.error('예약 취소 오류:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '예약 취소에 실패했습니다.'
    }
  }
}

/**
 * 오늘의 예약 조회
 */
export async function getTodayReservations () {
  const supabase = await createServerSupabaseClient()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category),
        users (id, name, email, phone)
      `)
      .eq('reservation_date', todayStr)
      .order('start_time', { ascending: true })

    if (error) throw error

    return data
  } catch (error) {
    console.error('오늘의 예약 조회 오류:', error)
    throw new Error('오늘의 예약을 가져오는데 실패했습니다.')
  }
}
