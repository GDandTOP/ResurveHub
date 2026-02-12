import { AlertCircle, Database, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface NotificationSetupGuideProps {
  error?: string
}

export function NotificationSetupGuide ({ error }: NotificationSetupGuideProps) {
  const setupSQL = `-- 알림 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS 정책
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications"
ON notifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update all notifications" ON notifications;
CREATE POLICY "Admins can update all notifications"
ON notifications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;
CREATE POLICY "Admins can delete notifications"
ON notifications FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 자동 타임스탬프 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(setupSQL)
    alert('SQL 코드가 클립보드에 복사되었습니다!')
  }

  return (
    <div className="max-w-4xl">
      {/* 에러 알림 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              알림 시스템 설정이 필요합니다
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              `notifications` 테이블이 아직 생성되지 않았습니다. 아래 단계를 따라 5분 안에 설정을 완료할 수 있습니다.
            </p>
            {error && (
              <div className="bg-yellow-100 rounded-lg p-3 mt-3">
                <p className="text-xs font-mono text-yellow-900">
                  에러: {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 설정 단계 */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">빠른 설정 가이드</h2>
        </div>

        {/* 1단계 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold">Supabase SQL Editor 열기</h3>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-muted-foreground">
              Supabase 대시보드의 SQL Editor에서 아래 SQL을 실행하세요.
            </p>
            <Button asChild variant="outline" className="gap-2">
              <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Supabase 대시보드 열기
              </a>
            </Button>
          </div>
        </div>

        {/* 2단계 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold">SQL 코드 복사 및 실행</h3>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-muted-foreground">
              아래 SQL 코드를 복사하여 SQL Editor에 붙여넣고 <strong>Run</strong> 버튼을 클릭하세요.
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-64 overflow-y-auto border border-border">
                <code>{setupSQL}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 gap-2"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4" />
                복사
              </Button>
            </div>
          </div>
        </div>

        {/* 3단계 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold">Realtime 활성화 확인</h3>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-muted-foreground">
              Supabase 대시보드 → <strong>Database</strong> → <strong>Replication</strong> 메뉴에서 
              `notifications` 테이블의 토글이 <strong className="text-green-600">ON</strong>인지 확인하세요.
            </p>
          </div>
        </div>

        {/* 4단계 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold">페이지 새로고침</h3>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-muted-foreground">
              설정이 완료되면 이 페이지를 새로고침하세요.
            </p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              페이지 새로고침
            </Button>
          </div>
        </div>

        {/* 추가 도움말 */}
        <div className="bg-accent/30 rounded-lg p-6 mt-8">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            문제가 계속되나요?
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>SQL 실행 시 에러 메시지를 확인하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>관리자 권한이 있는지 확인하세요 (users 테이블의 role이 'admin')</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                자세한 설정 가이드는{' '}
                <Link href="/NOTIFICATION_SETUP.md" className="text-primary underline">
                  NOTIFICATION_SETUP.md
                </Link>
                {' '}파일을 참고하세요
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
