# 알림 시스템 설정 가이드

## ⚠️ 에러가 발생하나요?

"알림 조회 오류" 메시지가 표시된다면 `notifications` 테이블이 아직 생성되지 않았을 가능성이 높습니다.

## 🚀 빠른 설정 (5분 완료)

### 1단계: Supabase 대시보드 접속

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2단계: 알림 테이블 생성

SQL Editor에 아래 코드를 **전체 복사**하여 붙여넣고 **Run** 버튼 클릭:

```sql
-- 알림 테이블 생성
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

-- RLS 정책: 사용자는 자신의 알림만 조회 가능
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- RLS 정책: 관리자는 모든 알림 조회 가능
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

-- RLS 정책: 사용자는 자신의 알림 업데이트 가능
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- RLS 정책: 관리자는 모든 알림 업데이트 가능
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

-- RLS 정책: 시스템에서 알림 생성 가능
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- RLS 정책: 관리자는 알림 삭제 가능
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

-- 업데이트 타임스탬프 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 3단계: 실행 확인

SQL 실행 후 다음 메시지가 표시되면 성공:

```
Success. No rows returned
```

### 4단계: Realtime 활성화 확인

1. Supabase 대시보드에서 **Database** → **Replication** 메뉴 클릭
2. `notifications` 테이블 찾기
3. 토글 버튼이 **ON**(초록색)인지 확인
4. OFF라면 클릭하여 활성화

### 5단계: 애플리케이션 새로고침

브라우저에서 관리자 페이지를 **새로고침** (Ctrl+Shift+R 또는 Cmd+Shift+R)

## ✅ 확인 방법

### 테이블 생성 확인

SQL Editor에서 실행:

```sql
SELECT * FROM notifications LIMIT 5;
```

에러 없이 실행되면 테이블이 정상적으로 생성된 것입니다.

### Realtime 활성화 확인

SQL Editor에서 실행:

```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'notifications';
```

결과가 나오면 Realtime이 활성화된 것입니다.

## 🧪 테스트

### 1. 테스트 알림 생성

SQL Editor에서 실행:

```sql
-- 관리자 알림 생성 (user_id가 null)
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  data
) VALUES (
  NULL,
  'test',
  '테스트 알림',
  '알림 시스템이 정상적으로 작동합니다.',
  '{"test": true}'::jsonb
);
```

### 2. 관리자 페이지 확인

1. 브라우저에서 관리자 페이지 열기
2. 우측 상단 알림 아이콘 확인
3. 배지에 "1" 표시되는지 확인
4. 알림 아이콘 클릭하여 `/admin/notifications` 페이지로 이동
5. 테스트 알림이 표시되는지 확인

## 🐛 문제 해결

### 에러: "relation notifications does not exist"

**원인**: 테이블이 생성되지 않음

**해결**:
1. 위의 2단계 SQL을 다시 실행
2. SQL 실행 시 에러 메시지 확인
3. 에러가 있다면 메시지 내용 확인 후 해결

### 에러: "permission denied for table notifications"

**원인**: RLS 정책 문제 또는 관리자 권한 없음

**해결**:
1. 관리자 계정의 `role` 필드 확인:
   ```sql
   SELECT id, email, role FROM users WHERE role = 'admin';
   ```

2. 관리자가 없다면 관리자 생성:
   ```sql
   -- 본인의 이메일로 변경
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

3. RLS 정책 재생성:
   - 2단계 SQL을 다시 실행

### 알림이 실시간으로 오지 않음

**원인**: Realtime이 활성화되지 않음

**해결**:
1. Database → Replication에서 `notifications` 테이블 활성화
2. 또는 SQL로 활성화:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
   ```

### 브라우저 콘솔 에러 확인

F12 → Console 탭에서 에러 메시지 확인:

- `relation notifications does not exist` → 테이블 생성 필요
- `permission denied` → RLS 정책 또는 관리자 권한 문제
- `websocket error` → Realtime 활성화 필요

## 📝 추가 설정 (선택사항)

### 알림 자동 삭제 (30일 이상 지난 읽은 알림)

```sql
-- 매일 자동 실행되는 함수 생성
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE is_read = true
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- pg_cron 확장 설치 (Supabase Pro 플랜 이상)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 매일 자정에 실행 (Pro 플랜에서만 가능)
-- SELECT cron.schedule('cleanup-old-notifications', '0 0 * * *', 'SELECT cleanup_old_notifications()');
```

> **참고**: `pg_cron`은 Supabase Pro 플랜 이상에서만 사용 가능합니다.

## 🎉 완료!

모든 단계를 완료했다면 실시간 알림 시스템이 정상적으로 작동합니다!

테스트 방법:
1. 시크릿 모드로 사용자 예약 진행
2. 결제 완료
3. 관리자 페이지에서 즉시 Toast 알림 확인

## 📚 관련 문서

- [REALTIME_NOTIFICATION_GUIDE.md](./REALTIME_NOTIFICATION_GUIDE.md) - 상세 시스템 가이드
- [NOTIFICATION_TEST_GUIDE.md](./NOTIFICATION_TEST_GUIDE.md) - 테스트 가이드
- [NOTIFICATION_SUMMARY.md](./NOTIFICATION_SUMMARY.md) - 시스템 요약

## 💡 문제가 계속되나요?

위의 모든 단계를 완료했는데도 문제가 해결되지 않는다면:

1. Supabase 로그 확인 (Dashboard → Logs)
2. 브라우저 콘솔 에러 메시지 캡처
3. 데이터베이스 구조 확인:
   ```sql
   \d notifications
   ```
