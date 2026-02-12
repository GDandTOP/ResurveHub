# 사용자 프로필 외래 키 오류 해결 가이드

## 문제 상황

예약 생성 시 다음과 같은 오류가 발생합니다:

```
insert or update on table "reservations" violates foreign key constraint "reservations_user_id_fkey"
```

## 원인

회원가입 시 `auth.users` 테이블에는 사용자가 생성되지만, `public.users` 테이블에는 자동으로 프로필이 생성되지 않아서 외래 키 제약 조건을 위반하는 문제가 발생합니다.

## 해결 방법

### 1단계: 자동 프로필 생성 트리거 설정

Supabase Dashboard에서 다음 작업을 수행합니다:

1. Supabase Dashboard → SQL Editor로 이동
2. `supabase/migrations/004_auto_create_user_profile.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행 (Run 버튼 클릭)

이 트리거는 앞으로 새로 가입하는 사용자의 프로필을 자동으로 생성합니다.

### 2단계: 기존 사용자 동기화

기존에 가입한 사용자들의 프로필을 생성합니다:

1. Supabase Dashboard → SQL Editor로 이동
2. `supabase/migrations/005_sync_existing_users.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행 (Run 버튼 클릭)

### 3단계: 확인

다음 쿼리를 실행하여 모든 사용자가 동기화되었는지 확인합니다:

```sql
-- auth.users와 public.users의 사용자 수 비교
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count;
```

두 개의 숫자가 같으면 모든 사용자가 정상적으로 동기화된 것입니다.

## 테스트

1. 기존 계정으로 로그인
2. 상품 상세 페이지에서 예약 진행
3. 정상적으로 예약이 완료되는지 확인

## 추가 개선 사항 (선택)

회원가입 시 사용자 이름을 입력받도록 수정하려면:

### 1. 회원가입 폼 수정

`src/app/signup/page.tsx`에 이름 입력 필드 추가:

```tsx
<input
  type="text"
  name="name"
  placeholder="이름"
  required
/>
```

### 2. Server Action 수정

`src/app/actions/auth.ts`의 `signup` 함수 수정:

```typescript
export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const name = formData.get('name') as string

  // ... 유효성 검사 ...

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        name: name  // 메타데이터에 이름 추가
      }
    }
  })

  // ... 나머지 코드 ...
}
```

이렇게 하면 트리거가 메타데이터의 이름을 사용하여 프로필을 생성합니다.

## 문제가 계속될 경우

1. Supabase Dashboard → Table Editor → users 테이블 확인
2. 현재 로그인한 사용자의 ID가 users 테이블에 존재하는지 확인
3. 존재하지 않는다면 수동으로 삽입:

```sql
INSERT INTO public.users (id, email, name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)), 'customer'
FROM auth.users
WHERE id = '현재_사용자_ID';
```
