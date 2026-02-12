'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { createTestNotification } from '@/app/actions/notifications'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function NotificationTestButton () {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleTestNotification () {
    setLoading(true)

    try {
      const result = await createTestNotification()

      if (result.success) {
        toast.success(result.message || '테스트 알림이 생성되었습니다')
        router.refresh()
      } else {
        toast.error(result.error || '테스트 알림 생성 실패')
      }
    } catch (error) {
      console.error('테스트 알림 생성 오류:', error)
      toast.error('테스트 알림 생성 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleTestNotification}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Bell className="w-4 h-4" />
      {loading ? '생성 중...' : '테스트 알림'}
    </Button>
  )
}
