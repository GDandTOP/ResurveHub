'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { InsertReservation } from '@/types/database'
import { revalidatePath } from 'next/cache'

/**
 * 예약 가능 여부 확인
 * 
 * 시간 겹침 조건:
 * - 새 시작 < 기존 종료 AND 새 종료 > 기존 시작
 * 
 * 예시:
 * - 기존: 10:00~12:00, 새: 09:00~11:00 → 겹침 (09:00 < 12:00 AND 11:00 > 10:00)
 * - 기존: 10:00~12:00, 새: 11:00~13:00 → 겹침 (11:00 < 12:00 AND 13:00 > 10:00)
 * - 기존: 10:00~12:00, 새: 12:00~14:00 → 안겹침 (12:00 >= 12:00)
 */
async function checkAvailability(
  productId: string,
  date: string,
  startTime: string,
  endTime: string
) {
  const supabase = await createServerSupabaseClient()

  // 겹치는 예약 찾기
  // 1. 새 시작 시간이 기존 종료 시간보다 이전이고 (start_time < endTime)
  // 2. 새 종료 시간이 기존 시작 시간보다 이후인 경우 (end_time > startTime)
  const { data, error } = await supabase
    .from('reservations')
    .select('id, start_time, end_time')
    .eq('product_id', productId)
    .eq('reservation_date', date)
    .in('status', ['pending', 'confirmed'])
    .lt('start_time', endTime)      // 기존 시작 < 새 종료
    .gt('end_time', startTime)      // 기존 종료 > 새 시작

  if (error) {
    throw new Error(error.message)
  }

  // 겹치는 예약이 없으면 true (예약 가능)
  return data.length === 0
}

/**
 * 예약 생성 Server Action
 */
export async function createReservationAction(reservationData: Omit<InsertReservation, 'user_id'>) {
  try {
    const supabase = await createServerSupabaseClient()

    // 서버 측에서 인증된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // 예약 가능 여부 확인
    const isAvailable = await checkAvailability(
      reservationData.product_id,
      reservationData.reservation_date,
      reservationData.start_time,
      reservationData.end_time
    )

    if (!isAvailable) {
      return {
        success: false,
        error: '해당 시간대는 이미 예약되어 있습니다.'
      }
    }

    // 서버 측에서 user_id를 추가
    const reservation: InsertReservation = {
      ...reservationData,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select(`
        *,
        user:users(email, name)
      `)
      .single()

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // 마이페이지와 상품 상세 페이지 재검증
    revalidatePath('/mypage')
    revalidatePath(`/products/${reservation.product_id}`)

    return {
      success: true,
      data: data as any
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 생성에 실패했습니다.'
    }
  }
}

/**
 * 예약 취소 Server Action (사용자용 - 결제 환불 포함)
 */
export async function cancelReservationAction(reservationId: string, reason?: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // 1. 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // 2. 예약 정보 조회 (본인 예약인지 확인)
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select(`
        *,
        products (name),
        users (name, email)
      `)
      .eq('id', reservationId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !reservation) {
      return {
        success: false,
        error: '예약 정보를 찾을 수 없습니다.'
      }
    }

    // 3. 이미 취소된 예약인지 확인
    if (reservation.status === 'cancelled') {
      return {
        success: false,
        error: '이미 취소된 예약입니다.'
      }
    }

    // 4. 관련 결제 정보 조회
    const { data: payment, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', reservationId)
      .eq('payment_status', 'completed')
      .single()

    // 5. 포트원 결제 취소 API 호출 (결제가 있는 경우)
    if (payment && payment.transaction_id) {
      const apiSecret = process.env.PORTONE_V2_API_SECRET

      if (apiSecret) {
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
                reason: reason || '사용자 예약 취소',
              }),
            }
          )

          const cancelData = await cancelResponse.json()

          if (!cancelResponse.ok) {
            console.error('포트원 결제 취소 실패:', cancelData)
            return {
              success: false,
              error: `결제 취소 실패: ${cancelData.message || '고객센터에 문의해주세요.'}`
            }
          }

          console.log('✅ 포트원 결제 취소 성공:', cancelData)
        } catch (portoneError) {
          console.error('포트원 API 호출 오류:', portoneError)
          return {
            success: false,
            error: '결제 취소 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.'
          }
        }
      }

      // 6. 결제 상태를 환불로 변경
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

    // 7. 예약 상태를 취소로 변경
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ 
        status: 'cancelled',
        special_requests: reason ? `취소 사유: ${reason}` : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId)

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      }
    }

    // 8. 캐시 무효화
    revalidatePath('/mypage')
    revalidatePath(`/products/${reservation.product_id}`)

    return {
      success: true,
      message: payment 
        ? '예약이 취소되고 결제가 환불 처리되었습니다.'
        : '예약이 취소되었습니다.'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 취소에 실패했습니다.'
    }
  }
}
