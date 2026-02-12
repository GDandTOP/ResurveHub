# 🔧 예약 시 외래 키 오류 해결 완료

## 📋 문제 요약

예약 생성 시 다음 오류가 발생했습니다:

```
insert or update on table "reservations" violates foreign key constraint "reservations_user_id_fkey"
```

**원인**: 회원가입 시 `auth.users`에는 사용자가 생성되지만, `public.users` 테이블에는 프로필이 자동으로 생성되지 않아 외래 키 제약 조건을 위반했습니다.

## ✅ 적용된 해결 방법

### 1. 자동 프로필 생성 트리거 추가

`supabase/migrations/004_auto_create_user_profile.sql` 파일이 생성되었습니다.

이 마이그레이션은:
- 회원가입 시 자동으로 `public.users` 테이블에 프로필 생성
- 사용자가 입력한 이름을 메타데이터에서 가져와 저장
- 이름이 없으면 이메일 앞부분을 기본 이름으로 사용

### 2. 기존 사용자 동기화 스크립트 추가

`supabase/migrations/005_sync_existing_users.sql` 파일이 생성되었습니다.

이 마이그레이션은:
- 이미 가입한 사용자들을 `public.users` 테이블에 동기화
- 중복 삽입 방지

### 3. 회원가입 폼에 이름 필드 추가

`src/components/auth/SignupForm.tsx`가 수정되었습니다:
- 이름 입력 필드 추가
- User 아이콘과 함께 직관적인 UI 제공

### 4. Server Action 수정

`src/app/actions/auth.ts`가 수정되었습니다:
- 이름을 받아서 `raw_user_meta_data`에 저장
- 트리거가 이 메타데이터를 사용하여 프로필 생성

## 🚀 적용 방법

### 1단계: Supabase 마이그레이션 실행

Supabase Dashboard에서 다음 작업을 수행하세요:

#### A. 트리거 설정 (004_auto_create_user_profile.sql)

1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/004_auto_create_user_profile.sql` 내용 복사
3. SQL Editor에 붙여넣고 실행 (Run)

#### B. 기존 사용자 동기화 (005_sync_existing_users.sql)

1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/005_sync_existing_users.sql` 내용 복사
3. SQL Editor에 붙여넣고 실행 (Run)

### 2단계: 동기화 확인

다음 쿼리를 실행하여 확인:

```sql
-- auth.users와 public.users의 사용자 수 비교
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count;

-- 모든 사용자 확인
SELECT u.id, u.email, u.name, u.role, u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
```

### 3단계: 테스트

1. **기존 사용자 테스트**
   - 기존 계정으로 로그인
   - 상품 예약 진행
   - 정상적으로 예약이 완료되는지 확인

2. **신규 사용자 테스트**
   - 새로운 계정으로 회원가입 (이름 입력)
   - 이메일 인증 완료
   - 로그인 후 예약 진행
   - 정상적으로 예약이 완료되는지 확인

## 📝 변경된 파일

### 신규 파일
- ✅ `supabase/migrations/004_auto_create_user_profile.sql`
- ✅ `supabase/migrations/005_sync_existing_users.sql`
- ✅ `USER_PROFILE_FIX_GUIDE.md`
- ✅ `RESERVATION_ERROR_FIX.md` (이 파일)

### 수정된 파일
- ✅ `src/components/auth/SignupForm.tsx` - 이름 필드 추가
- ✅ `src/app/actions/auth.ts` - 이름을 메타데이터에 저장

## 🎯 기대 효과

1. **자동화**: 앞으로 회원가입하는 모든 사용자의 프로필이 자동으로 생성됩니다
2. **데이터 무결성**: 외래 키 제약 조건이 항상 만족됩니다
3. **더 나은 UX**: 사용자가 이름을 입력할 수 있어 개인화된 경험 제공
4. **안정성**: 예약 생성 시 오류가 발생하지 않습니다

## ⚠️ 주의사항

- **반드시 순서대로 실행**: 004번 → 005번 순서로 마이그레이션 실행
- **기존 예약 확인**: 마이그레이션 전에 기존 예약이 정상적으로 동작하는지 확인
- **백업**: 중요한 데이터가 있다면 마이그레이션 전 백업 권장

## 🔍 문제가 계속될 경우

### 현재 사용자 확인

```sql
-- 현재 로그인한 사용자의 정보 확인
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  pu.id as public_id,
  pu.name,
  pu.created_at as public_created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = '여기에_이메일_입력@example.com';
```

### 수동 프로필 생성

만약 특정 사용자의 프로필이 없다면:

```sql
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'customer'
FROM auth.users
WHERE id = '사용자_ID'
ON CONFLICT (id) DO NOTHING;
```

## 📞 추가 도움

문제가 계속된다면:
1. Supabase Dashboard의 Table Editor에서 `users` 테이블 확인
2. `auth.users`와 `public.users`의 데이터 일치 여부 확인
3. 트리거가 정상적으로 생성되었는지 확인:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
