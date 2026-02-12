-- =====================================================
-- 기존 사용자 동기화 스크립트
-- =====================================================
-- 이미 가입한 사용자들을 public.users 테이블에 동기화합니다.
-- =====================================================

-- 기존 auth.users의 사용자를 public.users에 삽입
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  'customer' as role,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL  -- public.users에 아직 없는 사용자만 삽입
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
DECLARE
  sync_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sync_count
  FROM auth.users au
  INNER JOIN public.users pu ON au.id = pu.id;
  
  RAISE NOTICE '===================================';
  RAISE NOTICE '기존 사용자 동기화 완료!';
  RAISE NOTICE '총 % 명의 사용자가 동기화되었습니다.', sync_count;
  RAISE NOTICE '===================================';
END $$;
