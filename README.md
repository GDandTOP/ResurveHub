# 🏢 ReserveHub - 예약 플랫폼

스터디룸, 회의실, 세미나실을 간편하게 예약하고 관리할 수 있는 풀스택 웹 애플리케이션입니다.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ 주요 기능

### 👤 사용자 기능
- 🔐 **회원가입 및 로그인** - Supabase Auth 기반 안전한 인증
- 🔍 **상품 검색 및 필터링** - 카테고리별로 공간을 쉽게 찾을 수 있습니다
- 📅 **실시간 예약** - 캘린더와 시간대 선택으로 간편한 예약
- 💳 **결제 시스템** - PortOne 통합으로 안전한 온라인 결제
- 🔔 **실시간 알림** - 예약 상태 변경 시 즉시 알림
- 📱 **마이페이지** - 예약 내역 조회 및 취소

### 👨‍💼 관리자 기능
- 📊 **대시보드** - 매출, 예약 통계 실시간 모니터링
- 🏪 **상품 관리** - 공간 등록, 수정, 삭제 및 이미지 업로드
- 📋 **예약 관리** - 예약 현황 확인 및 상태 변경
- 💰 **결제 관리** - 결제 내역 조회 및 환불 처리
- 📈 **분석 리포트** - 일별/주별 매출 및 예약 분석

### 🎨 UI/UX
- 📱 **완전한 반응형 디자인** - 모바일, 태블릿, 데스크톱 모두 지원
- 🎨 **현대적인 인터페이스** - shadcn/ui 기반의 세련된 디자인
- ⚡ **빠른 성능** - Next.js 16 App Router와 Server Components
- 🎠 **자동 슬라이드 캐러셀** - 인기 공간을 무한 회전으로 소개

## 🎯 핵심 기능 상세

### 인증 시스템
- Supabase Auth 기반 회원가입/로그인
- 소셜 로그인 지원 가능
- Row Level Security (RLS)를 통한 데이터 보안

### 예약 시스템
- 실시간 예약 가능 시간 확인
- 캘린더 UI로 직관적인 날짜/시간 선택
- 중복 예약 방지 로직
- 예약 상태 관리 (대기/확정/취소/완료)

### 결제 시스템
- PortOne 통합으로 다양한 결제 수단 지원
- 결제 검증 및 webhook 처리
- 환불 처리 기능
- 결제 내역 조회

### 관리자 시스템
- 실시간 대시보드 (매출, 예약 통계)
- 상품 CRUD 및 이미지 업로드 (Supabase Storage)
- 예약 관리 및 상태 변경
- 결제 내역 조회 및 환불 처리
- 분석 차트 (Recharts)

### 실시간 알림
- Supabase Realtime을 활용한 실시간 업데이트
- 예약 상태 변경 알림
- Toast 알림 (Sonner)

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Hooks
- **Date Handling**: date-fns, react-day-picker
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toast**: Sonner

### Backend & Database
- **BaaS**: Supabase (PostgreSQL + Auth + Storage)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Next.js Server Actions

### Payment & External Services
- **Payment Gateway**: PortOne (구 아임포트)
- **실시간 통신**: Supabase Realtime

