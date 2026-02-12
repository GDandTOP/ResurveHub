# 실시간 알림 시스템 가이드

## 📢 개요

Supabase Realtime을 활용한 실시간 알림 시스템이 구축되어 있습니다.
사용자가 결제를 완료하고 예약이 확정되면, 관리자 페이지에 실시간으로 Toast 알림이 표시되고, 알림 아이콘에 배지가 표시됩니다.

## 🎯 주요 기능

### 1. 실시간 알림
- **Supabase Realtime** 을 사용하여 실시간 알림 수신
- 새로운 예약이 확정되면 즉시 관리자에게 알림
- Toast 메시지로 알림 내용 표시
- 알림 소리 재생 (Web Audio API 사용)

### 2. 알림 아이콘 배지
- 읽지 않은 알림 개수를 실시간으로 표시
- 99개 이상은 "99+" 로 표시
- 애니메이션 효과 (pulse)

### 3. 알림 페이지
- `/admin/notifications` 에서 모든 알림 확인 가능
- 읽음/읽지 않음 상태 구분
- 알림 상세 정보 표시 (상품명, 고객, 날짜, 시간, 금액)
- 예약 페이지로 바로 이동 가능
- 개별 읽음 처리 또는 모두 읽음 처리
- 알림 삭제 기능

## 🔧 시스템 구조

### 1. 데이터베이스 (Supabase)

#### notifications 테이블
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id), -- NULL이면 관리자 알림
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

#### RLS (Row Level Security) 정책
- 관리자는 모든 알림 조회 가능
- 사용자는 자신의 알림만 조회 가능
- 시스템은 알림 생성 가능

### 2. 알림 생성 흐름

```
사용자 결제 완료
    ↓
verifyAndProcessPayment() 실행
    ↓
결제 검증 및 예약 상태를 'confirmed'로 변경
    ↓
createNotification() 호출
    ↓
notifications 테이블에 INSERT
    ↓
Supabase Realtime이 변경사항 감지
    ↓
구독 중인 모든 관리자 클라이언트에 알림 전송
    ↓
NotificationBell 컴포넌트에서 알림 수신
    ↓
Toast 알림 표시 + 소리 재생 + 배지 업데이트
```

### 3. 주요 파일 구조

```
src/
├── app/
│   ├── actions/
│   │   ├── payment.ts              # 결제 처리 (알림 생성 트리거)
│   │   └── notifications.ts        # 알림 CRUD 액션
│   └── admin/
│       └── notifications/
│           └── page.tsx             # 알림 페이지
├── components/
│   └── admin/
│       ├── common/
│       │   ├── AdminHeader.tsx     # 헤더 (NotificationBell 포함)
│       │   └── NotificationBell.tsx # 실시간 알림 아이콘
│       └── notifications/
│           └── NotificationList.tsx # 알림 목록 컴포넌트
└── supabase/
    └── migrations/
        └── notifications.sql        # 알림 테이블 마이그레이션
```

## 📝 사용 방법

### 1. 관리자 페이지에서 실시간 알림 받기

1. 관리자로 로그인
2. 관리자 페이지 접속 (우측 상단에 알림 아이콘 표시)
3. 다른 브라우저 또는 시크릿 모드에서 일반 사용자로 로그인
4. 상품 예약 후 결제 완료
5. 관리자 페이지에 즉시 Toast 알림 표시됨
6. 알림 아이콘에 배지 숫자 증가

### 2. 알림 확인하기

1. 우측 상단 알림 아이콘 클릭
2. `/admin/notifications` 페이지로 이동
3. 모든 알림 확인 가능
4. 읽지 않은 알림은 파란색 테두리로 강조 표시

### 3. 알림 관리하기

#### 개별 읽음 처리
- 각 알림의 "읽음" 버튼 클릭

#### 모두 읽음 처리
- 상단의 "모두 읽음 처리" 버튼 클릭

#### 알림 삭제
- 각 알림의 휴지통 아이콘 클릭

#### 예약 상세 보기
- "예약 보기" 버튼 클릭하여 예약 관리 페이지로 이동

## 🎨 알림 타입

