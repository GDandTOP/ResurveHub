# 관리자 페이지 개발 요구사항

## 프로젝트 개요
Next.js App Router 기반 관리자 페이지 개발

## 기술 스택
- **Framework**: Next.js 16.1.6 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **UI 컴포넌트**: Radix UI, Shadcn UI
- **상태관리**: React Server Components 우선, 필요시 Zustand
- **데이터베이스**: Supabase
- **결제**: PortOne SDK
- **인증**: Supabase Auth

## 폴더 구조

```
src/app/admin/
├── layout.tsx                    # 관리자 레이아웃 (사이드바, 네비게이션)
├── page.tsx                      # 대시보드 메인
├── dashboard/                    # 대시보드
│   └── page.tsx                 # 주요 지표 요약
├── products/                     # 상품 관리
│   ├── page.tsx                 # 상품 목록
│   ├── new/
│   │   └── page.tsx             # 상품 등록
│   └── [id]/
│       ├── page.tsx             # 상품 상세/수정
│       └── edit/
│           └── page.tsx         # 상품 편집
├── reservations/                 # 예약 관리
│   ├── page.tsx                 # 예약 목록 (캘린더 뷰)
│   ├── calendar/
│   │   └── page.tsx             # 캘린더 전용 페이지
│   └── [id]/
│       └── page.tsx             # 예약 상세
├── payments/                     # 결제 관리
│   ├── page.tsx                 # 결제 목록
│   └── [id]/
│       └── page.tsx             # 결제 상세
└── analytics/                    # 통계 및 분석
    ├── page.tsx                 # 통합 통계
    ├── sales/
    │   └── page.tsx             # 매출 분석
    └── reservations/
        └── page.tsx             # 예약 통계

src/components/admin/
├── common/                       # 공통 컴포넌트
│   ├── AdminHeader.tsx          # 관리자 헤더
│   ├── AdminSidebar.tsx         # 사이드바 네비게이션
│   ├── Breadcrumb.tsx           # 경로 표시
│   └── LoadingState.tsx         # 로딩 상태
├── products/                     # 상품 관리 컴포넌트
│   ├── ProductTable.tsx         # 상품 테이블
│   ├── ProductForm.tsx          # 상품 등록/수정 폼
│   ├── ProductFilters.tsx       # 필터 (카테고리, 상태)
│   └── ProductActions.tsx       # 액션 버튼 (삭제, 활성화)
├── reservations/                 # 예약 관리 컴포넌트
│   ├── ReservationCalendar.tsx # 예약 캘린더
│   ├── ReservationTable.tsx    # 예약 목록 테이블
│   ├── ReservationDetail.tsx   # 예약 상세
│   └── TimeSlotManager.tsx     # 시간대 관리
├── payments/                     # 결제 관리 컴포넌트
│   ├── PaymentTable.tsx         # 결제 목록
│   ├── PaymentStatusBadge.tsx  # 결제 상태 뱃지
│   └── RefundModal.tsx          # 환불 모달
└── analytics/                    # 통계 컴포넌트
    ├── SalesChart.tsx           # 매출 차트
    ├── ReservationChart.tsx     # 예약 통계 차트
    ├── MetricCard.tsx           # 지표 카드
    └── DateRangePicker.tsx      # 기간 선택기
```

## 주요 기능 상세

### 1. 상품 CRUD 인터페이스 (`/admin/products`)

#### 기능 요구사항
- **목록 (List)**: 
  - 상품명, 가격, 카테고리, 상태(활성/비활성), 등록일
  - 검색 (상품명, 카테고리)
  - 필터링 (상태, 카테고리)
  - 정렬 (가격, 등록일, 인기도)
  - 페이지네이션

- **등록 (Create)**:
  - 상품명, 설명, 카테고리
  - 가격 (기본가, 할인가)
  - 이미지 업로드 (다중)
  - 재고 관리
  - 예약 가능 시간대 설정
  - 상태 (활성/비활성)

- **수정 (Update)**:
  - 모든 상품 정보 수정
  - 이미지 추가/삭제
  - 히스토리 관리

