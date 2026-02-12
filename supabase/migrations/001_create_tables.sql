-- =====================================================
-- 예약 플랫폼 데이터베이스 스키마
-- =====================================================
-- 이 스크립트를 Supabase Dashboard의 SQL Editor에서 실행하세요.
-- Table Editor → SQL Editor → "New Query" → 복사 & 실행
-- =====================================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Users 테이블
-- =====================================================
-- Supabase Auth와 연동되는 사용자 프로필 테이블

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

COMMENT ON TABLE users IS '사용자 프로필 정보';
COMMENT ON COLUMN users.id IS 'Supabase Auth User ID';
COMMENT ON COLUMN users.role IS '사용자 역할: customer(고객), admin(관리자)';

-- =====================================================
-- 2. Products 테이블
-- =====================================================
-- 예약 가능한 상품(공간) 정보

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL CHECK (price_per_hour >= 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  location TEXT,
  amenities TEXT[] DEFAULT '{}',
  available_time_slots JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products 인덱스
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_per_hour);

COMMENT ON TABLE products IS '예약 가능한 상품(공간) 정보';
COMMENT ON COLUMN products.available_time_slots IS '예약 가능 시간대 (JSON 배열)';
COMMENT ON COLUMN products.status IS '상품 상태: active(활성), inactive(비활성)';

-- =====================================================
-- 3. Reservations 테이블
-- =====================================================
-- 예약 정보

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_time_order CHECK (start_time < end_time)
);

-- Reservations 인덱스
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_product_id ON reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_product_date ON reservations(product_id, reservation_date);

COMMENT ON TABLE reservations IS '예약 정보';
COMMENT ON COLUMN reservations.status IS '예약 상태: pending(대기), confirmed(확정), cancelled(취소), completed(완료)';

-- =====================================================
-- 4. Payments 테이블
-- =====================================================
-- 결제 정보

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'transfer', 'kakao', 'toss')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments 인덱스
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

COMMENT ON TABLE payments IS '결제 정보';
COMMENT ON COLUMN payments.payment_method IS '결제 수단: card(카드), transfer(계좌이체), kakao(카카오페이), toss(토스페이)';
COMMENT ON COLUMN payments.payment_status IS '결제 상태: pending(대기), completed(완료), failed(실패), refunded(환불)';

-- =====================================================
-- 5. 트리거: updated_at 자동 업데이트
-- =====================================================

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE '테이블 생성 완료!';
  RAISE NOTICE '다음 단계: 002_row_level_security.sql 실행';
  RAISE NOTICE '===================================';
END $$;
