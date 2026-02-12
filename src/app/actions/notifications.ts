'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Notification {
  id: string
  user_id: string | null
  type: string
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
  updated_at: string
}

/**
 * 알림 생성
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  data = {}
}: {
  userId?: string | null
  type: string
  title: string
  message: string
  data?: any
}) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, notification }
  } catch (error) {
    console.error('알림 생성 오류:', error)
    return { success: false, error: '알림 생성에 실패했습니다.' }
  }
}

/**
 * 관리자용 알림 목록 조회
 */
export async function getAdminNotifications(limit = 50) {
  try {
    const supabase = await createServerSupabaseClient()

    // 먼저 테이블 존재 여부 확인
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .is('user_id', null) // 관리자 전용 알림 (user_id가 null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('알림 조회 Supabase 오류:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    return { success: true, notifications: data || [] }
  } catch (error) {
    console.error('알림 조회 오류:', error)
    // 테이블이 없는 경우 빈 배열 반환
    return { success: false, notifications: [], error: error instanceof Error ? error.message : '알림을 불러올 수 없습니다.' }
  }
}

/**
 * 사용자 알림 목록 조회
 */
export async function getUserNotifications(userId: string, limit = 50) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, notifications: data || [] }
  } catch (error) {
    console.error('알림 조회 오류:', error)
    return { success: false, notifications: [] }
  }
}

/**
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadCount(userId?: string | null) {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    if (userId === null) {
      query = query.is('user_id', null) // 관리자 알림
    } else if (userId) {
      query = query.eq('user_id', userId)
    }

    const { count, error } = await query

    if (error) throw error

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('읽지 않은 알림 개수 조회 오류:', error)
    return { success: false, count: 0 }
  }
}

/**
 * 알림 읽음 처리
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error

    // 페이지 갱신
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '알림 읽음 처리 실패' }
  }
}

/**
 * 알림 읽지 않음 처리
 */
export async function markNotificationAsUnread(notificationId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: false })
      .eq('id', notificationId)

    if (error) throw error

    // 페이지 갱신
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('알림 읽지 않음 처리 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '알림 읽지 않음 처리 실패' }
  }
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllAsRead(userId?: string | null) {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)

    if (userId === null) {
      query = query.is('user_id', null)
    } else if (userId) {
      query = query.eq('user_id', userId)
    }

    const { error } = await query

    if (error) throw error

    // 페이지 갱신
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '알림 읽음 처리 실패' }
  }
}

/**
 * 알림 삭제
 */
export async function deleteNotification(notificationId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error

    // 페이지 갱신
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('알림 삭제 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '알림 삭제 실패' }
  }
}

/**
 * 테스트 알림 생성 (개발/디버깅 용도)
 */
export async function createTestNotification() {
  try {
    const result = await createNotification({
      userId: null, // 관리자 알림
      type: 'test',
      title: '테스트 알림',
      message: '알림 시스템이 정상적으로 작동하고 있습니다.',
      data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    })

    if (result.success) {
      revalidatePath('/admin/notifications')
      return { success: true, message: '테스트 알림이 생성되었습니다.' }
    }

    return { success: false, error: '테스트 알림 생성 실패' }
  } catch (error) {
    console.error('테스트 알림 생성 오류:', error)
    return { success: false, error: error instanceof Error ? error.message : '테스트 알림 생성 실패' }
  }
}