- **삭제 (Delete)**:
  - 소프트 삭제 (실제 삭제 X, 상태만 변경)
  - 예약이 있는 상품은 삭제 불가 경고

#### 데이터베이스 스키마
```typescript
// Supabase Table: products
{
  id: string (uuid)
  name: string
  description: text
  category: string
  price: number
  discount_price: number?
  images: string[] (URLs)
  stock: number
  status: 'active' | 'inactive'
  available_times: json
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp?
}
```

#### API 엔드포인트 (Server Actions)
```typescript
// src/app/actions/admin/products.ts
- createProduct()
- updateProduct()
- deleteProduct()
- getProducts()
- getProductById()
```

---

### 2. 캘린더 기반 예약 관리 (`/admin/reservations`)

#### 기능 요구사항
- **캘린더 뷰**:
  - 월간 / 주간 / 일간 뷰 전환
  - 날짜별 예약 수 표시
  - 예약 클릭 → 상세 정보 모달
  - 드래그 앤 드롭으로 예약 시간 변경

- **예약 목록**:
  - 고객명, 상품명, 예약일시, 상태, 결제 상태
  - 필터 (상태: 대기/확정/취소/완료)
  - 검색 (고객명, 상품명, 예약번호)
  - 날짜 범위 필터

- **예약 상세**:
  - 고객 정보 (이름, 연락처, 이메일)
  - 상품 정보
  - 예약 시간
  - 결제 정보
  - 특이사항/메모
  - 상태 변경 (확정/취소/완료)

- **시간대 관리**:
  - 상품별 예약 가능 시간대 설정
  - 휴무일 설정
  - 시간대별 예약 제한 수 설정

#### 데이터베이스 스키마
```typescript
// Supabase Table: reservations
{
  id: string (uuid)
  user_id: string (fk)
  product_id: string (fk)
  reservation_date: date
  time_slot: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_id: string?
  note: text?
  created_at: timestamp
  updated_at: timestamp
}

// Supabase Table: time_slots
{
  id: string (uuid)
  product_id: string (fk)
  day_of_week: number (0-6)
  start_time: time
  end_time: time
  max_reservations: number
  is_available: boolean
}

// Supabase Table: holidays
{
  id: string (uuid)
  date: date
  description: string
  product_id: string? (null이면 전체 휴무)
}
```

#### API 엔드포인트 (Server Actions)
```typescript
// src/app/actions/admin/reservations.ts
- getReservations()
- getReservationById()
- updateReservationStatus()
- cancelReservation()
- getCalendarData()
- updateTimeSlot()
- addHoliday()
```

---

### 3. 결제 상태 관리 페이지 (`/admin/payments`)

#### 기능 요구사항
- **결제 목록**:
  - 주문번호, 고객명, 상품명, 금액, 결제수단, 상태, 결제일시
  - 필터 (결제 상태, 결제수단, 날짜 범위)
  - 검색 (주문번호, 고객명)
  - 총 결제금액 표시

- **결제 상세**:
  - 주문 정보
  - 결제 정보 (PG사, 승인번호, 결제수단)
  - 고객 정보
  - 예약 정보 연결
  - 결제 로그 (결제 시도 이력)

- **결제 관리**:
  - 환불 처리
  - 부분 환불
  - 결제 취소
  - 수동 결제 확인

#### 데이터베이스 스키마
```typescript
// Supabase Table: payments
{
  id: string (uuid)
  order_id: string (unique)
  user_id: string (fk)
  reservation_id: string (fk)
  amount: number
  payment_method: string
  pg_provider: string
  pg_transaction_id: string?
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
  refund_amount: number?
  refund_reason: string?
  paid_at: timestamp?
  created_at: timestamp
  updated_at: timestamp
}

// Supabase Table: payment_logs
{
  id: string (uuid)
  payment_id: string (fk)
  action: string
  status: string
  message: text?
  created_at: timestamp
}
```

#### API 엔드포인트 (Server Actions)
```typescript
// src/app/actions/admin/payments.ts
- getPayments()
- getPaymentById()
- processRefund()
- cancelPayment()
- getPaymentLogs()
```

---

### 4. 매출 / 예약 통계 시각화 (`/admin/analytics`)