### 주요 라이브러리
- `@supabase/supabase-js` - Supabase 클라이언트
- `@portone/browser-sdk` - PortOne 결제 SDK
- `embla-carousel-react` - 캐러셀 구현
- `zod` - 스키마 검증
- `class-variance-authority` - 컴포넌트 variant 관리

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/                 # 인증 페이지
│   │   ├── login/              # 로그인
│   │   └── signup/             # 회원가입
│   ├── (main)/                 # 메인 페이지들
│   │   ├── products/           # 상품 페이지
│   │   │   ├── page.tsx        # 상품 목록
│   │   │   └── [id]/           # 상품 상세 및 예약
│   │   ├── mypage/             # 마이페이지
│   │   ├── about/              # 회사 소개
│   │   └── ...                 # 기타 페이지
│   ├── admin/                  # 관리자 페이지
│   │   ├── dashboard/          # 대시보드
│   │   ├── products/           # 상품 관리
│   │   ├── reservations/       # 예약 관리
│   │   ├── payments/           # 결제 관리
│   │   └── analytics/          # 분석 리포트
│   ├── actions/                # Server Actions
│   │   ├── auth.ts             # 인증
│   │   ├── products.ts         # 상품
│   │   ├── reservations.ts     # 예약
│   │   ├── payment.ts          # 결제
│   │   └── admin/              # 관리자 액션
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈페이지
│   └── globals.css             # 글로벌 스타일
├── components/
│   ├── layout/                 # 레이아웃 컴포넌트
│   ├── products/               # 상품 관련 컴포넌트
│   ├── auth/                   # 인증 컴포넌트
│   ├── mypage/                 # 마이페이지 컴포넌트
│   ├── admin/                  # 관리자 컴포넌트
│   │   ├── common/             # 공통 (사이드바, 헤더 등)
│   │   ├── dashboard/          # 대시보드
│   │   ├── products/           # 상품 관리
│   │   ├── reservations/       # 예약 관리
│   │   ├── payments/           # 결제 관리
│   │   └── analytics/          # 분석 차트
│   └── ui/                     # shadcn/ui 컴포넌트
├── lib/
│   ├── supabase/               # Supabase 클라이언트
│   │   ├── client.ts           # 클라이언트 사이드
│   │   ├── server.ts           # 서버 사이드
│   │   └── middleware.ts       # 미들웨어
│   ├── api/                    # API 함수
│   ├── payment/                # 결제 관련
│   ├── auth.ts                 # 인증 함수
│   └── utils.ts                # 유틸리티
├── types/                      # TypeScript 타입
│   ├── supabase.ts             # Supabase 생성 타입
│   ├── database.ts             # DB 타입
│   ├── payment.ts              # 결제 타입
│   └── product.ts              # 상품 타입
└── data/
    └── products.ts             # 더미 데이터 (개발용)

supabase/
└── migrations/                 # 데이터베이스 마이그레이션
    ├── 001_create_tables.sql
    ├── 002_row_level_security_apply_this.sql
    ├── 003_seed_data.sql
    └── ...

middleware.ts                   # Next.js 미들웨어 (인증)
```

## 🚀 시작하기

### 필수 조건

- Node.js 18.x 이상
- npm 또는 yarn
- Supabase 계정 ([supabase.com](https://supabase.com))
- PortOne 계정 ([portone.io](https://portone.io))

### 설치 및 설정

1. **저장소 클론**
```bash
git clone <repository-url>
cd init-nextjs-project
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 다음 값들을 설정하세요:

