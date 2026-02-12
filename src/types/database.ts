/**
 * 데이터베이스 타입 유틸리티
 * Supabase 타입을 애플리케이션에서 사용하기 쉽게 재정의
 */

import { Database } from './supabase'

// 기본 테이블 타입
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// 개별 타입 export
export type User = Tables<'users'>
export type Product = Tables<'products'>
export type Reservation = Tables<'reservations'>
export type Payment = Tables<'payments'>
export type Notification = Tables<'notifications'>

export type InsertUser = InsertDto<'users'>
export type InsertProduct = InsertDto<'products'>
export type InsertReservation = InsertDto<'reservations'>
export type InsertPayment = InsertDto<'payments'>
export type InsertNotification = InsertDto<'notifications'>

export type UpdateUser = UpdateDto<'users'>
export type UpdateProduct = UpdateDto<'products'>
export type UpdateReservation = UpdateDto<'reservations'>
export type UpdatePayment = UpdateDto<'payments'>
export type UpdateNotification = UpdateDto<'notifications'>

// 조인된 타입들
export interface ReservationWithDetails extends Reservation {
  product: Product
  user: Pick<User, 'id' | 'name' | 'email' | 'phone'>
  payment?: Payment
}

export interface ProductWithReservations extends Product {
  reservations: Reservation[]
}

// 통계 타입
export interface Statistics {
  totalRevenue: number
  totalReservations: number
  todayReservations: number
  weekReservations: number
  pendingReservations: number
  revenueByMonth: {
    month: string
    revenue: number
  }[]
  popularProducts: {
    productId: string
    productName: string
    reservationCount: number
  }[]
}

// 시간대 타입
export interface TimeSlot {
  dayOfWeek: number // 0(일요일) ~ 6(토요일)
  startTime: string // HH:mm
  endTime: string // HH:mm
}

// 타입 변환 헬퍼
export function parseTimeSlots(json: unknown): TimeSlot[] {
  if (Array.isArray(json)) {
    return json as TimeSlot[]
  }
  return []
}
