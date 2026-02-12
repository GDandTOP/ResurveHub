# 관리자 Role 기반 접근 제어 구현 완료

## 구현 내용

### 1. 관리자 권한 체크 함수 추가 (`src/lib/auth.ts`)

```typescript
// 사용자 정보와 role을 함께 가져오는 함수
export async function getUserWithRole()

// 관리자 권한 확인 함수
export async function isAdmin()
```

### 2. Header에 관리자 포털 메뉴 추가 (`src/components/layout/Header.tsx`)

- **관리자 사용자**: 헤더에 "관리자 포털" 메뉴가 표시됩니다
- **일반 사용자**: "관리자 포털" 메뉴가 보이지 않습니다
- 실시간으로 사용자의 role을 체크하여 UI를 동적으로 표시

### 3. 관리자 페이지 접근 제어

#### 클라이언트 사이드 (Header)
- 관리자 role이 있는 사용자만 "관리자 포털" 메뉴 표시
- `useEffect`를 통해 실시간으로 사용자 role 확인

#### 서버 사이드 (Admin Layout)
- `src/app/admin/layout.tsx`에서 서버사이드 권한 체크
- 관리자 권한이 없는 사용자는 자동으로 홈(`/`)으로 리다이렉트

#### 미들웨어 (middleware.ts)
- 이미 구현되어 있던 미들웨어에서 URL 접근 차단
- `/admin` 경로 접근 시 자동으로 권한 확인
- 권한이 없으면 홈으로 리다이렉트

## Supabase 데이터베이스 설정

### users 테이블 구조

```sql
-- users 테이블에 role 컬럼이 있는지 확인
-- role은 'customer' 또는 'admin' 값을 가짐
```

### 관리자 권한 부여 방법

Supabase SQL Editor에서 다음 쿼리를 실행하여 특정 사용자에게 관리자 권한을 부여하세요:

```sql
-- 이메일로 사용자에게 관리자 권한 부여
UPDATE users
SET role = 'admin'
WHERE email = '관리자이메일@example.com';

-- 또는 user_id로 직접 부여
UPDATE users
SET role = 'admin'
WHERE id = 'user-uuid-here';
```

### 관리자 권한 확인

```sql
-- 관리자 권한이 있는 사용자 목록 확인
SELECT id, email, name, role, created_at
FROM users
WHERE role = 'admin';
```

### 권한 회수

```sql
-- 관리자 권한 회수
UPDATE users
SET role = 'customer'
WHERE email = '사용자이메일@example.com';
```

## 보안 체크리스트

### ✅ 구현된 보안 기능

1. **3단계 접근 제어**
   - 미들웨어: URL 접근 시 최초 차단
   - 서버 사이드: Admin Layout에서 서버 컴포넌트 레벨 차단
   - 클라이언트: UI에서 관리자 메뉴 조건부 표시

2. **데이터베이스 권한**
   - Supabase users 테이블의 role 컬럼을 통한 권한 관리
   - 서버에서만 role을 확인하여 클라이언트 조작 방지

3. **실시간 권한 체크**
   - 인증 상태 변경 시 자동으로 권한 재확인
   - 로그아웃 시 관리자 메뉴 자동 숨김

## 테스트 방법

### 1. 일반 사용자로 테스트

1. 일반 사용자로 로그인
2. 헤더에 "관리자 포털" 메뉴가 보이지 않는지 확인
3. 브라우저에서 직접 `/admin` URL 접근 시도
4. 홈(`/`)으로 리다이렉트되는지 확인

### 2. 관리자 사용자로 테스트

1. Supabase에서 관리자 권한 부여
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
2. 로그아웃 후 다시 로그인
3. 헤더에 "관리자 포털" 메뉴가 표시되는지 확인
4. "관리자 포털" 클릭 시 `/admin` 페이지 접근 가능한지 확인
5. 관리자 대시보드의 모든 기능이 정상 작동하는지 확인

### 3. 권한 변경 테스트

1. 관리자로 로그인된 상태에서
2. Supabase에서 해당 사용자의 role을 'customer'로 변경
3. 페이지 새로고침
4. 자동으로 홈으로 리다이렉트되는지 확인
5. 헤더에서 "관리자 포털" 메뉴가 사라지는지 확인

## 주요 파일 변경 내역

```
수정된 파일:
- src/lib/auth.ts: 관리자 권한 체크 함수 추가
- src/components/layout/Header.tsx: 관리자 포털 메뉴 추가
- src/app/admin/layout.tsx: 서버사이드 권한 체크 추가

기존 파일 (이미 구현됨):
- middleware.ts: URL 접근 제어
- src/lib/supabase/middleware.ts: Supabase 미들웨어 권한 체크
- src/types/supabase.ts: role 타입 정의 ('customer' | 'admin')
```

## 추가 개선 사항 (선택사항)

### 1. Row Level Security (RLS)

Supabase에서 RLS 정책을 추가하여 데이터베이스 레벨에서도 보안을 강화할 수 있습니다:

```sql
-- 관리자만 모든 사용자 정보 조회 가능
CREATE POLICY "관리자는 모든 사용자 조회 가능"
ON users FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- 관리자만 상품 수정 가능
CREATE POLICY "관리자만 상품 수정 가능"
ON products FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
```

### 2. 감사 로그 (Audit Log)

관리자 활동을 추적하기 위한 로그 테이블 생성:

```sql
CREATE TABLE admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) NOT NULL,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. 다중 권한 레벨

더 세분화된 권한이 필요한 경우:

```sql
-- role을 enum으로 확장
ALTER TABLE users 
ALTER COLUMN role TYPE TEXT;

-- 가능한 값: 'customer', 'admin', 'super_admin', 'moderator' 등
```

## 문의 및 지원

권한 관련 문제가 발생하면:
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. Supabase 대시보드에서 users 테이블의 role 확인
3. 로그아웃 후 다시 로그인하여 세션 갱신
