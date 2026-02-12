'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Calendar,
  CreditCard,
  BarChart3,
  Bell,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  {
    name: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: '상품 관리',
    href: '/admin/products',
    icon: Package
  },
  {
    name: '예약 관리',
    href: '/admin/reservations',
    icon: Calendar
  },
  {
    name: '결제 관리',
    href: '/admin/payments',
    icon: CreditCard
  },
  {
    name: '통계 분석',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: '알림',
    href: '/admin/notifications',
    icon: Bell
  }
]

export function AdminSidebar () {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-background border shadow-lg hover:bg-accent transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* 오버레이 (모바일) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* 로고 영역 */}
          <div className="flex items-center h-20 px-6 border-b">
            <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl group-hover:blur-lg transition-all duration-500" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary/95 to-primary/85 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                  <LayoutDashboard className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                관리자
              </span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="text-base">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* 하단 링크 */}
          <div className="px-4 py-4 border-t">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all"
            >
              <span>← 사용자 페이지로</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