```env
# Supabase 설정 (https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PortOne 설정 (https://admin.portone.io/)
NEXT_PUBLIC_PORTONE_STORE_ID=your-store-id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your-channel-key
PORTONE_V2_API_SECRET=your-api-secret
NEXT_PUBLIC_PAYMENT_ENV=development

# 앱 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Supabase 데이터베이스 설정**

Supabase SQL Editor에서 다음 마이그레이션 파일들을 순서대로 실행:

```bash
supabase/migrations/001_create_tables.sql
supabase/migrations/002_row_level_security_apply_this.sql
supabase/migrations/003_seed_data.sql (선택사항)
supabase/migrations/004_auto_create_user_profile.sql
supabase/migrations/005_sync_existing_users.sql
```

자세한 내용은 `SUPABASE_SETUP.md` 참고

5. **개발 서버 실행**
```bash
npm run dev
```

6. **브라우저에서 열기**
```
http://localhost:3000
```

### 관리자 계정 생성

1. 웹사이트에서 회원가입
2. Supabase SQL Editor에서 관리자 권한 부여:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. `/admin` 경로로 관리자 페이지 접근

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

## 📋 데이터베이스 스키마

### users (사용자)
```typescript
interface User {
  id: string                      // UUID (Supabase Auth와 연동)
  email: string                   // 이메일
  name: string                    // 이름
  phone: string                   // 전화번호
  role: 'customer' | 'admin'      // 권한
  created_at: Date
  updated_at: Date
}
```

### products (상품)
```typescript
interface Product {
  id: string                      // UUID
  name: string                    // 상품명
  description: string             // 상품 설명
  images: string[]                // 이미지 URL 배열
  category: string                // 카테고리
  price_per_hour: number          // 시간당 가격
  capacity: number                // 최대 수용 인원
  location: string                // 위치
  amenities: string[]             // 편의시설
  available_time_slots: TimeSlot[] // 이용 가능 시간대
  status: 'active' | 'inactive'   // 상태
  created_at: Date
  updated_at: Date
}
```

### reservations (예약)
```typescript
interface Reservation {
  id: string                      // UUID
  product_id: string              // 상품 ID (FK)
  user_id: string                 // 사용자 ID (FK)
  reservation_date: Date          // 예약 날짜
  start_time: string              // 시작 시간
  end_time: string                // 종료 시간
  number_of_people: number        // 인원수
  total_price: number             // 총 금액
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  special_requests: string        // 특별 요청사항
  created_at: Date
  updated_at: Date
}
```

### payments (결제)
```typescript
interface Payment {
  id: string                      // UUID
  reservation_id: string          // 예약 ID (FK)
  user_id: string                 // 사용자 ID (FK)
  amount: number                  // 결제 금액
  payment_method: 'card' | 'transfer' | 'kakao' | 'toss'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id: string          // 결제 거래 ID
  paid_at: Date                   // 결제 시각
  refunded_at: Date               // 환불 시각
  created_at: Date
  updated_at: Date
}
```

## 🎨 디자인 특징

- **미니멀리즘**: 깔끔하고 직관적인 디자인
- **그라디언트 포인트**: 로고와 주요 텍스트에 그라디언트 적용
- **Glassmorphism**: 헤더의 backdrop blur 효과
- **부드러운 애니메이션**: 모든 인터랙션에 자연스러운 transition
- **완벽한 반응형**: 모든 디바이스에서 최적화된 경험
- **다크 모드 지원**: 사용자 선호에 따른 테마 전환

## ✅ 완료된 기능

- [x] 상품 목록 및 상세 페이지
- [x] 예약 기능 (캘린더, 시간대 선택)
- [x] 사용자 인증 (로그인/회원가입)
- [x] 결제 시스템 통합 (PortOne)
- [x] 관리자 대시보드
- [x] 예약 관리 시스템
- [x] 결제 관리 및 환불
- [x] 이미지 업로드 (Supabase Storage)
- [x] 실시간 알림
- [x] 분석 및 리포트

## 🔜 향후 개발 예정

- [ ] 리뷰 및 평점 기능
- [ ] 검색 기능 고도화 (전체 텍스트 검색)
- [ ] 즐겨찾기 기능
- [ ] 쿠폰 및 할인 시스템
- [ ] 이메일 알림 (예약 확인, 리마인더)
- [ ] 카카오톡 알림
- [ ] PWA 지원
- [ ] 다국어 지원 (i18n)

## 📚 문서

프로젝트 관련 상세 문서:

- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [예약 플로우 가이드](./COMPLETE_RESERVATION_FLOW.md)
- [결제 통합 가이드](./PAYMENT_INTEGRATION_COMPLETE.md)
- [관리자 시스템 가이드](./ADMIN_IMPLEMENTATION.md)
- [이미지 업로드 가이드](./IMAGE_UPLOAD_QUICKSTART.md)
- [실시간 알림 가이드](./REALTIME_NOTIFICATION_GUIDE.md)
- [프로젝트 전체 가이드](./ProjectGuideForVibeCoding.md)

## 🔧 문제 해결

### 자주 발생하는 문제

**"Invalid API key" 에러**
- `.env.local` 파일의 Supabase API 키 확인
- 개발 서버 재시작

**"relation does not exist" 에러**
- Supabase SQL Editor에서 마이그레이션 실행 확인
- `supabase/migrations/` 폴더의 SQL 파일 순차 실행

**결제 실패**
- PortOne 테스트 모드 활성화 확인
- 환경 변수 설정 확인

자세한 문제 해결 방법은 [ProjectGuideForVibeCoding.md](./ProjectGuideForVibeCoding.md) 참고

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... 기타 환경 변수

# 프로덕션 배포
vercel --prod
```

### 환경 변수 체크리스트

프로덕션 배포 시 필수 환경 변수:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID`
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
- ✅ `PORTONE_V2_API_SECRET`
- ✅ `NEXT_PUBLIC_PAYMENT_ENV=production`

## 🔒 보안

### 주요 보안 기능

- **Row Level Security (RLS)**: 모든 테이블에 RLS 정책 적용
- **환경 변수 관리**: 민감한 정보는 환경 변수로 관리
- **인증 토큰**: Supabase Auth JWT 토큰 사용
- **결제 검증**: 서버 사이드에서 결제 검증
- **XSS 방지**: React 자동 이스케이프
- **CSRF 방지**: Next.js 자동 처리

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🤝 기여하기

기여를 환영합니다! Pull Request를 보내주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issue를 생성해주세요.

---

**Made with ❤️ using Next.js, Supabase, and shadcn/ui**
