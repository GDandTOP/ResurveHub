/**
 * 상품(Product) API 함수들
 */

import { createClient } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Product, InsertProduct, UpdateProduct } from '@/types/database'

// ===== 서버 컴포넌트용 조회 함수 =====

/**
 * 모든 활성 상품 조회 (서버용)
 */
export async function getProductsServer(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
}) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // 필터 적용
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.minPrice) {
    query = query.gte('price_per_hour', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price_per_hour', filters.maxPrice)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}

/**
 * 상품 ID로 단일 상품 조회 (서버용)
 */
export async function getProductByIdServer(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data as Product
}

// ===== 클라이언트용 조회 함수 =====

/**
 * 모든 활성 상품 조회
 */
export async function getProducts(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
}) {
  const supabase = createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // 필터 적용
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.minPrice) {
    query = query.gte('price_per_hour', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price_per_hour', filters.maxPrice)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}

/**
 * 상품 ID로 단일 상품 조회
 */
export async function getProductById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Product
}

/**
 * 카테고리별 상품 조회
 */
export async function getProductsByCategory(category: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}

/**
 * 인기 상품 조회 (예약 수 기준)
 */
export async function getPopularProducts(limit: number = 5) {
  const supabase = createClient()

  // 예약 수를 기준으로 정렬하려면 서버에서 집계가 필요
  // 여기서는 간단히 최신순으로 반환
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}

// ===== 관리 함수 (관리자 전용) =====

/**
 * 모든 상품 조회 (관리자용 - 비활성 포함)
 */
export async function getAllProductsAdmin() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}

/**
 * 상품 생성 (관리자 전용)
 */
export async function createProduct(product: InsertProduct) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Product
}

/**
 * 상품 수정 (관리자 전용)
 */
export async function updateProduct(id: string, updates: UpdateProduct) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Product
}

/**
 * 상품 삭제 (관리자 전용)
 */
export async function deleteProduct(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * 상품 상태 변경 (관리자 전용)
 */
export async function updateProductStatus(
  id: string,
  status: 'active' | 'inactive'
) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Product
}

/**
 * 상품 검색
 */
export async function searchProducts(searchTerm: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}
