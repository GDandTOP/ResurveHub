/**
 * Product 타입 변환 유틸리티
 * Database Product를 클라이언트 Product 타입으로 변환
 */

import type { Product as DbProduct } from '@/types/database'
import type { Product as ClientProduct } from '@/types/product'

interface TimeSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

/**
 * Database Product를 Client Product로 변환
 */
export function dbProductToClientProduct(dbProduct: DbProduct): ClientProduct {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    images: dbProduct.images || [],
    category: dbProduct.category,
    pricePerHour: dbProduct.price_per_hour,
    capacity: dbProduct.capacity,
    location: dbProduct.location || '',
    amenities: dbProduct.amenities || [],
    availableTimeSlots: parseTimeSlots(dbProduct.available_time_slots),
    status: dbProduct.status,
    createdAt: new Date(dbProduct.created_at),
    updatedAt: new Date(dbProduct.updated_at)
  }
}

/**
 * JSON 타입의 time slots를 TimeSlot 배열로 파싱
 */
function parseTimeSlots(json: unknown): TimeSlot[] {
  if (Array.isArray(json)) {
    return json as TimeSlot[]
  }
  return []
}

/**
 * 여러 개의 Database Product를 Client Product로 변환
 */
export function dbProductsToClientProducts(dbProducts: DbProduct[]): ClientProduct[] {
  return dbProducts.map(dbProductToClientProduct)
}
