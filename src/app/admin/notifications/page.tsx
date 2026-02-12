import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { NotificationList } from '@/components/admin/notifications/NotificationList'
import { NotificationSetupGuide } from '@/components/admin/notifications/NotificationSetupGuide'
import { NotificationTestButton } from '@/components/admin/notifications/NotificationTestButton'
import { getAdminNotifications } from '@/app/actions/notifications'

export default async function AdminNotificationsPage () {
  const result = await getAdminNotifications(100)

  // 테이블이 없거나 에러가 발생한 경우 설정 가이드 표시
  if (!result.success && result.error) {
    return (
      <div className="space-y-8">
        <Breadcrumb items={[{ name: '알림' }]} />
        <PageHeader
          title="알림"
          description="새로운 예약 및 시스템 알림을 확인하세요"
        />
        <NotificationSetupGuide error={result.error} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '알림' }]} />

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="알림"
          description="새로운 예약 및 시스템 알림을 확인하세요"
        />
        {process.env.NODE_ENV === 'development' && (
          <NotificationTestButton />
        )}
      </div>

      {/* 알림 목록 */}
      <NotificationList initialNotifications={result.notifications} />
    </div>
  )
}