### reservation_confirmed (예약 확정)
- **아이콘**: 📅 Calendar (초록색)
- **제목**: "새로운 예약이 확정되었습니다"
- **메시지**: "{상품명}에 대한 예약이 결제 완료되었습니다."
- **추가 정보**:
  - 상품명
  - 고객 이메일
  - 예약 날짜
  - 시간 (시작~종료)
  - 금액

### payment_completed (결제 완료)
- **아이콘**: 💵 DollarSign (파란색)
- **제목**: "결제가 완료되었습니다"
- **메시지**: 결제 상세 내역

## 🔊 알림 소리

Web Audio API를 사용하여 간단한 비프음(Beep) 생성:
- 주파수: 800Hz
- 파형: Sine wave
- 길이: 0.5초
- 볼륨: 0.3

> **참고**: 사용자 상호작용 전에는 브라우저 정책상 소리가 재생되지 않을 수 있습니다.

## 🧪 테스트 방법

### 로컬 환경에서 테스트

1. **터미널 1**: 개발 서버 실행
   ```bash
   npm run dev
   ```

2. **브라우저 1**: 관리자 페이지 열기
   ```
   http://localhost:3000/admin
   ```

3. **브라우저 2**: (시크릿 모드) 일반 사용자로 예약 진행
   ```
   http://localhost:3000/products
   ```

4. 예약 → 결제 완료 → 관리자 페이지에서 알림 확인

### 실시간 구독 확인

브라우저 개발자 도구 콘솔에서 다음 메시지 확인:
```
Realtime subscription connected
```

## 🛠️ 커스터마이징

### 알림 타입 추가

1. **알림 생성** (`src/app/actions/notifications.ts`)
   ```typescript
   await createNotification({
     userId: null, // 관리자 알림
     type: 'new_type',
     title: '새로운 알림',
     message: '메시지 내용',
     data: { /* 추가 데이터 */ }
   })
   ```

2. **아이콘 추가** (`NotificationList.tsx`)
   ```typescript
   function getNotificationIcon (type: string) {
     switch (type) {
       case 'new_type':
         return <YourIcon className="w-5 h-5 text-color" />
       // ...
     }
   }
   ```

### 알림 소리 변경

`NotificationBell.tsx`에서 `oscillator.frequency.value` 값 수정:
```typescript
oscillator.frequency.value = 1000 // 더 높은 음
```

또는 MP3 파일 사용:
```typescript
const audio = new Audio('/your-sound.mp3')
audio.play().catch(() => {})
```

## 🐛 문제 해결

### 알림이 오지 않는 경우

1. **Supabase Realtime 활성화 확인**
   - Supabase 대시보드 → Database → Replication
   - `notifications` 테이블이 활성화되어 있는지 확인

2. **브라우저 콘솔 확인**
   - 네트워크 연결 상태 확인
   - Realtime 연결 오류 메시지 확인

3. **RLS 정책 확인**
   - 관리자 계정의 `role` 필드가 'admin'인지 확인

### 소리가 재생되지 않는 경우

- 브라우저에서 사용자 상호작용 후에만 소리 재생 가능
- 페이지 로드 후 아무 곳이나 클릭한 후 테스트

## 📊 모니터링

### 알림 통계 조회 (SQL)

```sql
-- 오늘 생성된 알림 수
SELECT COUNT(*) 
FROM notifications 
WHERE created_at >= CURRENT_DATE;

-- 읽지 않은 관리자 알림 수
SELECT COUNT(*) 
FROM notifications 
WHERE user_id IS NULL 
  AND is_read = false;

-- 타입별 알림 통계
SELECT type, COUNT(*) as count
FROM notifications
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY type
ORDER BY count DESC;
```

## 🔐 보안 고려사항

1. **RLS 정책**: 관리자만 모든 알림 조회 가능
2. **인증 확인**: 모든 액션에서 사용자 인증 상태 확인
3. **데이터 검증**: 알림 데이터 생성 시 필수 필드 검증

## 📈 성능 최적화

1. **알림 개수 제한**: 최대 100개까지만 조회
2. **인덱스 활용**: `user_id`, `created_at`, `is_read` 인덱스 생성됨
3. **실시간 구독 정리**: 컴포넌트 언마운트 시 구독 해제

## 🎉 완료!

실시간 알림 시스템이 성공적으로 구축되었습니다!
예약이 확정되면 관리자는 즉시 알림을 받을 수 있습니다.
