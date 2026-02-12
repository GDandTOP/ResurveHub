'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { InsertProduct, UpdateProduct } from '@/types/database'

/**
 * 모든 상품 조회 (관리자용 - 비활성 포함)
 */
export async function getAllProducts (filters?: {
  status?: 'active' | 'inactive' | 'all'
  category?: string
  search?: string
}) {
  const supabase = await createServerSupabaseClient()

  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // 상태 필터
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // 카테고리 필터
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    // 검색
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.error('상품 목록 조회 오류:', error)
    throw new Error('상품 목록을 가져오는데 실패했습니다.')
  }
}

/**
 * 상품 ID로 조회
 */
export async function getProductById (id: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('상품 조회 오류:', error)
    throw new Error('상품을 가져오는데 실패했습니다.')
  }
}

/**
 * 상품 생성
 */
export async function createProduct (product: InsertProduct) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    return { success: true, data }
  } catch (error) {
    console.error('상품 생성 오류:', error)
    return { success: false, error: '상품 생성에 실패했습니다.' }
  }
}

/**
 * 상품 수정
 */
export async function updateProduct (id: string, updates: UpdateProduct) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error('상품 수정 오류:', error)
    return { success: false, error: '상품 수정에 실패했습니다.' }
  }
}

/**
 * 상품 삭제
 */
export async function deleteProduct (id: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // 먼저 해당 상품에 예약이 있는지 확인
    const { data: reservations } = await supabase
      .from('reservations')
      .select('id')
      .eq('product_id', id)
      .in('status', ['pending', 'confirmed'])
      .limit(1)

    if (reservations && reservations.length > 0) {
      return { 
        success: false, 
        error: '진행 중인 예약이 있는 상품은 삭제할 수 없습니다.' 
      }
    }

    // 상품 정보 조회 (이미지 URL 가져오기)
    const { data: product } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single()

    // 상품 삭제
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Storage에서 이미지 삭제
    if (product && product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('supabase')) {
          await deleteProductImage(imageUrl)
        }
      }
    }

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('상품 삭제 오류:', error)
    return { success: false, error: '상품 삭제에 실패했습니다.' }
  }
}

/**
 * 상품 상태 변경
 */
export async function updateProductStatus (
  id: string,
  status: 'active' | 'inactive'
) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    return { success: true, data }
  } catch (error) {
    console.error('상품 상태 변경 오류:', error)
    return { success: false, error: '상품 상태 변경에 실패했습니다.' }
  }
}

/**
 * 이미지 업로드
 */
export async function uploadProductImage (file: File, productId: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (!fileExt) {
      return { success: false, error: '파일 확장자를 확인할 수 없습니다.' }
    }

    // 허용된 확장자 확인
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    if (!allowedExtensions.includes(fileExt)) {
      return { success: false, error: '지원하지 않는 파일 형식입니다.' }
    }

    // 고유한 파일명 생성
    const fileName = `${productId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    // Storage에 업로드
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage 업로드 에러:', error)
      
      // 에러 타입별 메시지
      if (error.message.includes('Bucket not found')) {
        return { 
          success: false, 
          error: 'Storage bucket이 생성되지 않았습니다. STORAGE_SETUP_GUIDE.md를 참고하세요.' 
        }
      } else if (error.message.includes('new row violates row-level security policy')) {
        return { 
          success: false, 
          error: 'Storage 업로드 권한이 없습니다. Storage 정책을 확인하세요.' 
        }
      } else {
        return { 
          success: false, 
          error: `업로드 실패: ${error.message}` 
        }
      }
    }

    // Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error('이미지 업로드 오류:', error)
    return { 
      success: false, 
      error: error.message || '이미지 업로드에 실패했습니다.' 
    }
  }
}

/**
 * 이미지 삭제
 */
export async function deleteProductImage (imageUrl: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split('/product-images/')
    if (urlParts.length < 2) {
      console.error('잘못된 이미지 URL:', imageUrl)
      return { success: false, error: '잘못된 이미지 URL입니다.' }
    }

    const filePath = urlParts[1].split('?')[0] // query string 제거

    // Storage에서 삭제
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      console.error('Storage 삭제 에러:', error)
      return { 
        success: false, 
        error: `삭제 실패: ${error.message}` 
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('이미지 삭제 오류:', error)
    return { 
      success: false, 
      error: error.message || '이미지 삭제에 실패했습니다.' 
    }
  }
}
