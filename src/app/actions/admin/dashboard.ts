'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

/**
 * 대시보드 주요 지표 조회
 */
export async function getDashboardMetrics () {
  const supabase = await createServerSupabaseClient()
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const lastMonthStart = startOfMonth(subMonths(today, 1))
  const lastMonthEnd = endOfMonth(subMonths(today, 1))

  try {
    // 오늘의 매출
    const { data: todayPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'completed')
      .gte('paid_at', todayStart.toISOString())
      .lte('paid_at', todayEnd.toISOString())

    const todayRevenue = todayPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // 오늘의 예약
    const { data: todayReservations, count: todayReservationCount } = await supabase
      .from('reservations')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString())

    // 이번 달 매출
    const { data: monthPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'completed')
      .gte('paid_at', monthStart.toISOString())
      .lte('paid_at', monthEnd.toISOString())

    const monthRevenue = monthPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // 지난 달 매출
    const { data: lastMonthPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'completed')
      .gte('paid_at', lastMonthStart.toISOString())
      .lte('paid_at', lastMonthEnd.toISOString())

    const lastMonthRevenue = lastMonthPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // 이번 달 예약
    const { count: monthReservationCount } = await supabase
      .from('reservations')
      .select('*', { count: 'exact' })
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString())

    // 활성 상품 수
    const { count: activeProductCount } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    // 대기중인 예약
    const { count: pendingReservationCount } = await supabase
      .from('reservations')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')

    // 전월 대비 증감률 계산
    const revenueGrowth = lastMonthRevenue > 0
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

    return {
      todayRevenue,
      todayReservations: todayReservationCount || 0,
      monthRevenue,
      monthReservations: monthReservationCount || 0,
      activeProducts: activeProductCount || 0,
      pendingReservations: pendingReservationCount || 0,
      revenueGrowth: Number(revenueGrowth.toFixed(1))
    }
  } catch (error) {
    console.error('대시보드 지표 조회 오류:', error)
    throw new Error('대시보드 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 최근 예약 목록 조회
 */
export async function getRecentReservations (limit: number = 10) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        products (id, name, category),
        users (id, name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data
  } catch (error) {
    console.error('최근 예약 조회 오류:', error)
    throw new Error('최근 예약을 가져오는데 실패했습니다.')
  }
}

/**
 * 주간 매출 데이터 조회
 */
export async function getWeeklySalesData () {
  const supabase = await createServerSupabaseClient()
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, paid_at')
      .eq('payment_status', 'completed')
      .gte('paid_at', weekAgo.toISOString())
      .lte('paid_at', today.toISOString())
      .order('paid_at', { ascending: true })

    if (error) throw error

    // 날짜별로 그룹화
    const dailySales = new Map<string, number>()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateKey = format(date, 'yyyy-MM-dd')
      dailySales.set(dateKey, 0)
    }

    data?.forEach(payment => {
      if (payment.paid_at) {
        const dateKey = format(new Date(payment.paid_at), 'yyyy-MM-dd')
        const currentAmount = dailySales.get(dateKey) || 0
        dailySales.set(dateKey, currentAmount + payment.amount)
      }
    })

    return Array.from(dailySales.entries()).map(([date, amount]) => ({
      date: format(new Date(date), 'M/d'),
      amount
    }))
  } catch (error) {
    console.error('주간 매출 데이터 조회 오류:', error)
    throw new Error('주간 매출 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 예약 상태별 분포 조회
 */
export async function getReservationStatusDistribution () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('status')

    if (error) throw error

    const distribution: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0
    }

    data?.forEach(reservation => {
      if (reservation.status in distribution) {
        distribution[reservation.status]++
      }
    })

    return [
      { name: '대기', value: distribution.pending },
      { name: '확정', value: distribution.confirmed },
      { name: '취소', value: distribution.cancelled },
      { name: '완료', value: distribution.completed }
    ]
  } catch (error) {
    console.error('예약 상태 분포 조회 오류:', error)
    throw new Error('예약 상태 데이터를 가져오는데 실패했습니다.')
  }
}