#### 기능 요구사항
- **대시보드 지표**:
  - 오늘의 예약 수
  - 오늘의 매출
  - 이번 달 총 매출
  - 이번 달 예약 수
  - 전월 대비 증감률

- **매출 분석**:
  - 일별/주별/월별 매출 그래프
  - 상품별 매출 비율 (파이 차트)
  - 결제수단별 통계
  - 기간별 비교 (전년 동기 대비)

- **예약 통계**:
  - 일별/주별/월별 예약 수 그래프
  - 상품별 예약 수
  - 시간대별 예약 분포
  - 예약 상태별 분포
  - 취소율 분석

- **고객 분석**:
  - 신규 고객 vs 재방문 고객
  - 고객별 예약 이력
  - 인기 상품 TOP 10

#### 차트 라이브러리
- **추천**: Recharts (React 친화적, 경량)
- 대안: Chart.js, Victory, Nivo

#### 데이터 집계
```typescript
// Server Actions에서 집계 쿼리 실행
// src/app/actions/admin/analytics.ts
- getDashboardMetrics()
- getSalesData(dateRange, groupBy)
- getReservationStats(dateRange, groupBy)
- getProductRanking()
- getCustomerAnalytics()
```

---

## 인증 및 권한 관리

### 관리자 권한 확인
```typescript
// middleware.ts 또는 layout.tsx
- 관리자만 /admin 경로 접근 가능
- Supabase RLS 정책으로 데이터 보호
```

### 사용자 역할
```typescript
// Supabase Table: profiles
{
  id: string (uuid, fk to auth.users)
  role: 'user' | 'admin' | 'super_admin'
  ...
}
```

---

## UI/UX 가이드라인

### 레이아웃
- **사이드바**: 좌측 고정, 접기/펼치기 기능
- **헤더**: 사용자 정보, 알림, 로그아웃
- **Breadcrumb**: 현재 위치 표시

### 디자인 시스템
- **Tailwind CSS**: 일관된 스타일
- **Shadcn UI**: Button, Table, Modal, Select 등
- **Radix UI**: Accessible UI 컴포넌트
- **반응형**: 모바일/태블릿 대응

### 컬러 스킴
```css
/* Tailwind 커스텀 색상 */
admin: {
  primary: '#3b82f6',    // 파란색
  success: '#10b981',    // 초록색
  warning: '#f59e0b',    // 주황색
  danger: '#ef4444',     // 빨간색
  neutral: '#6b7280'     // 회색
}
```

---

## 성능 최적화

### React Server Components
- 가능한 모든 컴포넌트를 RSC로 구현
- 'use client'는 최소화 (인터랙션 필요한 컴포넌트만)

### 데이터 페칭
- Suspense + Loading UI
- Parallel data fetching
- ISR (Incremental Static Regeneration) 활용

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷
- 지연 로딩

---

## 보안 고려사항

### 데이터 보호
- Supabase Row Level Security (RLS)
- 관리자만 읽기/쓰기 가능한 정책

### 입력 검증
- Zod 스키마 검증
- SQL Injection 방지
- XSS 방지 (입력 sanitize)

### 인증
- Supabase Auth 세션 확인
- 토큰 만료 처리
- CSRF 보호

---

## 개발 단계

### Phase 1: 기본 구조
1. 폴더 구조 생성
2. 관리자 레이아웃 구현
3. 사이드바 네비게이션
4. 인증 미들웨어

### Phase 2: 상품 관리
1. 상품 목록 페이지
2. 상품 등록 폼
3. 상품 수정 페이지
4. 이미지 업로드

### Phase 3: 예약 관리
1. 예약 목록
2. 캘린더 컴포넌트
3. 예약 상세
4. 시간대 관리

### Phase 4: 결제 관리
1. 결제 목록
2. 결제 상세
3. 환불 기능

### Phase 5: 통계 대시보드
1. 대시보드 지표
2. 매출 차트
3. 예약 통계
4. 필터 및 기간 선택

---

## 테스트

### 단위 테스트
- Server Actions 테스트
- 유틸리티 함수 테스트

