-- =====================================================
-- 테스트 데이터 삽입 (Seed Data)
-- =====================================================
-- 이 스크립트는 선택사항입니다.
-- 개발 환경에서 테스트용 데이터가 필요한 경우 실행하세요.
-- =====================================================

-- =====================================================
-- 1. 테스트 상품 데이터
-- =====================================================

INSERT INTO products (name, description, category, price_per_hour, capacity, location, amenities, available_time_slots, status)
VALUES
  (
    '스터디룸 A',
    '조용한 학습 공간으로 4인까지 이용 가능합니다. 개인 학습이나 소규모 스터디에 적합합니다.',
    '스터디룸',
    10000,
    4,
    '서울시 강남구 테헤란로 123',
    ARRAY['화이트보드', 'WiFi', '콘센트', '에어컨', '책상 4개'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 6, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 0, "startTime": "10:00", "endTime": "20:00"}
    ]'::jsonb,
    'active'
  ),
  (
    '회의실 B',
    '중·대규모 회의와 세미나에 최적화된 공간입니다. 빔프로젝터와 화상회의 시스템이 갖추어져 있습니다.',
    '회의실',
    20000,
    10,
    '서울시 서초구 서초대로 456',
    ARRAY['빔프로젝터', 'WiFi', '화이트보드', '화상회의 시스템', '의자 10개', '테이블'],
    '[
      {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
    ]'::jsonb,
    'active'
  ),
  (
    '1인실 C',
    '집중이 필요한 개인 작업에 최적화된 1인 전용 공간입니다.',
    '1인실',
    5000,
    1,
    '서울시 종로구 종로 789',
    ARRAY['WiFi', '콘센트', '책상', '의자', '스탠드 조명', '방음'],
    '[
      {"dayOfWeek": 1, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 2, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 3, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 4, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 5, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 6, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 0, "startTime": "09:00", "endTime": "22:00"}
    ]'::jsonb,
    'active'
  ),
  (
    '그룹 스터디룸 D',
    '6~8인 그룹 스터디에 적합한 넓은 공간입니다.',
    '스터디룸',
    15000,
    8,
    '서울시 마포구 마포대로 321',
    ARRAY['화이트보드 2개', 'WiFi', '콘센트', '에어컨', '책상 8개', '의자 8개'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 6, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 0, "startTime": "10:00", "endTime": "20:00"}
    ]'::jsonb,
    'active'
  ),
  (
    '세미나실 E',
    '최대 20명까지 수용 가능한 대형 세미나실입니다. 강의나 워크숍에 적합합니다.',
    '세미나실',
    40000,
    20,
    '서울시 영등포구 여의대로 654',
    ARRAY['빔프로젝터', 'WiFi', '화이트보드', '마이크', '스피커', '의자 20개', '강의대'],
    '[
      {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
    ]'::jsonb,
    'active'
  ),
  (
    '1인실 F (프리미엄)',
    '고급 인테리어와 편안한 분위기의 프리미엄 1인실입니다.',
    '1인실',
    8000,
    1,
    '서울시 강남구 강남대로 987',
    ARRAY['WiFi', '콘센트', '프리미엄 책상', '인체공학 의자', '무드 조명', '방음', '커피머신'],
    '[
      {"dayOfWeek": 1, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 2, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 3, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 4, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 5, "startTime": "08:00", "endTime": "23:00"},
      {"dayOfWeek": 6, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 0, "startTime": "09:00", "endTime": "22:00"}
    ]'::jsonb,
    'active'
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  RAISE NOTICE '===================================';
  RAISE NOTICE '테스트 데이터 삽입 완료!';
  RAISE NOTICE '총 % 개의 상품이 등록되었습니다.', product_count;
  RAISE NOTICE '===================================';
END $$;

-- =====================================================
-- 참고사항
-- =====================================================
-- 
-- 사용자(Users) 데이터는 회원가입을 통해 자동으로 생성됩니다.
-- 관리자 계정이 필요한 경우:
--   1. 일반 회원가입 후
--   2. Supabase Dashboard의 Table Editor에서 해당 사용자의 role을 'admin'으로 변경
-- 
-- 예약(Reservations)과 결제(Payments) 데이터는 
-- 실제 애플리케이션에서 생성됩니다.
-- 
-- =====================================================
