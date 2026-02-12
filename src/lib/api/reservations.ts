'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ReservationWithDetails } from '@/types/database'

/**
 * 사용자의 예약 목록 가져오기
 */
export async function getUserReservations(): Promise<ReservationWithDetails[]> {
  const supabase = await createServerSupabaseClient()

  // 현재 로그인한 사용자 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  // 사용자의 예약 목록 조회 (상품 정보 포함)
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('reservation_date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) {
    console.error('예약 목록 조회 오류:', error)
    return []
  }

  return data as unknown as ReservationWithDetails[]
}

/**
 * 특정 예약 상세 정보 가져오기
 */
export async function getReservationById(reservationId: string): Promise<ReservationWithDetails | null> {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      product:products(*),
      payment:payments(*)
    `)
    .eq('id', reservationId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('예약 조회 오류:', error)
    return null
  }

  return data as unknown as ReservationWithDetails
}

/**
 * 상품의 예약된 시간대 조회
 */
export async function getProductReservations(
  productId: string,
  date: string
): Promise<Array<{ start_time: string; end_time: string }>> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('start_time, end_time')
    .eq('product_id', productId)
    .eq('reservation_date', date)
    .in('status', ['pending', 'confirmed'])

  if (error) {
    console.error('예약 시간대 조회 오류:', error)
    return []
  }

  return data
}
