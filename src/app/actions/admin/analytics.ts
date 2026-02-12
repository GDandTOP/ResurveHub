'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

/**
 * 일별 매출 데이터 조회
 */
export async function getDailySalesData (days: number = 7) {
  const supabase = await createServerSupabaseClient()
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, paid_at')
      .eq('payment_status', 'completed')
      .gte('paid_at', startDate.toISOString())
      .lte('paid_at', endDate.toISOString())
      .order('paid_at', { ascending: true })

    if (error) throw error

    // 날짜별로 그룹화
    const dailyData = new Map<string, number>()
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      dailyData.set(dateKey, 0)
    })

    data?.forEach(payment => {
      if (payment.paid_at) {
        const dateKey = format(new Date(payment.paid_at), 'yyyy-MM-dd')
        const currentAmount = dailyData.get(dateKey) || 0
        dailyData.set(dateKey, currentAmount + payment.amount)
      }
    })

    return Array.from(dailyData.entries()).map(([date, amount]) => ({
      date: format(new Date(date), 'M/d'),
      fullDate: date,
      amount
    }))
  } catch (error) {
    console.error('일별 매출 데이터 조회 오류:', error)
    throw new Error('매출 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 일별 예약 데이터 조회
 */
export async function getDailyReservationsData (days: number = 7) {
  const supabase = await createServerSupabaseClient()
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)
  const startDateStr = format(startDate, 'yyyy-MM-dd')
  const endDateStr = format(endDate, 'yyyy-MM-dd')

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('reservation_date, status')
      .gte('reservation_date', startDateStr)
      .lte('reservation_date', endDateStr)
      .order('reservation_date', { ascending: true })

    if (error) throw error

    // 날짜별로 그룹화
    const dailyData = new Map<string, number>()
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      dailyData.set(dateKey, 0)
    })

    data?.forEach(reservation => {
      const dateKey = reservation.reservation_date
      const currentCount = dailyData.get(dateKey) || 0
      dailyData.set(dateKey, currentCount + 1)
    })

    return Array.from(dailyData.entries()).map(([date, count]) => ({
      date: format(new Date(date), 'M/d'),
      fullDate: date,
      count
    }))
  } catch (error) {
    console.error('일별 예약 데이터 조회 오류:', error)
    throw new Error('예약 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 상품별 매출 분포
 */
export async function getSalesByProduct (limit: number = 10) {
  const supabase = await createServerSupabaseClient()

  try {
    // 상품별 예약 및 매출 조회
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        product_id,
        total_price,
        products!inner (id, name, category)
      `)
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 상품별로 그룹화
    const productSales = new Map<string, { name: string, total: number, count: number }>()

    data?.forEach(reservation => {
      if (reservation.products && !Array.isArray(reservation.products)) {
        const productId = reservation.product_id
        const product = reservation.products as any
        const productName = product.name
        const current = productSales.get(productId) || { name: productName, total: 0, count: 0 }
        
        productSales.set(productId, {
          name: productName,
          total: current.total + reservation.total_price,
          count: current.count + 1
        })
      }
    })

    // 매출 순으로 정렬하고 상위 N개만 반환
    const sortedProducts = Array.from(productSales.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)

    return sortedProducts.map(product => ({
      name: product.name,
      value: product.total,
      count: product.count
    }))
  } catch (error) {
    console.error('상품별 매출 조회 오류:', error)
    throw new Error('상품별 매출 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 시간대별 예약 분포
 */
export async function getReservationsByTimeSlot () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('start_time')
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 시간대별로 그룹화 (09:00-18:00)
    const timeSlots = new Map<number, number>()
    for (let hour = 9; hour <= 18; hour++) {
      timeSlots.set(hour, 0)
    }

    data?.forEach(reservation => {
      const hour = parseInt(reservation.start_time.split(':')[0])
      if (hour >= 9 && hour <= 18) {
        const current = timeSlots.get(hour) || 0
        timeSlots.set(hour, current + 1)
      }
    })

    return Array.from(timeSlots.entries()).map(([hour, count]) => ({
      time: `${hour.toString().padStart(2, '0')}:00`,
      count
    }))
  } catch (error) {
    console.error('시간대별 예약 조회 오류:', error)
    throw new Error('시간대별 예약 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 인기 상품 TOP 10
 */
export async function getTopProducts (limit: number = 10) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        product_id,
        products!inner (id, name, category, images)
      `)
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 상품별 예약 수 집계
    const productCounts = new Map<string, { product: any, count: number }>()

    data?.forEach(reservation => {
      if (reservation.products && !Array.isArray(reservation.products)) {
        const productId = reservation.product_id
        const product = reservation.products as any
        const current = productCounts.get(productId) || { 
          product: product, 
          count: 0 
        }
        productCounts.set(productId, {
          product: current.product,
          count: current.count + 1
        })
      }
    })

    // 예약 수 순으로 정렬
    const topProducts = Array.from(productCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return topProducts.map((item, index) => ({
      rank: index + 1,
      id: item.product.id,
      name: item.product.name,
      category: item.product.category,
      image: item.product.images?.[0],
      reservationCount: item.count
    }))
  } catch (error) {
    console.error('인기 상품 조회 오류:', error)
    throw new Error('인기 상품 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 월별 매출 추이 (최근 12개월)
 */
export async function getMonthlySalesData () {
  const supabase = await createServerSupabaseClient()
  const endDate = new Date()
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1)

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, paid_at')
      .eq('payment_status', 'completed')
      .gte('paid_at', startDate.toISOString())
      .lte('paid_at', endDate.toISOString())
      .order('paid_at', { ascending: true })

    if (error) throw error

    // 월별로 그룹화
    const monthlyData = new Map<string, number>()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1)
      const monthKey = format(date, 'yyyy-MM')
      monthlyData.set(monthKey, 0)
    }

    data?.forEach(payment => {
      if (payment.paid_at) {
        const monthKey = format(new Date(payment.paid_at), 'yyyy-MM')
        const currentAmount = monthlyData.get(monthKey) || 0
        monthlyData.set(monthKey, currentAmount + payment.amount)
      }
    })

    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({
        month: format(new Date(month), 'yy.MM'),
        fullMonth: month,
        amount
      }))
      .reverse()
  } catch (error) {
    console.error('월별 매출 데이터 조회 오류:', error)
    throw new Error('월별 매출 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 카테고리별 예약 분포
 */
export async function getReservationsByCategory () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        product_id,
        products!inner (category)
      `)
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 카테고리별로 그룹화
    const categoryData = new Map<string, number>()

    data?.forEach(reservation => {
      if (reservation.products && !Array.isArray(reservation.products)) {
        const product = reservation.products as any
        const category = product.category
        if (category) {
          const current = categoryData.get(category) || 0
          categoryData.set(category, current + 1)
        }
      }
    })

    return Array.from(categoryData.entries()).map(([category, count]) => ({
      name: category,
      value: count
    }))
  } catch (error) {
    console.error('카테고리별 예약 조회 오류:', error)
    throw new Error('카테고리별 예약 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 상태별 예약 현황
 */
export async function getReservationsByStatus () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('status')

    if (error) throw error

    // 상태별로 그룹화
    const statusData = new Map<string, number>()
    const statusLabels: Record<string, string> = {
      pending: '대기',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소'
    }

    data?.forEach(reservation => {
      const status = reservation.status
      const current = statusData.get(status) || 0
      statusData.set(status, current + 1)
    })

    return Array.from(statusData.entries()).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      fill: status === 'confirmed' ? '#10b981' : 
            status === 'completed' ? '#3b82f6' : 
            status === 'pending' ? '#f59e0b' : '#ef4444'
    }))
  } catch (error) {
    console.error('상태별 예약 조회 오류:', error)
    throw new Error('상태별 예약 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 요일별 예약 분포
 */
export async function getReservationsByDayOfWeek () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('reservation_date')
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 요일별로 그룹화
    const dayData = new Map<number, number>()
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토']
    
    for (let i = 0; i < 7; i++) {
      dayData.set(i, 0)
    }

    data?.forEach(reservation => {
      const date = new Date(reservation.reservation_date)
      const dayOfWeek = date.getDay()
      const current = dayData.get(dayOfWeek) || 0
      dayData.set(dayOfWeek, current + 1)
    })

    return Array.from(dayData.entries()).map(([day, count]) => ({
      day: dayLabels[day],
      count
    }))
  } catch (error) {
    console.error('요일별 예약 조회 오류:', error)
    throw new Error('요일별 예약 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 카테고리별 매출 분포
 */
export async function getSalesByCategory () {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        total_price,
        products!inner (category)
      `)
      .in('status', ['confirmed', 'completed'])

    if (error) throw error

    // 카테고리별로 그룹화
    const categoryData = new Map<string, number>()

    data?.forEach(reservation => {
      if (reservation.products && !Array.isArray(reservation.products)) {
        const product = reservation.products as any
        const category = product.category
        if (category) {
          const current = categoryData.get(category) || 0
          categoryData.set(category, current + reservation.total_price)
        }
      }
    })

    return Array.from(categoryData.entries()).map(([category, amount]) => ({
      name: category,
      value: amount
    }))
  } catch (error) {
    console.error('카테고리별 매출 조회 오류:', error)
    throw new Error('카테고리별 매출 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 평균 예약 금액 추이
 */
export async function getAverageReservationAmount (days: number = 30) {
  const supabase = await createServerSupabaseClient()
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)
  const startDateStr = format(startDate, 'yyyy-MM-dd')
  const endDateStr = format(endDate, 'yyyy-MM-dd')

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('reservation_date, total_price')
      .in('status', ['confirmed', 'completed'])
      .gte('reservation_date', startDateStr)
      .lte('reservation_date', endDateStr)
      .order('reservation_date', { ascending: true })

    if (error) throw error

    // 날짜별로 그룹화
    const dailyData = new Map<string, { total: number, count: number }>()
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      dailyData.set(dateKey, { total: 0, count: 0 })
    })

    data?.forEach(reservation => {
      const dateKey = reservation.reservation_date
      const current = dailyData.get(dateKey) || { total: 0, count: 0 }
      dailyData.set(dateKey, {
        total: current.total + reservation.total_price,
        count: current.count + 1
      })
    })

    return Array.from(dailyData.entries()).map(([date, { total, count }]) => ({
      date: format(new Date(date), 'M/d'),
      fullDate: date,
      average: count > 0 ? Math.round(total / count) : 0
    }))
  } catch (error) {
    console.error('평균 예약 금액 조회 오류:', error)
    throw new Error('평균 예약 금액 데이터를 가져오는데 실패했습니다.')
  }
}

/**
 * 전체 통계 요약
 */
export async function getOverallStats () {
  const supabase = await createServerSupabaseClient()

  try {
    // 총 매출
    const { data: salesData } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'completed')

    const totalRevenue = salesData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    // 총 예약 수
    const { count: totalReservations } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })

    // 확정 예약 수
    const { count: confirmedReservations } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .in('status', ['confirmed', 'completed'])

    // 오늘 예약
    const today = format(new Date(), 'yyyy-MM-dd')
    const { count: todayReservations } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('reservation_date', today)

    // 이번 달 매출
    const startOfThisMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const endOfThisMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd')
    
    const { data: monthSalesData } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'completed')
      .gte('paid_at', new Date(startOfThisMonth).toISOString())
      .lte('paid_at', new Date(endOfThisMonth).toISOString())

    const monthRevenue = monthSalesData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    return {
      totalRevenue,
      totalReservations: totalReservations || 0,
      confirmedReservations: confirmedReservations || 0,
      todayReservations: todayReservations || 0,
      monthRevenue
    }
  } catch (error) {
    console.error('통계 요약 조회 오류:', error)
    throw new Error('통계 요약 데이터를 가져오는데 실패했습니다.')
  }
}
