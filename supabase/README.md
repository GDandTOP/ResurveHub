# Supabase 설정 가이드

이 폴더에는 Supabase 데이터베이스를 설정하기 위한 SQL 마이그레이션 파일들이 포함되어 있습니다.

## 📋 실행 순서

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - 프로젝트 이름
   - 데이터베이스 비밀번호 (안전하게 보관!)
   - 리전: `Northeast Asia (Seoul)` 선택
4. 프로젝트 생성 완료 (약 2분 소요)

### 2. API 키 확인 및 설정

1. Supabase Dashboard에서 `Settings` → `API` 이동
2. 다음 정보 복사:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (절대 노출 금지!)

3. 프로젝트 루트의 `.env.local` 파일 수정:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. SQL 마이그레이션 실행

Supabase Dashboard의 `SQL Editor`에서 다음 순서대로 실행:

#### Step 1: 테이블 생성
```bash
# migrations/001_create_tables.sql 파일 내용을 복사하여 실행
```
- Users, Products, Reservations, Payments 테이블 생성
- 인덱스 및 트리거 설정

#### Step 2: Row Level Security (RLS) 설정
```bash
# migrations/002_row_level_security.sql 파일 내용을 복사하여 실행
```
- 각 테이블에 RLS 활성화
- 사용자/관리자 권한별 정책 설정

#### Step 3: 테스트 데이터 삽입 (선택사항)
```bash
# migrations/003_seed_data.sql 파일 내용을 복사하여 실행
```
- 테스트용 상품 데이터 6개 삽입
- 개발 환경에서만 실행 권장

### 4. 관리자 계정 생성

1. 애플리케이션에서 일반 회원가입 진행
2. Supabase Dashboard → `Table Editor` → `users` 테이블로 이동
3. 해당 사용자의 `role` 컬럼을 `admin`으로 변경
4. 저장 후 로그아웃/로그인

## 🔧 TypeScript 타입 자동 생성 (선택사항)

Supabase CLI를 사용하여 데이터베이스 스키마에서 TypeScript 타입을 자동 생성할 수 있습니다:

```bash
# Supabase CLI 설치
npm install -D supabase

# Supabase 로그인
npx supabase login

# 프로젝트 연결 (Project Settings → General → Reference ID 확인)
npx supabase link --project-ref your-project-ref

# TypeScript 타입 생성
npx supabase gen types typescript --linked > src/types/supabase.ts
```

현재는 수동으로 작성된 타입 파일(`src/types/supabase.ts`)을 사용하고 있습니다.
데이터베이스 스키마가 변경될 때마다 위 명령어로 타입을 재생성할 수 있습니다.

## 📁 파일 구조

```
supabase/
├── README.md                          # 이 파일
└── migrations/
    ├── 001_create_tables.sql         # 테이블 생성
    ├── 002_row_level_security.sql    # RLS 정책 설정
    └── 003_seed_data.sql             # 테스트 데이터 (선택)
```

## 🔐 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `service_role key`는 절대 클라이언트 코드에서 사용하지 않기
- [ ] RLS 정책이 모든 테이블에 활성화되어 있는지 확인
- [ ] 관리자 권한이 필요한 작업은 서버 사이드에서만 처리
- [ ] 프로덕션 배포 전 데이터베이스 비밀번호 변경

## 🚀 다음 단계

1. **Storage 설정** (상품 이미지 업로드용)
   - Supabase Dashboard → Storage → "New Bucket" 클릭
   - Bucket 이름: `product-images`
   - Public 활성화

2. **이메일 설정** (선택사항)
   - Authentication → Email Templates에서 이메일 템플릿 커스터마이징
   - SMTP 설정 (프로덕션 환경)

3. **Realtime 설정** (선택사항)
   - 예약 상태 실시간 업데이트가 필요한 경우
   - Database → Replication → Enable for specific tables

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## ❓ 문제 해결

### 에러: "relation does not exist"
- SQL 실행 순서를 확인하세요 (001 → 002 → 003)
- 이전 실행에서 에러가 발생했다면 테이블을 삭제하고 다시 실행

### 에러: "insufficient privileges"
- 올바른 데이터베이스에 연결되어 있는지 확인
- service_role key를 사용하고 있는지 확인

### RLS 정책 관련 에러
- Supabase Dashboard → Authentication → Policies에서 정책 확인
- 정책이 올바르게 적용되었는지 테스트

## 💡 팁

- SQL Editor에서 쿼리 실행 전 항상 백업 권장
- 개발 환경과 프로덕션 환경은 별도의 Supabase 프로젝트 사용
- 정기적으로 데이터베이스 백업 설정 (Settings → Database → Backups)
