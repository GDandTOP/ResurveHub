'use client'

import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NotificationBell } from './NotificationBell'

export function AdminHeader () {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  async function handleLogout () {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-20 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-6 md:px-8">
        {/* 빈 공간 (모바일 메뉴 버튼 영역) */}
        <div className="md:hidden w-10" />

        {/* 페이지 제목은 각 페이지에서 별도 표시 */}
        <div className="flex-1" />

        {/* 우측 액션 */}
        <div className="flex items-center space-x-4">
          {/* 알림 */}
          <NotificationBell />

          {/* 사용자 정보 */}
          <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-accent/30">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {user?.email || '관리자'}
            </span>
          </div>

          {/* 로그아웃 */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  )
}
