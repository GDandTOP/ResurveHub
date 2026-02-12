'use server'

import { getProductReservations } from '@/lib/api/reservations'

/**
 * 특정 날짜의 예약된 시간대 조회
 */
export async function getReservationsForDate(productId: string, date: string) {
  return await getProductReservations(productId, date)
}

/**
 * 날짜 범위의 예약 조회
 */
export async function getReservationsForDateRange(productId: string, startDate: Date, endDate: Date) {
  const { createServerSupabaseClient } = await import('@/lib/supabase/server')
  const supabase = await createServerSupabaseClient()

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('reservations')
    .select('reservation_date, start_time, end_time')
    .eq('product_id', productId)
    .gte('reservation_date', startDateStr)
    .lte('reservation_date', endDateStr)
    .in('status', ['pending', 'confirmed'])

  if (error) {
    console.error('예약 조회 오류:', error)
    return []
  }

  return data
}
