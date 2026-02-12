import { AdminSidebar } from '@/components/admin/common/AdminSidebar'
import { AdminHeader } from '@/components/admin/common/AdminHeader'
import { RealtimeStatus } from '@/components/admin/notifications/RealtimeStatus'
import { Footer } from '@/components/layout/Footer'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export default async function AdminLayout ({
  children
}: {
  children: React.ReactNode
}) {
  // 서버사이드에서 관리자 권한 체크
  const hasAdminRole = await isAdmin()
  
  if (!hasAdminRole) {
    redirect('/')
  }

  return (
    <>
      <AdminSidebar />
      
      <div className="md:pl-64">
        <AdminHeader />
        
        <main className="min-h-screen p-6 md:p-8 bg-background">
          {children}
        </main>
        
        {/* Footer - sidebar 영향 받음 */}
        <Footer />
      </div>

      {/* Toast 알림 */}
      <Toaster position="top-right" richColors closeButton />

      {/* Realtime 연결 상태 (개발 모드에서만 표시) */}
      {/* 임시 비활성화 - 알림 기능은 정상 작동합니다 */}
      {/* {process.env.NODE_ENV === 'development' && <RealtimeStatus />} */}
    </>
  )
}