### 통합 테스트
- API 엔드포인트 테스트
- 데이터베이스 쿼리 테스트

### E2E 테스트
- 주요 사용자 플로우
- Playwright 사용 권장

---

## 문서화

### 코드 주석
- 복잡한 로직에 JSDoc 주석
- 타입 정의 명확히

### README
- 관리자 페이지 사용 가이드
- 개발 환경 설정
- 배포 방법

---

## 참고 자료

### Next.js 공식 문서
- App Router: https://nextjs.org/docs/app
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

### Supabase 문서
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

### UI 라이브러리
- Shadcn UI: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/

### 차트 라이브러리
- Recharts: https://recharts.org/
- Chart.js: https://www.chartjs.org/

---

## Cursor / Claude 개발 가이드

### AI 활용 전략

#### 1. 컴포넌트 생성 시
```plaintext
프롬프트 예시:
"Next.js App Router 환경에서 관리자용 상품 테이블 컴포넌트를 만들어줘.
- TypeScript 사용
- Shadcn UI Table 컴포넌트 활용
- 검색, 필터링, 정렬 기능 포함
- Server Component로 구현
- Supabase에서 데이터 가져오기"
```

#### 2. Server Actions 작성 시
```plaintext
프롬프트 예시:
"상품 CRUD Server Actions를 작성해줘.
- src/app/actions/admin/products.ts 파일에
- Supabase 클라이언트 사용
- 에러 핸들링 포함
- 타입 안전성 보장
- RLS 정책 고려"
```

#### 3. 페이지 구현 시
```plaintext
프롬프트 예시:
"/admin/products 페이지를 만들어줘.
- ProductTable 컴포넌트 사용
- Suspense로 로딩 처리
- Breadcrumb 추가
- 상품 등록 버튼 (new 페이지로 이동)"
```

#### 4. 스타일링 시
```plaintext
프롬프트 예시:
"관리자 사이드바를 만들어줘.
- Tailwind CSS 사용
- 반응형 (모바일에서 햄버거 메뉴)
- 현재 페이지 하이라이트
- 아이콘은 lucide-react 사용"
```

### 단계별 개발 플로우

#### Step 1: 데이터베이스 스키마 설정
```plaintext
1. Supabase 테이블 생성 SQL 생성 요청
2. RLS 정책 생성
3. TypeScript 타입 정의 생성
```

#### Step 2: 서버 액션 구현
```plaintext
1. CRUD 기능별로 Server Actions 작성
2. 에러 처리 및 검증 로직 추가
3. 타입 안전성 확보
```

#### Step 3: UI 컴포넌트 구현
```plaintext
1. 공통 컴포넌트 (레이아웃, 사이드바)
2. 페이지별 컴포넌트
3. 재사용 가능한 컴포넌트
```

#### Step 4: 페이지 구성
```plaintext
1. 라우트별 page.tsx 생성
2. 레이아웃 적용
3. 데이터 페칭 및 표시
```

#### Step 5: 통합 및 테스트
```plaintext
1. 기능 테스트
2. 반응형 확인
3. 에러 케이스 처리
```

### AI 프롬프트 팁

#### 명확한 요구사항
- 사용할 기술 스택 명시
- 파일 경로 지정
- 원하는 기능 상세히 설명

#### 점진적 개발
- 한 번에 하나의 기능만 요청
- 큰 기능은 단계별로 분할
- 각 단계 완료 후 검토

#### 코드 스타일 유지
- user_rules에 정의된 스타일 준수
- Standard.js 규칙 강조
- 함수형 컴포넌트 사용

#### 에러 처리
- 에러 발생 시 명확히 설명
- 수정 방향 제시
- 대안 요청

### 예시 프롬프트 모음

#### 레이아웃 생성
```plaintext
"관리자 페이지 레이아웃을 만들어줘.
- src/app/admin/layout.tsx
- 좌측 사이드바, 상단 헤더
- 사이드바 메뉴: Dashboard, Products, Reservations, Payments, Analytics
- AdminSidebar와 AdminHeader 컴포넌트 분리
- 모바일 반응형"
```

