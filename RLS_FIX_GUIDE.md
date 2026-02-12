# 🔧 RLS 정책 오류 수정 가이드

## 문제
`infinite recursion detected in policy for relation "users"` 오류 발생

## 해결 방법

### 1단계: Supabase Dashboard 접속

1. [supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2단계: SQL 실행

1. **New Query** 버튼 클릭
2. 아래 파일의 전체 내용을 복사:
   ```
   supabase/migrations/002_row_level_security_apply_this.sql
   ```
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl/Cmd + Enter)

### 3단계: 실행 확인

성공 메시지가 표시되어야 합니다:
```
===================================
RLS 정책 설정 완료!
is_admin() 함수 생성 완료
다음 단계: 003_seed_data.sql 실행
===================================
```

### 4단계: 개발 서버 확인

1. 브라우저에서 `http://localhost:3000/products` 새로고침
2. 제품 목록이 정상적으로 표시되는지 확인

## 주요 변경 사항

### 무한 재귀 문제 해결

**이전 코드 (문제):**
```sql
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users  -- ❌ users 테이블 조회 시 다시 RLS 체크 → 무한 재귀
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
```

**수정 코드 (해결):**
```sql
-- Security Definer 함수 생성 (RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  -- ✅ 함수 소유자 권한으로 실행 (RLS 우회)
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 함수를 사용한 정책
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  USING (public.is_admin());  -- ✅ 함수 호출로 재귀 방지
```

### Products 테이블 정책

```sql
-- ✅ 모든 사용자가 제품 조회 가능 (로그인 불필요)
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

-- ✅ 관리자만 제품 생성/수정/삭제 가능
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  WITH CHECK (public.is_admin());
```

## 테스트 데이터 추가 (선택사항)

RLS 정책 적용 후 테스트 데이터가 필요하면:

1. SQL Editor에서 새 쿼리 생성
2. `supabase/migrations/003_seed_data.sql` 파일 내용 복사
3. Run 버튼 클릭

## 문제 해결

### "function public.is_admin() does not exist" 오류
- `002_row_level_security_apply_this.sql` 전체를 다시 실행하세요

### 여전히 오류 발생
1. Supabase Dashboard → **Table Editor** → **policies** 탭
2. 각 테이블의 정책이 올바르게 생성되었는지 확인
3. 정책이 중복되어 있다면 기존 정책 삭제 후 다시 실행

### 제품이 표시되지 않음
1. Supabase Dashboard → **Table Editor** → **products** 테이블
2. 데이터가 있는지 확인
3. 없다면 `003_seed_data.sql` 실행

## 다음 단계

✅ RLS 정책 수정 완료
✅ Products 페이지 정상 작동 확인

이제 다음 작업을 진행할 수 있습니다:
- 예약 기능 구현
- 결제 시스템 연동
- 관리자 페이지 개발
