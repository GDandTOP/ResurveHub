'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { playNotificationSound, showBrowserNotification, requestNotificationPermission } from '@/lib/utils/notification-sound'

export function NotificationBell () {
  const [unreadCount, setUnreadCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 브라우저 알림 권한 요청
    requestNotificationPermission()

    // 초기 읽지 않은 알림 개수 조회
    async function fetchUnreadCount () {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .is('user_id', null) // 관리자 알림
          .eq('is_read', false)

        if (!error && count !== null) {
          setUnreadCount(count)
        } else if (error) {
          // 테이블이 없을 경우 조용히 무시 (설정 페이지에서 안내됨)
          console.log('알림 테이블 조회 실패 (설정 필요):', error.message)
        }
      } catch (e) {
        // 에러 무시
      }
    }

    fetchUnreadCount()

    // 로컬 스토리지에서 소리 설정 불러오기
    const savedSoundSetting = localStorage.getItem('notification-sound-enabled')
    if (savedSoundSetting !== null) {
      setSoundEnabled(savedSoundSetting === 'true')
    }

    // Realtime 구독
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=is.null' // 관리자 알림만
        },
        (payload) => {
          const notification = payload.new as any
          
          // 읽지 않은 알림 개수 증가
          setUnreadCount((prev) => prev + 1)

          // Toast 알림 표시
          toast.success(notification.title, {
            description: notification.message,
            action: {
              label: '확인',
              onClick: () => {
                window.location.href = '/admin/notifications'
              }
            },
            duration: 5000
          })

          // 알림 소리 재생
          if (soundEnabled) {
            playNotificationSound()
          }

          // 브라우저 네이티브 알림
          showBrowserNotification(notification.title, {
            body: notification.message,
            tag: notification.id,
            requireInteraction: false
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=is.null'
        },
        (payload) => {
          const oldNotification = payload.old as any
          const newNotification = payload.new as any
          
          // 읽지 않음 → 읽음으로 변경된 경우에만 카운트 감소
          if (!oldNotification.is_read && newNotification.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
          // 읽음 → 읽지 않음으로 변경된 경우 카운트 증가
          else if (oldNotification.is_read && !newNotification.is_read) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=is.null'
        },
        (payload) => {
          const deletedNotification = payload.old as any
          
          // 삭제된 알림이 읽지 않은 상태였다면 카운트 감소
          if (!deletedNotification.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, soundEnabled])

  return (
    <Link
      href="/admin/notifications"
      className="relative p-2 hover:bg-accent rounded-lg transition-colors group"
      title="알림"
    >
      <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse shadow-lg">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
