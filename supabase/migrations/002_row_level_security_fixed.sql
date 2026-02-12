-- =====================================================
-- Row Level Security (RLS) 정책 설정 (수정판)
-- =====================================================
-- 이 스크립트를 Supabase Dashboard의 SQL Editor에서 실행하세요.
-- 001_create_tables.sql을 먼저 실행한 후 이 파일을 실행하세요.
-- =====================================================

-- =====================================================
-- 1. RLS 활성화
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Users 테이블 정책
-- =====================================================

-- 사용자는 자신의 데이터만 조회 가능
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 데이터만 수정 가능
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 새 사용자 생성 시 자동으로 프로필 생성 가능
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. Products 테이블 정책
-- =====================================================

-- 모든 사용자(비로그인 포함)가 활성 상품 조회 가능
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (true);

-- 관리자는 모든 상품 생성 가능
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 상품 수정 가능
DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 상품 삭제 가능
DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- 4. Reservations 테이블 정책
-- =====================================================

-- 사용자는 자신의 예약만 조회 가능
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;
CREATE POLICY "Users can view own reservations"
  ON reservations
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 예약만 생성 가능
DROP POLICY IF EXISTS "Users can create own reservations" ON reservations;
CREATE POLICY "Users can create own reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 예약만 수정 가능 (취소 등)
DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;
CREATE POLICY "Users can update own reservations"
  ON reservations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 관리자는 모든 예약 조회 가능
DROP POLICY IF EXISTS "Admins can view all reservations" ON reservations;
CREATE POLICY "Admins can view all reservations"
  ON reservations
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 예약 수정 가능
DROP POLICY IF EXISTS "Admins can update all reservations" ON reservations;
CREATE POLICY "Admins can update all reservations"
  ON reservations
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 예약 삭제 가능
DROP POLICY IF EXISTS "Admins can delete all reservations" ON reservations;
CREATE POLICY "Admins can delete all reservations"
  ON reservations
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- 5. Payments 테이블 정책
-- =====================================================

-- 사용자는 자신의 결제만 조회 가능
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 결제만 생성 가능
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 결제 조회 가능
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments"
  ON payments
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 결제 수정 가능 (환불 등)
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;
CREATE POLICY "Admins can update all payments"
  ON payments
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 관리자는 모든 결제 삭제 가능
DROP POLICY IF EXISTS "Admins can delete all payments" ON payments;
CREATE POLICY "Admins can delete all payments"
  ON payments
  FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE 'RLS 정책 설정 완료!';
  RAISE NOTICE '다음 단계: 003_seed_data.sql 실행 (선택사항)';
  RAISE NOTICE '===================================';
END $$;
