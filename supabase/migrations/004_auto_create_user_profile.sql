-- =====================================================
-- 자동 사용자 프로필 생성 트리거
-- =====================================================
-- 이 스크립트는 auth.users에 새 사용자가 생성될 때
-- 자동으로 public.users 테이블에 프로필을 생성합니다.
-- =====================================================

-- 트리거 함수: auth.users에 사용자가 생성되면 public.users에 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있다면 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 트리거 생성: auth.users에 INSERT 발생 시 실행
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 완료 메시지
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE '사용자 프로필 자동 생성 트리거 설정 완료!';
  RAISE NOTICE '이제 회원가입 시 users 테이블에 자동으로 프로필이 생성됩니다.';
  RAISE NOTICE '===================================';
END $$;
