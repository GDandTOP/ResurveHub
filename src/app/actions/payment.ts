'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

/**
 * 포트원 결제 검증 및 처리
 */
export async function verifyAndProcessPayment({
  paymentId,
  amount,
  reservationId,
}: {
  paymentId: string
  amount: number
  reservationId: string
}) {
  try {
    const supabase = await createServerSupabaseClient()

    // 1. 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      }
    }

    // 2. 포트원 결제 정보 조회 및 검증
    const apiSecret = process.env.PORTONE_V2_API_SECRET

    if (!apiSecret) {
      return {
        success: false,
        error: '결제 시스템 설정 오류',
      }
    }

    // 포트원 V2 API로 결제 정보 조회
    const response = await fetch(
      `https://api.portone.io/payments/${paymentId}`,
      {
        headers: {
          Authorization: `PortOne ${apiSecret}`,
        },
      }
    )

    if (!response.ok) {
      return {
        success: false,
        error: '결제 정보 조회 실패',
      }
    }

    const paymentData = await response.json()

    // 3. 결제 금액 검증
    if (paymentData.amount?.total !== amount) {
      return {
        success: false,
        error: '결제 금액이 일치하지 않습니다.',
      }
    }

    // 4. 결제 상태 확인
    if (paymentData.status !== 'PAID') {
      return {
        success: false,
        error: '결제가 완료되지 않았습니다.',
      }
    }

    // 5. 예약 정보 조회 (상품 정보 포함)
    const { data: reservation, error: reservationFetchError } = await supabase
      .from('reservations')
      .select(`
        *,
        products:product_id (
          id,
          name,
          category
        )
      `)
      .eq('id', reservationId)
      .eq('user_id', user.id)
      .single()

    if (reservationFetchError || !reservation) {
      return {
        success: false,
        error: '예약 정보를 찾을 수 없습니다.',
      }
    }

    // 6. payments 테이블에 결제 정보 저장
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: reservationId,
        user_id: user.id,
        amount: amount,
        payment_method: 'card',
        payment_status: 'completed',
        transaction_id: paymentId,
        paid_at: new Date().toISOString(),
      })

    if (paymentError) {
      console.error('결제 정보 저장 오류:', paymentError)
      return {
        success: false,
        error: '결제 정보 저장 실패',
      }
    }

    // 7. 예약 상태를 confirmed로 업데이트
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)

    if (updateError) {
      console.error('예약 상태 업데이트 오류:', updateError)
      return {
        success: false,
        error: '예약 상태 업데이트 실패',
      }
    }

    // 8. 관리자에게 실시간 알림 생성
    const productInfo = reservation.products as any
    await createNotification({
      userId: null, // 관리자 알림 (user_id를 null로 설정)
      type: 'reservation_confirmed',
      title: '새로운 예약이 확정되었습니다',
      message: `${productInfo?.name || '상품'}에 대한 예약이 결제 완료되었습니다.`,
      data: {
        reservationId: reservation.id,
        productId: reservation.product_id,
        productName: productInfo?.name,
        userName: user.email,
        amount: amount,
        reservationDate: reservation.reservation_date,
        startTime: reservation.start_time,
        endTime: reservation.end_time
      }
    })

    // 9. 캐시 무효화
    revalidatePath('/mypage')
    revalidatePath(`/products/${reservation.product_id}`)
    revalidatePath('/admin/reservations')
    revalidatePath('/admin/notifications')

    return {
      success: true,
      message: '결제가 완료되었습니다.',
    }
  } catch (error) {
    console.error('결제 검증 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 결제 취소
 */
export async function cancelPayment(paymentId: string) {
  try {
    const apiSecret = process.env.PORTONE_V2_API_SECRET

    if (!apiSecret) {
      return {
        success: false,
        error: '결제 시스템 설정 오류',
      }
    }

    const response = await fetch(
      `https://api.portone.io/payments/${paymentId}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `PortOne ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: '사용자 요청',
        }),
      }
    )

    if (!response.ok) {
      return {
        success: false,
        error: '결제 취소 실패',
      }
    }

    return {
      success: true,
      message: '결제가 취소되었습니다.',
    }
  } catch (error) {
    console.error('결제 취소 오류:', error)
    return {
      success: false,
      error: '결제 취소 중 오류가 발생했습니다.',
    }
  }
}
