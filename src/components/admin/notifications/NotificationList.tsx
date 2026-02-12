'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Bell, Check, CheckCheck, Trash2, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { markNotificationAsRead, markNotificationAsUnread, markAllAsRead, deleteNotification } from '@/app/actions/notifications'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Notification {
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

interface NotificationListProps {
  initialNotifications: Notification[]
}

export function NotificationList ({ initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Realtime 구독
    const channel = supabase
      .channel('admin-notifications-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=is.null'
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
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
          const updatedNotification = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          )
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
          const deletedId = payload.old.id
          setNotifications((prev) => prev.filter((n) => n.id !== deletedId))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  async function handleMarkAsRead (notificationId: string) {
    try {
      const result = await markNotificationAsRead(notificationId)
      
      if (result.success) {
        // 로컬 상태 즉시 업데이트
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        toast.success('알림을 읽음으로 표시했습니다')
      } else {
        toast.error(result.error || '알림 읽음 처리 실패')
      }
      
      router.refresh()
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error)
      toast.error('알림 처리 중 오류가 발생했습니다')
    }
  }

  async function handleMarkAsUnread (notificationId: string) {
    try {
      const result = await markNotificationAsUnread(notificationId)
      
      if (result.success) {
        // 로컬 상태 즉시 업데이트
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
        )
        toast.success('알림을 읽지 않음으로 표시했습니다')
      } else {
        toast.error(result.error || '알림 처리 실패')
      }
      
      router.refresh()
    } catch (error) {
      console.error('알림 읽지 않음 처리 오류:', error)
      toast.error('알림 처리 중 오류가 발생했습니다')
    }
  }

  async function handleMarkAllAsRead () {
    setIsMarkingAll(true)
    
    try {
      const result = await markAllAsRead(null)
      
      if (result.success) {
        // 로컬 상태 즉시 업데이트
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        )
        toast.success('모든 알림을 읽음으로 표시했습니다')
      } else {
        toast.error(result.error || '알림 읽음 처리 실패')
      }
      
      router.refresh()
    } catch (error) {
      console.error('모든 알림 읽음 처리 오류:', error)
      toast.error('알림 처리 중 오류가 발생했습니다')
    } finally {
      setIsMarkingAll(false)
    }
  }

  async function handleDelete (notificationId: string) {
    if (!confirm('이 알림을 삭제하시겠습니까?')) {
      return
    }
    
    try {
      const result = await deleteNotification(notificationId)
      
      if (result.success) {
        // 로컬 상태 즉시 업데이트
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast.success('알림이 삭제되었습니다')
      } else {
        toast.error(result.error || '알림 삭제 실패')
      }
      
      router.refresh()
    } catch (error) {
      console.error('알림 삭제 오류:', error)
      toast.error('알림 삭제 중 오류가 발생했습니다')
    }
  }

  function getNotificationIcon (type: string) {
    switch (type) {
      case 'reservation_confirmed':
        return <Calendar className="w-5 h-5 text-green-600" />
      case 'payment_completed':
        return <DollarSign className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-primary" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length
  
  // 필터링된 알림
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return n.is_read
    return true
  })

  return (
    <div className="space-y-4">
      {/* 필터 및 액션 버튼 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            읽지 않은 알림 <span className="font-semibold text-foreground">{unreadCount}개</span>
          </p>
          
          {/* 필터 버튼 */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              전체
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              읽지 않음
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              읽음
            </Button>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            모두 읽음 처리
          </Button>
        )}
      </div>

      {/* 알림 목록 */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border border-border">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {filter === 'all' ? '알림이 없습니다' : 
               filter === 'unread' ? '읽지 않은 알림이 없습니다' : 
               '읽은 알림이 없습니다'}
            </p>
            <p className="text-sm text-muted-foreground">
              새로운 예약이 생기면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card rounded-2xl p-6 border transition-all hover:shadow-md ${
                notification.is_read
                  ? 'border-border'
                  : 'border-primary/50 bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 아이콘 */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ko
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {notification.message}
                  </p>

                  {/* 추가 정보 */}
                  {notification.data && (
                    <div className="bg-accent/30 rounded-lg p-4 mb-4 space-y-2">
                      {notification.data.productName && (
                        <p className="text-sm">
                          <span className="font-medium">상품:</span> {notification.data.productName}
                        </p>
                      )}
                      {notification.data.userName && (
                        <p className="text-sm">
                          <span className="font-medium">고객:</span> {notification.data.userName}
                        </p>
                      )}
                      {notification.data.reservationDate && (
                        <p className="text-sm">
                          <span className="font-medium">날짜:</span> {notification.data.reservationDate}
                        </p>
                      )}
                      {notification.data.startTime && notification.data.endTime && (
                        <p className="text-sm">
                          <span className="font-medium">시간:</span> {notification.data.startTime} ~ {notification.data.endTime}
                        </p>
                      )}
                      {notification.data.amount && (
                        <p className="text-sm">
                          <span className="font-medium">금액:</span> {notification.data.amount.toLocaleString()}원
                        </p>
                      )}
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2">
                    {notification.data?.reservationId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reservations?id=${notification.data.reservationId}`}>
                          예약 보기
                        </Link>
                      </Button>
                    )}
                    
                    {!notification.is_read ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        읽음
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsUnread(notification.id)}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        안 읽음
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
