-- =====================================================
-- Row Level Security (RLS) 정책 설정 (완전 수정판)
-- =====================================================
-- 무한 재귀 문제를 해결한 버전
-- =====================================================

-- =====================================================
-- 1. 기존 정책 모두 제거
-- =====================================================

-- Users 테이블 정책 제거
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Products 테이블 정책 제거
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Reservations 테이블 정책 제거
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can create own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can manage all reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can update all reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can delete all reservations" ON reservations;

-- Payments 테이블 정책 제거
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;
DROP POLICY IF EXISTS "Admins can delete all payments" ON payments;

-- =====================================================
-- 2. Helper Function 생성 (무한 재귀 방지)
-- =====================================================

-- 현재 사용자가 관리자인지 확인하는 함수
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- =====================================================
-- 3. RLS 활성화
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Users 테이블 정책
-- =====================================================

-- 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 새 사용자 생성 시 자동으로 프로필 생성 가능
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 5. Products 테이블 정책
-- =====================================================

-- 모든 사용자(비로그인 포함)가 상품 조회 가능
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

-- 관리자는 상품 생성 가능
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 관리자는 상품 수정 가능
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  USING (public.is_admin());

-- 관리자는 상품 삭제 가능
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- 6. Reservations 테이블 정책
-- =====================================================

-- 사용자는 자신의 예약만 조회 가능
CREATE POLICY "Users can view own reservations"
  ON reservations
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 사용자는 자신의 예약만 생성 가능
CREATE POLICY "Users can create own reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 예약만 수정 가능
CREATE POLICY "Users can update own reservations"
  ON reservations
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- 관리자는 예약 삭제 가능
CREATE POLICY "Admins can delete reservations"
  ON reservations
  FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- 7. Payments 테이블 정책
-- =====================================================

-- 사용자는 자신의 결제만 조회 가능
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 사용자는 자신의 결제만 생성 가능
CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자는 결제 수정 가능 (환불 등)
CREATE POLICY "Admins can update payments"
  ON payments
  FOR UPDATE
  USING (public.is_admin());

-- 관리자는 결제 삭제 가능
CREATE POLICY "Admins can delete payments"
  ON payments
  FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE 'RLS 정책 설정 완료!';
  RAISE NOTICE 'is_admin() 함수 생성 완료';
  RAISE NOTICE '다음 단계: 003_seed_data.sql 실행';
  RAISE NOTICE '===================================';
END $$;
