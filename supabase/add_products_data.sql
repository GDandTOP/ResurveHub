-- =====================================================
-- 추가 상품 데이터 (10개 공간)
-- =====================================================
-- Supabase Dashboard의 SQL Editor에서 실행하세요
-- =====================================================

INSERT INTO products (name, description, category, price_per_hour, capacity, location, amenities, available_time_slots, images, status)
VALUES
  (
    '스터디룸 A',
    '조용하고 쾌적한 환경의 스터디룸입니다. 최대 4명까지 이용 가능하며, 화이트보드와 Wi-Fi가 제공됩니다.',
    '스터디룸',
    10000,
    4,
    '서울특별시 강남구 테헤란로 123',
    ARRAY['화이트보드', 'Wi-Fi', '콘센트', '에어컨'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "22:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "22:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '회의실 B',
    '프로젝터와 대형 스크린이 구비된 회의실입니다. 프레젠테이션이나 세미나에 최적화되어 있습니다.',
    '회의실',
    25000,
    10,
    '서울특별시 강남구 역삼로 456',
    ARRAY['프로젝터', '스크린', '화이트보드', 'Wi-Fi', '음향시설'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "20:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "20:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "20:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "20:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "20:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '스터디룸 C',
    '소규모 그룹 스터디에 적합한 공간입니다. 편안한 의자와 개인 책상이 제공됩니다.',
    '스터디룸',
    8000,
    3,
    '서울특별시 서초구 서초대로 789',
    ARRAY['Wi-Fi', '콘센트', '에어컨', '개인 책상'],
    '[
      {"dayOfWeek": 0, "startTime": "10:00", "endTime": "22:00"},
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 6, "startTime": "10:00", "endTime": "22:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '세미나실 D',
    '대규모 행사와 세미나를 위한 넓은 공간입니다. 최신 음향 및 영상 장비가 완비되어 있습니다.',
    '세미나실',
    50000,
    50,
    '서울특별시 강남구 논현로 321',
    ARRAY['프로젝터', '스크린', '무선 마이크', '음향시설', 'Wi-Fi', '테이블 & 의자'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "18:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "18:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '프라이빗 스터디룸 E',
    '1인 전용 개인 스터디룸입니다. 집중력 향상을 위한 조용한 환경이 제공됩니다.',
    '스터디룸',
    5000,
    1,
    '서울특별시 마포구 월드컵북로 654',
    ARRAY['Wi-Fi', '콘센트', '에어컨', '개인 책상', '스탠드'],
    '[
      {"dayOfWeek": 0, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 1, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 2, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 3, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 4, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 5, "startTime": "00:00", "endTime": "23:59"},
      {"dayOfWeek": 6, "startTime": "00:00", "endTime": "23:59"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '회의실 F',
    '중소규모 회의와 팀 미팅에 적합한 공간입니다. 편안한 분위기에서 효율적인 회의가 가능합니다.',
    '회의실',
    15000,
    6,
    '서울특별시 성동구 왕십리로 987',
    ARRAY['화이트보드', 'Wi-Fi', '콘센트', '에어컨', '커피머신'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "21:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "21:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "21:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "21:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "21:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '코워킹 스페이스 G',
    '자유로운 분위기의 오픈 코워킹 스페이스입니다. 개인 작업이나 소규모 협업에 적합합니다.',
    '코워킹 스페이스',
    7000,
    8,
    '서울특별시 용산구 이태원로 234',
    ARRAY['Wi-Fi', '콘센트', '개인 책상', '공용 냉장고', '무료 커피', '프린터'],
    '[
      {"dayOfWeek": 1, "startTime": "08:00", "endTime": "22:00"},
      {"dayOfWeek": 2, "startTime": "08:00", "endTime": "22:00"},
      {"dayOfWeek": 3, "startTime": "08:00", "endTime": "22:00"},
      {"dayOfWeek": 4, "startTime": "08:00", "endTime": "22:00"},
      {"dayOfWeek": 5, "startTime": "08:00", "endTime": "22:00"},
      {"dayOfWeek": 6, "startTime": "10:00", "endTime": "20:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '프레젠테이션 룸 H',
    '고급 프레젠테이션 장비를 갖춘 전문 회의실입니다. 중요한 발표나 투자 미팅에 최적화되어 있습니다.',
    '회의실',
    35000,
    12,
    '서울특별시 중구 을지로 567',
    ARRAY['4K 프로젝터', '전동 스크린', '무선 마이크 2개', '화상회의 장비', 'Wi-Fi', '화이트보드'],
    '[
      {"dayOfWeek": 1, "startTime": "09:00", "endTime": "19:00"},
      {"dayOfWeek": 2, "startTime": "09:00", "endTime": "19:00"},
      {"dayOfWeek": 3, "startTime": "09:00", "endTime": "19:00"},
      {"dayOfWeek": 4, "startTime": "09:00", "endTime": "19:00"},
      {"dayOfWeek": 5, "startTime": "09:00", "endTime": "19:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560439514-e960a3ef5019?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '독서실 타입 스터디룸 I',
    '개인 칸막이가 있는 독서실 스타일의 조용한 스터디 공간입니다.',
    '스터디룸',
    6000,
    6,
    '서울특별시 송파구 올림픽로 890',
    ARRAY['Wi-Fi', '콘센트', '개인 칸막이', '스탠드', '에어컨', '사물함'],
    '[
      {"dayOfWeek": 0, "startTime": "09:00", "endTime": "23:00"},
      {"dayOfWeek": 1, "startTime": "08:00", "endTime": "24:00"},
      {"dayOfWeek": 2, "startTime": "08:00", "endTime": "24:00"},
      {"dayOfWeek": 3, "startTime": "08:00", "endTime": "24:00"},
      {"dayOfWeek": 4, "startTime": "08:00", "endTime": "24:00"},
      {"dayOfWeek": 5, "startTime": "08:00", "endTime": "24:00"},
      {"dayOfWeek": 6, "startTime": "09:00", "endTime": "23:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop'],
    'active'
  ),
  (
    '루프탑 회의실 J',
    '탁 트인 전망이 있는 루프탑 회의 공간입니다. 창의적인 미팅과 브레인스토밍에 최적입니다.',
    '회의실',
    30000,
    8,
    '서울특별시 강남구 테헤란로 345',
    ARRAY['Wi-Fi', '야외 테이블', '화이트보드', '음향시설', '냉난방', '미니바'],
    '[
      {"dayOfWeek": 1, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 2, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 3, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 4, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 5, "startTime": "10:00", "endTime": "20:00"},
      {"dayOfWeek": 6, "startTime": "11:00", "endTime": "19:00"}
    ]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'],
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
  RAISE NOTICE '✅ 데이터 추가 완료!';
  RAISE NOTICE '총 % 개의 공간이 등록되었습니다.', product_count;
  RAISE NOTICE '===================================';
END $$;
