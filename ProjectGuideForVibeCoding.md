# 🎯 ReserveHub 프로젝트 완전 가이드
## Cursor/Claude AI 유지보수 및 개발을 위한 종합 문서

> **작성일**: 2026-02-12  
> **목적**: AI 기반 코드 개발/유지보수를 위한 프로젝트 전체 구조 및 패턴 정리  
> **대상**: Cursor IDE, Claude AI, 신규 개발자

---

## 📚 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 아키텍처](#2-기술-스택-및-아키텍처)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [핵심 기능별 구현 패턴](#4-핵심-기능별-구현-패턴)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [API 및 Server Actions](#6-api-및-server-actions)
7. [인증 및 권한 관리](#7-인증-및-권한-관리)
8. [결제 시스템](#8-결제-시스템)
9. [이미지 업로드 (Supabase Storage)](#9-이미지-업로드-supabase-storage)
10. [코딩 규칙 및 패턴](#10-코딩-규칙-및-패턴)
11. [개발 워크플로우](#11-개발-워크플로우)
12. [문제 해결 가이드](#12-문제-해결-가이드)
13. [배포 및 운영](#13-배포-및-운영)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정보

- **프로젝트명**: ReserveHub (회의실/스터디룸 예약 플랫폼)
- **버전**: v1.0
- **도메인**: 공간 대여 및 예약 관리
- **주요 기능**:
  - 사용자: 공간 검색, 예약, 결제, 예약 관리
  - 관리자: 상품 관리, 예약 관리, 결제 관리, 분석 대시보드

### 1.2 주요 특징

```
✅ Full-Stack TypeScript 기반
✅ Next.js 16 App Router (Server Components 활용)
✅ Supabase 기반 백엔드 (PostgreSQL + Auth + RLS)
✅ PortOne 결제 통합
✅ 실시간 예약 가능 시간 체크
✅ 관리자 대시보드 및 분석
✅ 반응형 디자인 (모바일 우선)
```

---

## 2. 기술 스택 및 아키텍처

### 2.1 Frontend

| 기술 | 버전 | 용도 |
|-----|------|-----|
| **Next.js** | 16.1.6 | React 프레임워크 (App Router) |
| **TypeScript** | 5.x | 타입 안전성 |
| **Tailwind CSS** | 4.0 | 스타일링 (유틸리티 우선) |
| **shadcn/ui** | Latest | UI 컴포넌트 라이브러리 |
| **Lucide React** | Latest | 아이콘 |
| **Embla Carousel** | Latest | 캐러셀 구현 |
| **date-fns** | Latest | 날짜 처리 |

### 2.2 Backend & Database

| 기술 | 용도 |
|-----|-----|
| **Supabase** | BaaS (PostgreSQL + Auth + Storage) |
| **PostgreSQL** | 관계형 데이터베이스 |
| **Row Level Security** | 데이터 보안 정책 |
| **Server Actions** | Next.js 서버 사이드 로직 |

### 2.3 Payment & External Services

| 서비스 | 용도 |
|-------|-----|
| **PortOne (구 아임포트)** | 결제 게이트웨이 |
| **Supabase Auth** | 사용자 인증 |

### 2.4 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js App │  │   Tailwind   │  │  shadcn/ui   │      │
│  │   (React)    │  │     CSS      │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Server (App Router)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Server    │  │  Middleware  │  │     API      │      │
│  │  Components  │  │   (Auth)     │  │    Routes    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    Server    │  │   Supabase   │                         │
│  │   Actions    │  │    Client    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│    Supabase      │  │   PortOne    │  │   External   │
│  (PostgreSQL)    │  │   Payment    │  │   Services   │
│  - Auth          │  │   Gateway    │  │              │
│  - Database      │  │              │  │              │
│  - Storage       │  │              │  │              │
│  - RLS           │  │              │  │              │
└──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 3. 프로젝트 구조

### 3.1 디렉토리 구조 전체

```
init-nextjs-project/
├── .cursor/                         # Cursor IDE 설정
│   └── global-cursor-rules.mdc      # AI 코딩 규칙
│
├── public/                          # 정적 파일
│
├── src/
│   ├── app/                         # Next.js App Router 페이지
│   │   ├── (auth)/                  # 인증 관련 페이지
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/                  # 메인 페이지들
│   │   │   ├── about/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # 상품 목록
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # 상품 상세
│   │   │   │       └── not-found.tsx
│   │   │   ├── mypage/
│   │   │   ├── how-to-reserve/
│   │   │   ├── faq/
│   │   │   ├── support/
│   │   │   ├── company/
│   │   │   ├── careers/
│   │   │   ├── partnership/
│   │   │   ├── terms/
│   │   │   └── privacy/
│   │   ├── admin/                   # 관리자 페이지
│   │   │   ├── layout.tsx           # 관리자 레이아웃
│   │   │   ├── page.tsx             # 대시보드 홈
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # 상품 목록
│   │   │   │   ├── new/             # 상품 생성
│   │   │   │   └── [id]/edit/       # 상품 수정
│   │   │   ├── reservations/
│   │   │   ├── payments/
│   │   │   └── analytics/
│   │   ├── actions/                 # Server Actions
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── reservations.ts
│   │   │   ├── payment.ts
│   │   │   └── admin/
│   │   │       ├── products.ts
│   │   │       ├── reservations.ts
│   │   │       ├── payments.ts
│   │   │       ├── dashboard.ts
│   │   │       └── analytics.ts
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 홈페이지
│   │   └── globals.css              # 글로벌 스타일
│   │
│   ├── components/                  # React 컴포넌트
│   │   ├── layout/                  # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── products/                # 상품 관련
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ReservationForm.tsx
│   │   │   ├── AvailableTimeSlotView.tsx
│   │   │   └── BackButton.tsx
│   │   ├── auth/                    # 인증 관련
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── mypage/                  # 마이페이지
│   │   │   ├── MyPageContent.tsx
│   │   │   └── ReservationCard.tsx
│   │   ├── admin/                   # 관리자 컴포넌트
│   │   │   ├── common/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── LoadingState.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── RecentReservationsTable.tsx
│   │   │   │   ├── WeeklySalesChart.tsx
│   │   │   │   └── ReservationStatusChart.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductsTable.tsx
│   │   │   │   └── ProductForm.tsx
│   │   │   ├── reservations/
│   │   │   │   ├── ReservationsTable.tsx
│   │   │   │   ├── ReservationsCalendar.tsx
│   │   │   │   ├── TodayReservations.tsx
│   │   │   │   └── ReservationDetailModal.tsx
│   │   │   ├── payments/
│   │   │   │   ├── PaymentsTable.tsx
│   │   │   │   └── PaymentDetailModal.tsx
│   │   │   └── analytics/
│   │   │       ├── MetricCard.tsx
│   │   │       ├── DailySalesChart.tsx
│   │   │       ├── DailyReservationsChart.tsx
│   │   │       ├── SalesByProductChart.tsx
│   │   │       ├── ReservationsByTimeSlotChart.tsx
│   │   │       └── TopProductsTable.tsx
│   │   └── ui/                      # shadcn/ui 컴포넌트
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       ├── calendar.tsx
│   │       ├── popover.tsx
│   │       ├── badge.tsx
│   │       └── carousel.tsx
│   │
│   ├── lib/                         # 유틸리티 및 라이브러리
│   │   ├── supabase/
│   │   │   ├── client.ts            # 클라이언트 사이드
│   │   │   ├── server.ts            # 서버 사이드
│   │   │   └── middleware.ts        # 미들웨어
│   │   ├── api/                     # API 함수
│   │   │   ├── products.ts
│   │   │   ├── reservations.ts
│   │   │   └── payments.ts
│   │   ├── payment/
│   │   │   └── portone-client.ts    # PortOne 결제 클라이언트
│   │   ├── utils/
│   │   │   └── product-mapper.ts    # 타입 변환 유틸
│   │   ├── auth.ts                  # 인증 함수
│   │   └── utils.ts                 # 공통 유틸
│   │
│   ├── types/                       # TypeScript 타입 정의
│   │   ├── supabase.ts              # Supabase 생성 타입
│   │   ├── database.ts              # 데이터베이스 유틸 타입
│   │   ├── payment.ts               # 결제 관련 타입
│   │   └── product.ts               # 상품 타입
│   │
│   └── data/                        # 정적 데이터
│       └── products.ts              # 더미 데이터 (개발용)
│
├── supabase/                        # Supabase 설정
│   ├── migrations/                  # SQL 마이그레이션
│   │   ├── 001_create_tables.sql
│   │   ├── 002_row_level_security_apply_this.sql
│   │   ├── 003_seed_data.sql
│   │   ├── 004_auto_create_user_profile.sql
│   │   ├── 005_sync_existing_users.sql
│   │   └── 006_add_weekend_timeslots.sql
│   └── README.md
│
├── middleware.ts                    # Next.js 미들웨어 (인증)
├── .env.local                       # 환경 변수 (gitignore)
├── .env.local.example               # 환경 변수 템플릿
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
│
└── 문서/                            # 프로젝트 문서들
    ├── SUPABASE_SETUP.md
    ├── COMPLETE_RESERVATION_FLOW.md
    ├── PAYMENT_INTEGRATION_COMPLETE.md
    ├── ADMIN_ROLE_SETUP.md
    ├── ADMIN_IMPLEMENTATION.md
    ├── ADMIN_REQUIREMENTS.md
    ├── ADMIN_QUICKSTART.md
    ├── ADMIN_SUMMARY.md
    ├── PORTONE_INTEGRATION_GUIDE.md
    ├── USER_PROFILE_FIX_GUIDE.md
    ├── RLS_FIX_GUIDE.md
    └── ProjectGuideForVibeCoding.md (이 파일)
```

### 3.2 주요 디렉토리 역할

| 디렉토리 | 역할 | 중요도 |
|---------|-----|--------|
| `src/app/` | Next.js 라우팅 및 페이지 | ⭐⭐⭐⭐⭐ |
| `src/components/` | 재사용 가능한 React 컴포넌트 | ⭐⭐⭐⭐⭐ |
| `src/lib/` | 비즈니스 로직, API 함수 | ⭐⭐⭐⭐⭐ |
| `src/types/` | TypeScript 타입 정의 | ⭐⭐⭐⭐ |
| `supabase/migrations/` | 데이터베이스 스키마 | ⭐⭐⭐⭐⭐ |
| `middleware.ts` | 인증 및 권한 체크 | ⭐⭐⭐⭐⭐ |

---

## 4. 핵심 기능별 구현 패턴

### 4.1 상품 목록 및 상세 조회

#### 📁 관련 파일
```
src/app/products/page.tsx           # 상품 목록 페이지
src/app/products/[id]/page.tsx      # 상품 상세 페이지
src/components/products/ProductList.tsx
src/components/products/ProductCard.tsx
src/lib/api/products.ts
src/app/actions/products.ts
```

#### 패턴: Server Component에서 데이터 패칭

```typescript
// src/app/products/page.tsx
import { getProductsServer } from '@/lib/api/products'

export default async function ProductsPage() {
  // 서버 컴포넌트에서 직접 데이터 조회
  const products = await getProductsServer()
  
  return (
    <div>
      <ProductList products={products} />
    </div>
  )
}
```

#### 패턴: Client Component에서 상태 관리

```typescript
// src/components/products/ProductList.tsx
'use client'

export function ProductList({ products }: { products: Product[] }) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [category, setCategory] = useState('전체')
  
  // 클라이언트 사이드 필터링
  useEffect(() => {
    if (category === '전체') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === category))
    }
  }, [category, products])
  
  return (
    // UI 렌더링
  )
}
```

### 4.2 예약 생성 플로우

#### 📁 관련 파일
```
src/components/products/ReservationForm.tsx
src/app/actions/reservations.ts
src/lib/api/reservations.ts
src/lib/payment/portone-client.ts
```

#### 단계별 프로세스

```typescript
// 1단계: 사용자가 예약 정보 입력
// src/components/products/ReservationForm.tsx
'use client'

export function ReservationForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState({
    date: null,
    startTime: '',
    endTime: '',
    numberOfPeople: 1
  })
  
  const handleSubmit = async () => {
    // 2단계: 예약 가능 여부 체크
    const isAvailable = await checkAvailability(
      product.id,
      formData.date,
      formData.startTime,
      formData.endTime
    )
    
    if (!isAvailable) {
      alert('이미 예약된 시간입니다')
      return
    }
    
    // 3단계: 임시 예약 생성 (status: 'pending')
    const reservation = await createReservation({
      product_id: product.id,
      reservation_date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
      number_of_people: formData.numberOfPeople,
      status: 'pending'
    })
    
    // 4단계: 결제 요청
    const paymentResult = await requestPayment({
      reservationId: reservation.id,
      amount: calculateTotalPrice()
    })
    
    // 5단계: 결제 성공 시 예약 확정 (status: 'confirmed')
    if (paymentResult.success) {
      await confirmReservation(reservation.id)
      router.push('/mypage')
    }
  }
  
  return (
    // UI 렌더링
  )
}
```

### 4.3 관리자 페이지 구조

#### 📁 관련 파일
```
src/app/admin/layout.tsx            # 관리자 레이아웃 (권한 체크)
src/app/admin/dashboard/page.tsx
src/app/admin/products/page.tsx
src/app/admin/reservations/page.tsx
src/components/admin/common/AdminSidebar.tsx
src/app/actions/admin/*.ts
```

#### 패턴: 관리자 권한 체크

```typescript
// src/app/admin/layout.tsx
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  // 서버 사이드에서 관리자 권한 체크
  const hasAdminRole = await isAdmin()
  
  if (!hasAdminRole) {
    redirect('/')
  }
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  )
}
```

#### 패턴: 관리자 데이터 조회 및 수정

```typescript
// src/app/actions/admin/reservations.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'

export async function updateReservationStatus(
  reservationId: string,
  status: 'confirmed' | 'cancelled' | 'completed'
) {
  // 권한 체크
  if (!await isAdmin()) {
    throw new Error('관리자 권한이 필요합니다')
  }
  
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reservationId)
    .select()
    .single()
  
  if (error) throw error
  
  return data
}
```

### 4.4 인증 플로우

#### 📁 관련 파일
```
src/components/auth/LoginForm.tsx
src/components/auth/SignupForm.tsx
src/app/actions/auth.ts
src/lib/auth.ts
middleware.ts
```

#### 패턴: 회원가입 및 프로필 생성

```typescript
// src/app/actions/auth.ts
'use server'

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone: string
) {
  const supabase = await createServerSupabaseClient()
  
  // 1. Supabase Auth 회원가입
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (authError) throw authError
  
  // 2. users 테이블에 프로필 생성 (트리거 자동 실행)
  // 004_auto_create_user_profile.sql 마이그레이션 참조
  
  return authData.user
}
```

#### 패턴: 로그인 상태 확인

```typescript
// src/lib/auth.ts
'use server'

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserWithRole() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return {
    ...user,
    role: userProfile?.role || 'customer'
  }
}

export async function isAdmin() {
  const user = await getUserWithRole()
  return user?.role === 'admin'
}
```

### 4.5 결제 통합

#### 📁 관련 파일
```
src/lib/payment/portone-client.ts
src/app/actions/payment.ts
src/components/products/ReservationForm.tsx
```

#### 패턴: PortOne 결제 요청

```typescript
// src/lib/payment/portone-client.ts
export async function requestPortOnePayment({
  reservationId,
  amount,
  productName,
  buyerName,
  buyerEmail,
  buyerTel
}: PaymentRequest) {
  // PortOne SDK 초기화 및 결제 요청
  const IMP = window.IMP
  IMP.init(process.env.NEXT_PUBLIC_PORTONE_IMP_CODE!)
  
  return new Promise((resolve, reject) => {
    IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `order_${reservationId}_${Date.now()}`,
      name: productName,
      amount: amount,
      buyer_email: buyerEmail,
      buyer_name: buyerName,
      buyer_tel: buyerTel
    }, (rsp) => {
      if (rsp.success) {
        resolve(rsp)
      } else {
        reject(new Error(rsp.error_msg))
      }
    })
  })
}
```

---

## 5. 데이터베이스 스키마

### 5.1 테이블 구조

#### users (사용자)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명**:
- `id`: Supabase Auth의 user ID와 연동 (외래키)
- `role`: 'customer' (일반 사용자) 또는 'admin' (관리자)
- 자동 생성: 회원가입 시 트리거로 자동 생성 (004_auto_create_user_profile.sql)

#### products (상품)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT,
  amenities TEXT[] DEFAULT '{}',
  available_time_slots JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명**:
- `available_time_slots`: 이용 가능 시간대 (JSONB 배열)
  ```json
  [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "22:00" },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "22:00" }
  ]
  ```
  - `dayOfWeek`: 0(일요일) ~ 6(토요일)

#### reservations (예약)

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  number_of_people INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**상태 흐름**:
```
pending → confirmed → completed
   ↓
cancelled
```

#### payments (결제)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'transfer', 'kakao', 'toss')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.2 Row Level Security (RLS) 정책

#### users 테이블

```sql
-- 본인 정보만 조회 가능
CREATE POLICY "사용자는 본인 정보만 조회 가능"
ON users FOR SELECT
USING (auth.uid() = id);

-- 본인 정보만 수정 가능
CREATE POLICY "사용자는 본인 정보만 수정 가능"
ON users FOR UPDATE
USING (auth.uid() = id);
```

#### products 테이블

```sql
-- 모든 사용자 조회 가능
CREATE POLICY "누구나 상품 조회 가능"
ON products FOR SELECT
USING (true);

-- 관리자만 수정 가능
CREATE POLICY "관리자만 상품 수정 가능"
ON products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

#### reservations 테이블

```sql
-- 본인 예약만 조회 가능
CREATE POLICY "사용자는 본인 예약만 조회 가능"
ON reservations FOR SELECT
USING (user_id = auth.uid());

-- 본인만 예약 생성 가능
CREATE POLICY "인증된 사용자만 예약 생성 가능"
ON reservations FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 관리자는 모든 예약 조회 및 수정 가능
CREATE POLICY "관리자는 모든 예약 접근 가능"
ON reservations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### 5.3 마이그레이션 실행 순서

**Supabase SQL Editor에서 순차 실행**:

```bash
1. 001_create_tables.sql              # 테이블 생성
2. 002_row_level_security_apply_this.sql  # RLS 정책 적용
3. 003_seed_data.sql                  # 테스트 데이터 (선택)
4. 004_auto_create_user_profile.sql   # 사용자 프로필 자동 생성 트리거
5. 005_sync_existing_users.sql        # 기존 사용자 동기화
6. 006_add_weekend_timeslots.sql      # 주말 시간대 추가
```

---

## 6. API 및 Server Actions

### 6.1 API 함수 구조

#### 클라이언트 사이드 API (`src/lib/api/`)

```typescript
// src/lib/api/products.ts
import { createClient } from '@/lib/supabase/client'

// 클라이언트 컴포넌트에서 사용
export async function getProducts() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
  
  if (error) throw error
  return data
}
```

#### 서버 사이드 API (`src/lib/api/`)

```typescript
// src/lib/api/products.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'

// 서버 컴포넌트에서 사용
export async function getProductsServer() {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
  
  if (error) throw error
  return data
}
```

### 6.2 Server Actions 패턴

#### 기본 구조

```typescript
// src/app/actions/products.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  // 1. 권한 체크
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')
  
  // 2. 데이터 검증
  const name = formData.get('name') as string
  if (!name) throw new Error('상품명은 필수입니다')
  
  // 3. DB 작업
  const { data, error } = await supabase
    .from('products')
    .insert({ name, /* ... */ })
    .select()
    .single()
  
  if (error) throw error
  
  // 4. 캐시 재검증
  revalidatePath('/admin/products')
  
  return data
}
```

#### 사용 예제

```typescript
// 클라이언트 컴포넌트에서 호출
'use client'

import { createProduct } from '@/app/actions/products'

export function ProductForm() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await createProduct(formData)
      alert('상품이 생성되었습니다')
    } catch (error) {
      alert(error.message)
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* 폼 필드 */}
    </form>
  )
}
```

### 6.3 주요 API 함수 목록

#### Products

```typescript
// src/lib/api/products.ts
export async function getProducts()           // 전체 상품 조회
export async function getProductsServer()     // 서버에서 상품 조회
export async function getProductById(id)      // 상품 상세 조회
export async function getProductByIdServer(id) // 서버에서 상품 상세 조회
```

#### Reservations

```typescript
// src/lib/api/reservations.ts
export async function createReservation(data)      // 예약 생성
export async function getMyReservations()          // 내 예약 목록
export async function checkAvailability(params)    // 예약 가능 여부 확인
export async function cancelReservation(id)        // 예약 취소
```

#### Payments

```typescript
// src/lib/api/payments.ts
export async function createPayment(data)          // 결제 생성
export async function verifyPayment(impUid)        // 결제 검증
export async function getPaymentByReservationId(id) // 예약의 결제 조회
```

#### Admin

```typescript
// src/app/actions/admin/reservations.ts
export async function getAllReservations()         // 모든 예약 조회
export async function updateReservationStatus()    // 예약 상태 변경
export async function getReservationStats()        // 예약 통계

// src/app/actions/admin/dashboard.ts
export async function getDashboardStats()          // 대시보드 통계
export async function getWeeklySales()             // 주간 매출
```

---

## 7. 인증 및 권한 관리

### 7.1 인증 흐름

```
┌─────────────┐
│   회원가입   │
└─────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Supabase Auth 계정 생성            │
│  (auth.users 테이블에 저장)         │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Trigger 실행                       │
│  (public.users 테이블에 프로필 생성) │
│  role: 'customer' (기본값)          │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────┐
│    로그인    │
└─────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Middleware에서 세션 확인           │
│  (모든 요청에서 자동 실행)          │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  페이지별 권한 체크                 │
│  - /admin: 관리자만 접근 가능       │
│  - /mypage: 로그인 필요             │
└─────────────────────────────────────┘
```

### 7.2 권한 레벨

| Role | 권한 | 접근 가능 페이지 |
|------|-----|----------------|
| **guest** | 비회원 | 홈, 상품 목록, 상품 상세 (읽기만) |
| **customer** | 일반 회원 | 위 + 예약, 결제, 마이페이지 |
| **admin** | 관리자 | 위 + 관리자 페이지 전체 |

### 7.3 권한 체크 구현

#### Middleware (모든 요청)

```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()
  
  // 인증 필요 경로
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 관리자 권한 필요
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userProfile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return supabaseResponse
}
```

#### Layout (페이지 레벨)

```typescript
// src/app/admin/layout.tsx
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  if (!await isAdmin()) {
    redirect('/')
  }
  
  return <div>{children}</div>
}
```

#### Component (UI 레벨)

```typescript
// src/components/layout/Header.tsx
'use client'

export function Header() {
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin')
      }
    }
    
    checkAdmin()
  }, [])
  
  return (
    <header>
      {isAdmin && (
        <Link href="/admin">관리자 포털</Link>
      )}
    </header>
  )
}
```

### 7.4 관리자 권한 부여

```sql
-- Supabase SQL Editor에서 실행
UPDATE users
SET role = 'admin'
WHERE email = '관리자이메일@example.com';
```

---

## 8. 결제 시스템

### 8.1 PortOne (아임포트) 통합

#### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_PORTONE_IMP_CODE=imp12345678
PORTONE_API_KEY=your_api_key
PORTONE_API_SECRET=your_api_secret
NEXT_PUBLIC_PAYMENT_ENV=development  # or production
```

### 8.2 결제 플로우

```
1. 사용자: 예약 정보 입력
   ↓
2. 임시 예약 생성 (status: 'pending')
   ↓
3. PortOne 결제 요청 (클라이언트)
   ↓
4. 사용자: 결제 수단 선택 및 결제
   ↓
5. PortOne 서버에서 검증 (서버)
   ↓
6. 결제 정보 저장 (payments 테이블)
   ↓
7. 예약 확정 (status: 'confirmed')
   ↓
8. 사용자에게 확인 이메일 발송 (선택)
```

### 8.3 결제 구현 코드

#### 클라이언트: 결제 요청

```typescript
// src/lib/payment/portone-client.ts
export async function requestPortOnePayment({
  reservationId,
  amount,
  productName,
  buyerName,
  buyerEmail
}: PaymentRequest) {
  const IMP = window.IMP
  IMP.init(process.env.NEXT_PUBLIC_PORTONE_IMP_CODE!)
  
  return new Promise((resolve, reject) => {
    IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `order_${reservationId}_${Date.now()}`,
      name: productName,
      amount: amount,
      buyer_email: buyerEmail,
      buyer_name: buyerName
    }, (rsp) => {
      if (rsp.success) {
        resolve(rsp)
      } else {
        reject(new Error(rsp.error_msg))
      }
    })
  })
}
```

#### 서버: 결제 검증

```typescript
// src/app/actions/payment.ts
'use server'

export async function verifyPayment(impUid: string, reservationId: string) {
  // 1. PortOne 서버에서 결제 정보 조회
  const response = await fetch('https://api.iamport.kr/payments/${impUid}', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  const paymentData = await response.json()
  
  // 2. 금액 일치 확인
  const reservation = await getReservation(reservationId)
  if (paymentData.amount !== reservation.total_price) {
    throw new Error('결제 금액 불일치')
  }
  
  // 3. payments 테이블에 저장
  await createPayment({
    reservation_id: reservationId,
    amount: paymentData.amount,
    transaction_id: impUid,
    payment_status: 'completed'
  })
  
  // 4. 예약 상태 변경
  await updateReservationStatus(reservationId, 'confirmed')
  
  return { success: true }
}
```

### 8.4 결제 취소 (환불)

```typescript
// src/app/actions/payment.ts
'use server'

export async function refundPayment(reservationId: string) {
  // 1. 권한 체크
  const user = await getUser()
  const reservation = await getReservation(reservationId)
  
  if (reservation.user_id !== user.id && !await isAdmin()) {
    throw new Error('권한이 없습니다')
  }
  
  // 2. 결제 정보 조회
  const payment = await getPaymentByReservationId(reservationId)
  
  // 3. PortOne API로 환불 요청
  const response = await fetch('https://api.iamport.kr/payments/cancel', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imp_uid: payment.transaction_id,
      amount: payment.amount,
      reason: '사용자 요청'
    })
  })
  
  // 4. 상태 업데이트
  await updatePaymentStatus(payment.id, 'refunded')
  await updateReservationStatus(reservationId, 'cancelled')
  
  return { success: true }
}
```

---

## 9. 이미지 업로드 (Supabase Storage)

### 9.1 Supabase Storage 설정

#### 빠른 시작

상세한 설정 방법은 **`IMAGE_UPLOAD_QUICKSTART.md`** 참고

#### Bucket 생성

```
1. Supabase Dashboard → Storage
2. New bucket 클릭
3. Name: product-images
4. Public bucket: ✅
5. Create
```

#### Storage 정책 설정

```sql
-- SQL Editor에서 실행
CREATE POLICY "public_select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-images');
CREATE POLICY "authenticated_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "authenticated_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "authenticated_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
```

### 9.2 이미지 업로드 구현

#### 📁 관련 파일

```
src/app/actions/admin/products.ts        # Server Actions
src/components/admin/products/ProductForm.tsx  # UI 컴포넌트
```

#### Server Action: 이미지 업로드

```typescript
// src/app/actions/admin/products.ts
'use server'

export async function uploadProductImage(file: File, productId: string) {
  const supabase = await createServerSupabaseClient()
  
  try {
    // 1. 파일 검증
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return { success: false, error: '지원하지 않는 파일 형식입니다.' }
    }
    
    // 2. 고유 파일명 생성
    const fileName = `${productId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // 3. Storage에 업로드
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      // 에러 타입별 메시지
      if (error.message.includes('Bucket not found')) {
        return { success: false, error: 'Storage bucket이 생성되지 않았습니다.' }
      } else if (error.message.includes('row-level security policy')) {
        return { success: false, error: 'Storage 업로드 권한이 없습니다.' }
      }
      throw error
    }
    
    // 4. Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
    
    return { success: true, url: publicUrl }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

#### Server Action: 이미지 삭제

```typescript
// src/app/actions/admin/products.ts
'use server'

export async function deleteProductImage(imageUrl: string) {
  const supabase = await createServerSupabaseClient()
  
  try {
    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split('/product-images/')
    if (urlParts.length < 2) {
      return { success: false, error: '잘못된 이미지 URL입니다.' }
    }
    
    const filePath = urlParts[1].split('?')[0] // query string 제거
    
    // Storage에서 삭제
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])
    
    if (error) throw error
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

### 9.3 클라이언트 컴포넌트 구현

#### 이미지 업로드 UI

```typescript
// src/components/admin/products/ProductForm.tsx
'use client'

import { uploadProductImage, deleteProductImage } from '@/app/actions/admin/products'

export function ProductForm() {
  const [formData, setFormData] = useState({
    images: []
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null)
  
  // 이미지 업로드
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }
    
    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.')
      return
    }
    
    setUploadingImage(true)
    try {
      const result = await uploadProductImage(file, productId || `temp_${Date.now()}`)
      
      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.url]
        }))
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
      e.target.value = '' // 파일 입력 초기화
    }
  }
  
  // 이미지 삭제
  async function removeImage(index: number) {
    if (!confirm('이미지를 삭제하시겠습니까?')) return
    
    const imageUrl = formData.images[index]
    setDeletingImageIndex(index)
    
    try {
      // Supabase Storage에서 삭제
      if (imageUrl.includes('supabase')) {
        const result = await deleteProductImage(imageUrl)
        if (!result.success) {
          alert('이미지 삭제에 실패했습니다.')
          return
        }
      }
      
      // 배열에서 제거
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    } catch (error) {
      alert('이미지 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingImageIndex(null)
    }
  }
  
  return (
    <div>
      {/* 업로드 영역 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploadingImage}
      />
      
      {/* 이미지 목록 */}
      <div className="grid grid-cols-4 gap-4">
        {formData.images.map((image, index) => (
          <div key={index} className="relative">
            <Image src={image} alt={`Image ${index + 1}`} fill />
            {deletingImageIndex === index ? (
              <Loader2 className="animate-spin" />
            ) : (
              <button onClick={() => removeImage(index)}>
                <X />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 9.4 상품 삭제 시 이미지 처리

상품을 삭제할 때 Storage의 이미지도 함께 삭제:

```typescript
// src/app/actions/admin/products.ts
export async function deleteProduct(id: string) {
  const supabase = await createServerSupabaseClient()
  
  try {
    // 1. 상품 정보 조회 (이미지 URL 가져오기)
    const { data: product } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single()
    
    // 2. 상품 삭제
    await supabase.from('products').delete().eq('id', id)
    
    // 3. Storage에서 이미지 삭제
    if (product?.images?.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('supabase')) {
          await deleteProductImage(imageUrl)
        }
      }
    }
    
    return { success: true }
  } catch (error) {
    return { success: false, error: '상품 삭제에 실패했습니다.' }
  }
}
```

### 9.5 이미지 업로드 플로우

```
1. 사용자: 파일 선택
   ↓
2. 클라이언트: 파일 검증 (크기, 타입)
   ↓
3. Server Action: uploadProductImage() 호출
   ↓
4. Supabase Storage: 파일 업로드
   ↓
5. Public URL 생성
   ↓
6. 클라이언트: images 배열에 URL 추가
   ↓
7. 상품 저장: DB에 이미지 URL 배열 저장
```

### 9.6 문제 해결

#### "Bucket not found"

**원인**: product-images bucket이 생성되지 않음

**해결**:
- Storage → New bucket → product-images 생성
- Public bucket 활성화

#### "RLS policy violation"

**원인**: Storage 정책이 설정되지 않음

**해결**:
- Storage 정책 SQL 실행 (9.1 참조)

#### 이미지가 표시되지 않음

**원인**: Public bucket이 아님

**해결**:
- Storage → product-images → Configuration
- Public bucket 체크

### 9.7 보안 고려사항

```typescript
// ✅ 파일 크기 제한
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

// ✅ 파일 타입 검증
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// ✅ 파일명 sanitize
const fileName = `${productId}/${Date.now()}_${crypto.randomUUID()}.${ext}`

// ✅ Storage 정책으로 권한 제어
// - 업로드: 인증된 사용자만
// - 삭제: 인증된 사용자만
// - 조회: 모든 사용자 (public)
```

### 9.8 관련 문서

- **IMAGE_UPLOAD_QUICKSTART.md**: 5분 빠른 시작
- **STORAGE_SETUP_GUIDE.md**: 상세 설정 가이드
- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)

---

## 10. 코딩 규칙 및 패턴

### 10.1 Standard.js 코드 스타일

```javascript
// ✅ 올바른 예제
function Component () {
  const [state, setState] = useState(0)
  
  const handleClick = () => {
    setState(state + 1)
  }
  
  return (
    <button onClick={handleClick}>
      Count: {state}
    </button>
  )
}

// ❌ 잘못된 예제
function Component() {              // 함수명과 괄호 사이 공백 없음
  const [state,setState]=useState(0); // 세미콜론, 공백 없음
  
  const handleClick=()=>{           // 공백 없음
    setState(state+1);               // 연산자 공백 없음
  };
  
  return (
    <button onClick={handleClick}>
      Count: {state}
    </button>
  );
}
```

### 9.2 파일 명명 규칙

```
컴포넌트 파일: PascalCase
- Header.tsx
- ProductCard.tsx
- AdminSidebar.tsx

유틸/API 파일: camelCase
- auth.ts
- products.ts
- utils.ts

페이지 파일: Next.js 규칙
- page.tsx
- layout.tsx
- not-found.tsx

디렉토리: kebab-case
- admin-dashboard/
- product-list/
```

### 9.3 컴포넌트 구조 패턴

```typescript
// 권장 컴포넌트 구조
'use client' // 필요한 경우에만

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SomeAction } from '@/app/actions/some'

// 1. 타입 정의
interface ComponentProps {
  title: string
  onSubmit: () => void
}

// 2. 메인 컴포넌트
export function Component ({ title, onSubmit }: ComponentProps) {
  // 2-1. 상태
  const [loading, setLoading] = useState(false)
  
  // 2-2. 이펙트
  useEffect(() => {
    // 초기화 로직
  }, [])
  
  // 2-3. 핸들러
  const handleClick = async () => {
    setLoading(true)
    try {
      await onSubmit()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  // 2-4. 렌더
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? '처리 중...' : '제출'}
      </Button>
    </div>
  )
}

// 3. 서브 컴포넌트 (필요한 경우)
function SubComponent () {
  return <div>Sub</div>
}
```

### 9.4 에러 처리 패턴

```typescript
// Server Action에서
'use server'

export async function someAction(data: FormData) {
  try {
    // 1. 권한 체크
    const user = await getUser()
    if (!user) {
      throw new Error('로그인이 필요합니다')
    }
    
    // 2. 데이터 검증
    const value = data.get('field')
    if (!value) {
      throw new Error('필수 필드입니다')
    }
    
    // 3. 비즈니스 로직
    const result = await someDBOperation()
    
    // 4. 성공 응답
    return { success: true, data: result }
    
  } catch (error) {
    // 5. 에러 처리
    console.error('Action failed:', error)
    return { 
      success: false, 
      error: error.message || '작업 실패' 
    }
  }
}

// 클라이언트에서 호출
const result = await someAction(formData)
if (!result.success) {
  alert(result.error)
  return
}
// 성공 처리
```

### 9.5 Server Component vs Client Component

#### Server Component 사용 (기본)

```typescript
// ✅ 이런 경우 Server Component 사용
// - 데이터 페칭만 하는 경우
// - 상태가 필요 없는 경우
// - 이벤트 핸들러가 필요 없는 경우

// src/app/products/page.tsx
import { getProductsServer } from '@/lib/api/products'

export default async function ProductsPage() {
  const products = await getProductsServer()
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

#### Client Component 사용

```typescript
// ✅ 이런 경우 Client Component 사용
// - useState, useEffect 등 훅 사용
// - 이벤트 핸들러 (onClick, onChange 등)
// - 브라우저 API (window, localStorage 등)

'use client'

import { useState } from 'react'

export function InteractiveComponent () {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### 9.6 타입 안전성

```typescript
// ✅ 타입 정의 사용
import type { Product } from '@/types/database'

interface Props {
  products: Product[]
}

export function ProductList ({ products }: Props) {
  // ...
}

// ❌ any 사용 지양
function Component (props: any) {  // 피하기
  // ...
}

// ✅ 제네릭 활용
async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json()
}

const products = await getData<Product[]>('/api/products')
```

---

## 10. 개발 워크플로우

### 10.1 초기 설정

```bash
# 1. 저장소 클론
git clone <repository-url>
cd init-nextjs-project

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 수정 (Supabase, PortOne 키 입력)

# 4. 개발 서버 실행
npm run dev

# 브라우저: http://localhost:3000
```

### 10.2 Supabase 설정

```bash
# 1. Supabase 프로젝트 생성 (supabase.com)

# 2. SQL Editor에서 마이그레이션 실행
# - 001_create_tables.sql
# - 002_row_level_security_apply_this.sql
# - 003_seed_data.sql (선택)
# - 004_auto_create_user_profile.sql
# - 005_sync_existing_users.sql
# - 006_add_weekend_timeslots.sql

# 3. API 키 복사 및 .env.local 업데이트
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# 4. 관리자 계정 생성
# - 회원가입 후 SQL Editor에서 role 변경
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 10.3 새 기능 추가 프로세스

#### 예시: 리뷰 기능 추가

```bash
# 1. 데이터베이스 스키마 추가
# supabase/migrations/007_create_reviews.sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

# 2. 타입 정의 추가
# src/types/database.ts
export type Review = Tables<'reviews'>

# 3. API 함수 생성
# src/lib/api/reviews.ts
export async function createReview(data: InsertReview) { /* ... */ }
export async function getProductReviews(productId: string) { /* ... */ }

# 4. Server Action 생성 (필요시)
# src/app/actions/reviews.ts
'use server'
export async function submitReview(formData: FormData) { /* ... */ }

# 5. 컴포넌트 생성
# src/components/products/ReviewForm.tsx
# src/components/products/ReviewList.tsx

# 6. 페이지 통합
# src/app/products/[id]/page.tsx
import { ReviewList } from '@/components/products/ReviewList'
// 기존 코드에 추가

# 7. 테스트
npm run dev
# 브라우저에서 기능 테스트

# 8. 커밋
git add .
git commit -m "feat: 리뷰 기능 추가"
```

### 10.4 Git 워크플로우

```bash
# 1. 새 브랜치 생성
git checkout -b feature/review-system

# 2. 작업 및 커밋
git add .
git commit -m "feat: 리뷰 테이블 및 API 추가"
git commit -m "feat: 리뷰 컴포넌트 구현"

# 3. 푸시
git push origin feature/review-system

# 4. Pull Request 생성 및 리뷰

# 5. 머지 후 배포
git checkout main
git pull origin main
```

### 10.5 디버깅 팁

#### 1. Console Logging

```typescript
// 개발 중에만 로그 출력
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data)
}
```

#### 2. Supabase Query 디버깅

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')

console.log('Supabase Response:', { data, error })
```

#### 3. Next.js DevTools

```bash
# 터미널에서 요청 로그 확인
npm run dev

# 브라우저 개발자 도구
# - Network 탭: API 요청 확인
# - React DevTools: 컴포넌트 상태 확인
# - Console: 에러 메시지 확인
```

#### 4. TypeScript 에러

```bash
# 타입 체크
npm run type-check

# 또는
npx tsc --noEmit
```

---

## 11. 문제 해결 가이드

### 11.1 자주 발생하는 문제

#### 문제 1: "Invalid API key" 에러

**증상**:
```
Error: Invalid API key
```

**원인**:
- `.env.local` 파일의 Supabase API 키가 잘못됨
- 환경 변수가 로드되지 않음

**해결**:
```bash
# 1. .env.local 파일 확인
cat .env.local

# 2. Supabase Dashboard에서 키 다시 복사
# Settings > API > Project URL, anon key 복사

# 3. 개발 서버 재시작
npm run dev
```

#### 문제 2: "relation does not exist" 에러

**증상**:
```
Error: relation "public.products" does not exist
```

**원인**:
- 데이터베이스 테이블이 생성되지 않음
- 마이그레이션이 실행되지 않음

**해결**:
```sql
-- Supabase SQL Editor에서 실행
-- 1. 테이블 존재 확인
SELECT * FROM pg_tables WHERE schemaname = 'public';

-- 2. 테이블이 없으면 마이그레이션 실행
-- supabase/migrations/001_create_tables.sql 내용 실행
```

#### 문제 3: RLS 정책으로 인한 권한 에러

**증상**:
```
Error: new row violates row-level security policy
```

**원인**:
- Row Level Security 정책이 작업을 차단함
- 로그인되지 않았거나 권한이 없음

**해결**:
```sql
-- 1. RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'products';

-- 2. 임시로 RLS 비활성화 (개발 환경에서만)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 3. 정책 수정 후 다시 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

#### 문제 4: 결제 실패

**증상**:
- 결제 창이 뜨지 않음
- 결제 후 에러 발생

**원인**:
- PortOne IMP 코드가 잘못됨
- 테스트 모드가 아닌 실제 결제 시도

**해결**:
```bash
# 1. 환경 변수 확인
echo $NEXT_PUBLIC_PORTONE_IMP_CODE

# 2. PortOne 대시보드에서 테스트 모드 활성화
# 관리자콘솔 > 시스템설정 > 테스트모드

# 3. 브라우저 콘솔에서 에러 확인
# F12 > Console 탭
```

#### 문제 5: 이미지가 표시되지 않음

**증상**:
- 상품 이미지가 깨짐
- 404 에러

**원인**:
- 이미지 URL이 잘못됨
- Supabase Storage가 설정되지 않음

**해결**:
```typescript
// 1. 이미지 URL 확인
console.log('Image URL:', product.images[0])

// 2. Supabase Storage 설정
// Dashboard > Storage > New Bucket
// - Name: product-images
// - Public: true

// 3. 이미지 업로드 테스트
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('test.jpg', file)
```

### 11.2 성능 최적화

#### 1. 이미지 최적화

```typescript
// Next.js Image 컴포넌트 사용
import Image from 'next/image'

<Image
  src={product.images[0]}
  alt={product.name}
  width={800}
  height={600}
  priority  // LCP 개선
/>
```

#### 2. 데이터 페칭 최적화

```typescript
// 필요한 필드만 select
const { data } = await supabase
  .from('products')
  .select('id, name, price_per_hour, images')  // 필요한 것만
  .eq('status', 'active')
```

#### 3. 캐싱

```typescript
// Server Component에서 자동 캐싱
export const revalidate = 3600  // 1시간마다 재검증

export default async function ProductsPage() {
  const products = await getProductsServer()
  // ...
}
```

### 11.3 보안 체크리스트

```
✅ .env.local 파일이 .gitignore에 포함
✅ service_role key를 클라이언트에서 사용하지 않음
✅ 모든 테이블에 RLS 정책 활성화
✅ 관리자 작업은 서버 사이드에서만 실행
✅ 사용자 입력 검증
✅ SQL Injection 방지 (Supabase 자동 처리)
✅ XSS 방지 (React 자동 이스케이프)
✅ CSRF 방지 (Next.js 자동 처리)
```

---

## 12. 배포 및 운영

### 12.1 Vercel 배포

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 배포
vercel

# 4. 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_PORTONE_IMP_CODE
vercel env add PORTONE_API_KEY
vercel env add PORTONE_API_SECRET

# 5. 프로덕션 배포
vercel --prod
```

### 12.2 환경 변수 관리

**Vercel Dashboard에서 설정**:

```
Settings > Environment Variables

Production:
- NEXT_PUBLIC_SUPABASE_URL: https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJh...
- SUPABASE_SERVICE_ROLE_KEY: eyJh...
- NEXT_PUBLIC_PORTONE_IMP_CODE: imp12345678
- PORTONE_API_KEY: your_api_key
- PORTONE_API_SECRET: your_secret
- NEXT_PUBLIC_PAYMENT_ENV: production

Preview & Development:
- 동일하게 설정 (테스트 키 사용)
```

### 12.3 모니터링

#### 1. Vercel Analytics

```bash
# package.json에 추가
npm install @vercel/analytics

# app/layout.tsx에 추가
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### 2. Supabase Logs

```
Supabase Dashboard > Logs
- API Logs: API 요청 확인
- Postgres Logs: 쿼리 확인
- Auth Logs: 인증 로그
```

#### 3. Error Tracking (선택)

```bash
# Sentry 설치 (선택사항)
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 12.4 백업

#### 데이터베이스 백업

```bash
# Supabase CLI를 통한 백업
npx supabase db dump -f backup.sql

# 또는 Supabase Dashboard
# Settings > Database > Backups
```

### 12.5 업데이트 및 유지보수

#### 의존성 업데이트

```bash
# 1. 패키지 업데이트 확인
npm outdated

# 2. 업데이트
npm update

# 3. 메이저 버전 업데이트 (주의)
npm install <package>@latest

# 4. 테스트 후 배포
npm run build
npm run dev
```

#### 데이터베이스 마이그레이션

```bash
# 새 마이그레이션 추가
# supabase/migrations/008_add_new_feature.sql
CREATE TABLE new_table (...);

# Supabase SQL Editor에서 실행
```

---

## 📚 참고 문서

### 프로젝트 내부 문서

1. **`SUPABASE_SETUP.md`**: Supabase 초기 설정 가이드
2. **`COMPLETE_RESERVATION_FLOW.md`**: 예약 프로세스 완전 가이드
3. **`PAYMENT_INTEGRATION_COMPLETE.md`**: 결제 통합 가이드
4. **`ADMIN_ROLE_SETUP.md`**: 관리자 권한 설정
5. **`ADMIN_IMPLEMENTATION.md`**: 관리자 페이지 구현
6. **`PORTONE_INTEGRATION_GUIDE.md`**: PortOne 결제 연동
7. **`RLS_FIX_GUIDE.md`**: RLS 정책 문제 해결

### 외부 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [PortOne 개발자 문서](https://developers.portone.io/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

## 🎯 AI 개발 가이드 (Cursor/Claude용)

### AI에게 작업 요청 시 권장 패턴

#### ✅ 좋은 요청 예시

```
"상품 상세 페이지에 리뷰 기능을 추가해줘. 
요구사항:
1. 별점 1-5점
2. 댓글 작성
3. 본인이 예약했던 상품만 리뷰 작성 가능
4. 관리자는 부적절한 리뷰 삭제 가능

현재 프로젝트 구조를 따라서 구현해줘:
- 데이터베이스: supabase/migrations/
- API: src/lib/api/
- 컴포넌트: src/components/products/
- 타입: src/types/"
```

#### ❌ 모호한 요청 예시

```
"리뷰 기능 추가해줘"
```

### 코드 수정 시 주의사항

1. **기존 패턴 유지**: 프로젝트의 코딩 스타일 따르기
2. **타입 안전성**: TypeScript 타입 정의 사용
3. **에러 처리**: try-catch 블록 및 에러 메시지
4. **권한 체크**: 관리자/사용자 권한 확인
5. **RLS 정책**: 데이터베이스 보안 정책 고려

### 새 기능 추가 체크리스트

```
□ 데이터베이스 마이그레이션 (supabase/migrations/)
□ TypeScript 타입 정의 (src/types/)
□ API 함수 (src/lib/api/)
□ Server Actions (src/app/actions/)
□ 컴포넌트 (src/components/)
□ 페이지 통합 (src/app/)
□ RLS 정책 (Supabase SQL Editor)
□ 권한 체크 (middleware, layout)
□ 에러 처리
□ 로딩 상태
□ 반응형 디자인
□ 테스트
```

---

## 📞 문의 및 지원

프로젝트 관련 질문이나 이슈가 있으면:

1. **프로젝트 문서 확인**: `*.md` 파일들 참조
2. **코드 주석 확인**: 각 파일의 주석 읽기
3. **디버깅**: 콘솔 로그 및 개발자 도구 활용
4. **공식 문서**: Next.js, Supabase, PortOne 문서 참조

---

**최종 업데이트**: 2026-02-12  
**버전**: 1.0  
**작성자**: AI Development Team

이 문서는 프로젝트의 전체 구조와 개발 패턴을 이해하기 위한 종합 가이드입니다.
새로운 기능을 추가하거나 유지보수할 때 이 문서를 참고하여 일관성 있는 코드를 작성하세요.
