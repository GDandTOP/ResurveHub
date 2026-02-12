# 실시간 알림 시스템 - 빠른 시작 가이드

## 📋 준비사항 체크리스트

- [ ] Supabase에 notifications 테이블 생성
- [ ] Supabase Realtime 활성화
- [ ] sonner 패키지 설치 완료 ✅
- [ ] 코드 파일 생성 완료 ✅

## 🚀 즉시 시작하기

### 1단계: Supabase 테이블 생성 (2분)

1. Supabase Dashboard 접속
2. **SQL Editor** 메뉴 클릭
3. 아래 SQL 복사 → 붙여넣기 → 실행

\`\`\`sql
-- 이 SQL을 복사해서 Supabase SQL Editor에 붙여넣고 실행하세요
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

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
ON notifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
\`\`\`

### 2단계: Realtime 활성화 확인 (30초)

1. Supabase Dashboard → **Database** → **Replication**
2. \`notifications\` 테이블 찾기
3. Realtime 토글이 켜져 있는지 확인 (파란색)
4. 꺼져 있다면 토글 클릭해서 활성화

### 3단계: 테스트 (1분)

#### 방법 1: 실제 결제로 테스트
1. 일반 사용자 계정으로 로그인
2. 상품 선택 → 날짜/시간 선택 → 예약하기
3. 결제 진행 및 완료
4. 관리자 페이지에서 **실시간 알림** 확인!

#### 방법 2: 직접 알림 생성 (테스트용)
Supabase SQL Editor에서 실행:

\`\`\`sql
-- 테스트 알림 생성
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  data
) VALUES (
  NULL, -- 관리자 알림
  'test',
  '테스트 알림입니다',
  '알림 시스템이 정상 작동합니다!',
  '{"test": true}'::jsonb
);
\`\`\`

→ 관리자 페이지에서 **즉시** Toast 팝업과 벨 아이콘 배지를 확인하세요!

## 🎯 확인 포인트

알림이 정상 작동하면:

✅ 우측 상단 벨 아이콘에 빨간 배지 (개수)  
✅ 화면 우측 상단에 Toast 팝업  
✅ "확인" 버튼 클릭 시 알림 페이지 이동  
✅ \`/admin/notifications\` 페이지에서 알림 목록 표시  

## 🔧 문제 해결

### Toast가 안 뜨는 경우
- Realtime이 활성화되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 페이지 새로고침 후 재시도

### 알림이 저장되지 않는 경우
- SQL이 정상 실행되었는지 확인
- RLS 정책이 올바르게 생성되었는지 확인
- Supabase 콘솔에서 에러 로그 확인

### Realtime이 작동하지 않는 경우
- Supabase Dashboard에서 Realtime 활성화 확인
- \`ALTER PUBLICATION supabase_realtime ADD TABLE notifications;\` 실행 확인

## 📱 기능 설명

### 관리자 페이지 구성

**헤더 (우측 상단)**
- 🔔 알림 벨 아이콘
- 읽지 않은 알림 개수 배지
- 클릭 시 알림 페이지로 이동

**사이드바**
- 📢 "알림" 메뉴 추가
- 클릭 시 \`/admin/notifications\` 이동

**알림 페이지 (\`/admin/notifications\`)**
- 실시간 알림 목록
- 읽음/읽지 않음 상태
- 예약 상세 정보 (상품명, 고객, 날짜, 금액)
- "예약 보기" 버튼 (해당 예약으로 이동)
- "읽음" 버튼 (개별 처리)
- "모두 읽음 처리" 버튼
- 삭제 버튼

## 🎉 완료!

이제 실시간 알림 시스템이 완전히 작동합니다!

새로운 예약이 들어올 때마다 관리자에게 **즉시** 알림이 전송됩니다.

---

더 자세한 내용은 \`REALTIME_NOTIFICATION_SETUP.md\`를 참고하세요.
