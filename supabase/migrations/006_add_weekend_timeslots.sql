-- =====================================================
-- 주말 예약 시간 추가 Migration
-- =====================================================
-- 기존 상품들에 주말(토요일, 일요일) 예약 시간을 추가합니다.
-- =====================================================

-- 스터디룸 A: 주말 09:00-22:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "22:00"}
]'::jsonb
WHERE name = '스터디룸 A';

-- 회의실 B: 주말 09:00-18:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
]'::jsonb
WHERE name = '회의실 B';

-- 그룹 스터디룸 D: 이미 주말 포함되어 있음 (확인용 주석)

-- 세미나실 E: 주말 09:00-18:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
]'::jsonb
WHERE name = '세미나실 E';
-- =====================================================
-- 주말 예약 시간 추가 Migration
-- =====================================================
-- 기존 상품들에 주말(토요일, 일요일) 예약 시간을 추가합니다.
-- =====================================================

-- 스터디룸 A: 주말 09:00-22:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "22:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "22:00"}
]'::jsonb
WHERE name = '스터디룸 A';

-- 회의실 B: 주말 09:00-18:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
]'::jsonb
WHERE name = '회의실 B';

-- 그룹 스터디룸 D: 이미 주말 포함되어 있음 (확인용 주석)

-- 세미나실 E: 주말 09:00-18:00 추가
UPDATE products
SET available_time_slots = '[
  {"dayOfWeek": 0, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"},
  {"dayOfWeek": 6, "startTime": "09:00", "endTime": "18:00"}
]'::jsonb
WHERE name = '세미나실 E';

-- 1인실 C, F: 이미 주말 포함되어 있음 (확인용 주석)

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE '주말 예약 시간 추가 완료!';
  RAISE NOTICE '모든 상품이 주말에도 예약 가능합니다.';
  RAISE NOTICE '===================================';
END $$;
b
-- 1인실 C, F: 이미 주말 포함되어 있음 (확인용 주석)

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE '주말 예약 시간 추가 완료!';
  RAISE NOTICE '모든 상품이 주말에도 예약 가능합니다.';
  RAISE NOTICE '===================================';
END $$;