#### 테이블 컴포넌트
```plaintext
"상품 목록 테이블을 만들어줘.
- src/components/admin/products/ProductTable.tsx
- Shadcn UI Table 사용
- 컬럼: 이미지, 상품명, 카테고리, 가격, 상태, 등록일, 액션
- 검색, 필터, 정렬 기능
- 페이지네이션
- Server Component"
```

#### 폼 컴포넌트
```plaintext
"상품 등록 폼을 만들어줘.
- src/components/admin/products/ProductForm.tsx
- 필드: name, description, category, price, discount_price, images, stock
- Shadcn UI Form 컴포넌트
- 이미지 업로드 (다중)
- 유효성 검사 (Zod)
- Server Action 연동"
```

#### 캘린더 컴포넌트
```plaintext
"예약 관리 캘린더를 만들어줘.
- src/components/admin/reservations/ReservationCalendar.tsx
- react-day-picker 사용
- 날짜별 예약 수 표시
- 예약 클릭 시 모달 표시
- 월간 뷰
- 스타일은 Tailwind로"
```

#### 차트 컴포넌트
```plaintext
"매출 차트를 만들어줘.
- src/components/admin/analytics/SalesChart.tsx
- Recharts 사용
- 라인 차트 (일별 매출)
- X축: 날짜, Y축: 금액
- 툴팁, 범례 포함
- 반응형"
```

### 트러블슈팅 가이드

#### 빌드 에러
```plaintext
"빌드 에러가 발생했어.
[에러 메시지 붙여넣기]
어떻게 수정하면 될까?"
```

#### 타입 에러
```plaintext
"TypeScript 타입 에러가 있어.
[에러 메시지]
타입 정의를 수정해줘."
```

#### 스타일 이슈
```plaintext
"레이아웃이 깨져.
[스크린샷 또는 설명]
반응형 스타일을 수정해줘."
```

#### 성능 문제
```plaintext
"페이지 로딩이 느려.
[느린 부분 설명]
최적화 방법을 제안해줘."
```

### 베스트 프랙티스

#### 1. 파일 구조 일관성
- 한 파일에 하나의 주요 컴포넌트
- 관련 타입은 같은 파일에
- 유틸리티는 별도 파일

#### 2. 명명 규칙
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 파일명: kebab-case (폴더) / PascalCase (컴포넌트)

#### 3. 코드 재사용
- 공통 컴포넌트 식별
- 유틸리티 함수 분리
- 커스텀 훅 활용

#### 4. 타입 안전성
- any 사용 금지
- 명시적 타입 정의
- Zod로 런타임 검증

#### 5. 에러 처리
- try-catch 블록
- 사용자 친화적 에러 메시지
- 로깅

---

## 체크리스트

### 개발 시작 전
- [ ] Supabase 프로젝트 설정
- [ ] 환경변수 설정 (.env.local)
- [ ] 데이터베이스 스키마 생성
- [ ] RLS 정책 설정
- [ ] 관리자 계정 생성

### Phase별 체크리스트
- [ ] Phase 1: 레이아웃 구현
- [ ] Phase 2: 상품 관리 완료
- [ ] Phase 3: 예약 관리 완료
- [ ] Phase 4: 결제 관리 완료
- [ ] Phase 5: 통계 대시보드 완료

### 배포 전
- [ ] 빌드 테스트
- [ ] 타입 체크
- [ ] Lint 통과
- [ ] 주요 기능 테스트
- [ ] 반응형 확인
- [ ] 보안 검토

---

## 추가 고려사항

### 알림 시스템
- 새 예약 알림
- 결제 완료 알림
- 취소 알림

### 로그 시스템
- 관리자 액션 로그
- 시스템 에러 로그
- 감사 추적

### 백업 및 복구
- 데이터 백업 전략
- 복구 절차

### 확장성
- 멀티 테넌시 고려
- 권한 세분화
- API 버전 관리

---

이 문서를 기반으로 Cursor와 Claude를 활용하여 단계별로 개발을 진행하세요.
각 단계마다 명확한 프롬프트를 작성하고, 생성된 코드를 검토하며 진행하면 효율적으로 개발할 수 있습니다.
