# 실시간 알림 시스템 구현 완료

Supabase Realtime을 활용한 실시간 알림 시스템이 완성되었습니다.

## 🎯 구현된 기능

### 1. **Supabase Notifications 테이블**
- 알림 저장 및 관리
- RLS(Row Level Security) 적용
- Realtime 활성화

### 2. **결제 완료 시 자동 알림 생성**
- 유저가 예약하고 결제 완료하면 자동으로 관리자에게 알림 전송
- 예약 정보, 상품 정보, 결제 금액 등 상세 정보 포함

### 3. **실시간 알림 수신**
- Supabase Realtime을 통해 실시간으로 알림 수신
- Toast 팝업으로 즉시 알림 표시
- 알림 소리 재생 (선택사항)

### 4. **알림 아이콘**
- 헤더에 알림 벨 아이콘 표시
- 읽지 않은 알림 개수 배지 표시
- 실시간 개수 업데이트

### 5. **알림 페이지**
- `/admin/notifications` 경로
- 알림 목록 표시 (최신순)
- 읽음/읽지 않음 상태 표시
- 개별 읽음 처리
- 모두 읽음 처리
- 알림 삭제
- 예약 상세 페이지로 이동

## 🚀 설치 및 설정

### 1. Supabase 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

\`\`\`sql
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
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- RLS 정책: 관리자는 모든 알림 조회 가능
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
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- RLS 정책: 시스템에서 알림 생성 가능
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

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
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
\`\`\`

### 2. Supabase Realtime 설정

Supabase Dashboard에서 다음을 확인하세요:

1. **Database > Replication** 메뉴로 이동
2. `notifications` 테이블의 Realtime이 활성화되어 있는지 확인
3. 활성화되어 있지 않다면 토글을 켜서 활성화

### 3. 패키지 설치 (이미 완료됨)

\`\`\`bash
npm install sonner
\`\`\`

## 📁 생성된 파일

### Server Actions
- \`src/app/actions/notifications.ts\` - 알림 CRUD 액션

### 컴포넌트
- \`src/components/admin/common/NotificationBell.tsx\` - 알림 벨 아이콘 (실시간)
- \`src/components/admin/notifications/NotificationList.tsx\` - 알림 목록 (실시간)

### 페이지
- \`src/app/admin/notifications/page.tsx\` - 알림 페이지

### 타입
- \`src/types/supabase.ts\` - notifications 테이블 타입 추가
- \`src/types/database.ts\` - Notification 타입 export

### 마이그레이션
- \`supabase/migrations/notifications.sql\` - 테이블 생성 SQL

## 🔔 알림 타입

현재 구현된 알림 타입:

- \`reservation_confirmed\` - 예약 확정 (결제 완료)
- \`payment_completed\` - 결제 완료
- \`reservation_cancelled\` - 예약 취소

추가 타입은 필요에 따라 확장 가능합니다.

## 💡 사용 방법

### 관리자 페이지에서 알림 확인

1. 관리자 페이지 상단 우측의 **벨 아이콘** 확인
2. 새 알림이 오면 **빨간 배지**와 **Toast 팝업** 표시
3. 벨 아이콘 클릭 또는 Toast의 "확인" 버튼 클릭
4. 알림 페이지에서 상세 내용 확인
5. "예약 보기" 버튼으로 해당 예약으로 이동
6. "읽음" 버튼으로 개별 읽음 처리
7. "모두 읽음 처리" 버튼으로 일괄 처리

### 테스트 방법

1. 사용자 계정으로 상품 예약 및 결제 진행
2. 결제 완료 후 관리자 페이지 확인
3. 실시간으로 Toast 알림이 표시되는지 확인
4. 알림 벨 아이콘의 배지 개수 증가 확인
5. 알림 페이지에서 알림 내용 확인

## 🎨 UI/UX 특징

- ✅ **실시간 업데이트** - Supabase Realtime 구독
- ✅ **Toast 알림** - 새 알림 즉시 표시
- ✅ **배지 카운터** - 읽지 않은 알림 개수
- ✅ **애니메이션** - 배지 pulse 효과
- ✅ **읽음/읽지 않음** - 시각적 구분
- ✅ **상세 정보** - 예약/상품/결제 정보 포함
- ✅ **빠른 액션** - 예약 상세로 바로 이동

## 🔧 커스터마이징

### 알림 소리 추가 (선택사항)

\`public/notification.mp3\` 파일을 추가하면 알림 소리가 재생됩니다.

### 추가 알림 타입 생성

\`src/app/actions/payment.ts\`의 패턴을 참고하여 다른 이벤트에서도 알림을 생성할 수 있습니다:

\`\`\`typescript
import { createNotification } from '@/app/actions/notifications'

// 예: 예약 취소 시
await createNotification({
  userId: null, // 관리자 알림
  type: 'reservation_cancelled',
  title: '예약이 취소되었습니다',
  message: '고객이 예약을 취소했습니다.',
  data: { reservationId, reason, ... }
})
\`\`\`

## 📊 데이터 구조

### Notification 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | 사용자 ID (null = 관리자 알림) |
| type | VARCHAR | 알림 타입 |
| title | VARCHAR | 알림 제목 |
| message | TEXT | 알림 내용 |
| data | JSONB | 추가 데이터 |
| is_read | BOOLEAN | 읽음 여부 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## 🎉 완료!

실시간 알림 시스템이 완벽하게 구현되었습니다. 
관리자는 이제 예약 및 결제 상황을 실시간으로 확인할 수 있습니다!
