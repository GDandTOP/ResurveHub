# 🚀 Supabase 연동 완료 가이드

Supabase 연동을 위한 모든 코드가 준비되었습니다!
아래 단계를 따라 설정을 완료하세요.

## ✅ 완료된 작업

- [x] Supabase 패키지 설치 (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] 환경 변수 파일 생성 (`.env.local`)
- [x] Supabase 클라이언트 설정 (클라이언트/서버)
- [x] TypeScript 타입 정의
- [x] 인증 함수 구현
- [x] API 함수 구현 (Products, Reservations, Payments)
- [x] 미들웨어 설정
- [x] SQL 마이그레이션 스크립트 생성

## 📝 설정 단계

### 1단계: Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 정보:
   - **이름**: 원하는 프로젝트 이름
   - **비밀번호**: 안전한 비밀번호 설정 (잘 보관하세요!)
   - **리전**: Northeast Asia (Seoul) 선택
3. 약 2분 대기 (프로젝트 생성 중...)

### 2단계: API 키 설정

1. Supabase Dashboard → `Settings` → `API`로 이동
2. 다음 값들을 복사:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJh...
service_role key: eyJh...
```

3. 프로젝트 루트의 `.env.local` 파일을 열고 값 입력:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

⚠️ **중요**: `service_role key`는 절대 클라이언트 코드에 노출하지 마세요!

### 3단계: 데이터베이스 테이블 생성

1. Supabase Dashboard → `SQL Editor` 이동
2. "New Query" 클릭
3. 다음 순서대로 SQL 파일 내용을 복사하여 실행:

#### 3-1. 테이블 생성
```sql
-- supabase/migrations/001_create_tables.sql 파일 내용 복사
-- "Run" 버튼 클릭
```

#### 3-2. Row Level Security 설정
```sql
-- supabase/migrations/002_row_level_security.sql 파일 내용 복사
-- "Run" 버튼 클릭
```

#### 3-3. 테스트 데이터 삽입 (선택사항)
```sql
-- supabase/migrations/003_seed_data.sql 파일 내용 복사
-- "Run" 버튼 클릭
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 5단계: 관리자 계정 생성 (필요시)

1. 애플리케이션에서 회원가입
2. Supabase Dashboard → `Table Editor` → `users` 테이블
3. 해당 사용자의 `role` 컬럼을 `admin`으로 변경
4. 저장 후 로그아웃/로그인

## 📂 생성된 파일 구조

```
project/
├── .env.local                          # 환경 변수 (실제 값 입력 필요)
├── .env.local.example                  # 환경 변수 템플릿
├── middleware.ts                       # Next.js 미들웨어
├── src/
│   ├── lib/
│   │   ├── auth.ts                    # 인증 함수
│   │   ├── supabase/
│   │   │   ├── client.ts              # 브라우저용 클라이언트
│   │   │   ├── server.ts              # 서버용 클라이언트
│   │   │   └── middleware.ts          # 미들웨어 헬퍼
│   │   └── api/
│   │       ├── products.ts            # 상품 API
│   │       ├── reservations.ts        # 예약 API
│   │       └── payments.ts            # 결제 API
│   └── types/
│       ├── supabase.ts                # Supabase 타입
│       └── database.ts                # 데이터베이스 유틸리티 타입
└── supabase/
    ├── README.md                       # Supabase 설정 가이드
    └── migrations/
        ├── 001_create_tables.sql      # 테이블 생성 SQL
        ├── 002_row_level_security.sql # RLS 정책 SQL
        └── 003_seed_data.sql          # 테스트 데이터 SQL
```

## 🔨 사용 예제

### 클라이언트 컴포넌트에서 상품 조회

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/api/products'
import type { Product } from '@/types/database'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>로딩 중...</div>

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>₩{product.price_per_hour.toLocaleString()}/시간</p>
        </div>
      ))}
    </div>
  )
}
```

### 서버 컴포넌트에서 상품 조회

```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')

  if (error) {
    return <div>상품을 불러올 수 없습니다.</div>
  }

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 회원가입 예제

```typescript
'use client'

import { signUp } from '@/lib/auth'
import { useState } from 'react'

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      )
      alert('회원가입 성공!')
      // 로그인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert('회원가입에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="text"
        placeholder="이름"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="tel"
        placeholder="전화번호"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <button type="submit">회원가입</button>
    </form>
  )
}
```

### 예약 생성 예제

```typescript
import { createReservation } from '@/lib/api/reservations'

const handleReservation = async () => {
  try {
    const reservation = await createReservation({
      product_id: 'product-uuid',
      user_id: 'user-uuid',
      reservation_date: '2024-03-15',
      start_time: '14:00',
      end_time: '16:00',
      number_of_people: 4,
      total_price: 20000,
      status: 'pending'
    })
    
    console.log('예약 완료:', reservation)
  } catch (error) {
    console.error('예약 실패:', error)
  }
}
```

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `service_role key`를 클라이언트 코드에서 사용하지 않는지 확인
- [ ] RLS 정책이 모든 테이블에 활성화되어 있는지 확인
- [ ] 관리자 작업은 서버 사이드에서만 실행되는지 확인

## 🎯 다음 단계

### 1. Storage 설정 (이미지 업로드)

Supabase Dashboard → Storage:
1. "New Bucket" 클릭
2. 이름: `product-images`
3. Public 활성화
4. 저장

코드 예제:
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const uploadImage = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`${Date.now()}-${file.name}`, file)
    
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)
    
  return publicUrl
}
```

### 2. Realtime 구독 (선택사항)

예약 상태를 실시간으로 업데이트:

```typescript
const supabase = createClient()

const channel = supabase
  .channel('reservations')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'reservations'
    },
    (payload) => {
      console.log('예약 변경:', payload)
    }
  )
  .subscribe()
```

### 3. 결제 시스템 연동

- 토스페이먼츠
- 카카오페이
- 네이버페이

## 📚 추가 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js App Router 가이드](https://nextjs.org/docs/app)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## ❓ 문제 해결

### "Invalid API key" 에러
- `.env.local` 파일의 API 키가 올바른지 확인
- 개발 서버를 재시작 (`npm run dev`)

### "relation does not exist" 에러
- SQL 마이그레이션이 올바른 순서로 실행되었는지 확인
- Supabase Dashboard → Table Editor에서 테이블이 생성되었는지 확인

### RLS 정책 에러
- Supabase Dashboard → Authentication → Policies에서 정책 확인
- 로그인된 사용자로 작업하고 있는지 확인

### 미들웨어 관련 에러
- `middleware.ts` 파일이 프로젝트 루트에 있는지 확인
- Next.js 버전이 13.4 이상인지 확인

## 🎉 축하합니다!

Supabase 연동이 완료되었습니다. 이제 본격적으로 예약 플랫폼을 개발할 수 있습니다!

질문이 있거나 문제가 발생하면 이슈를 등록하거나 Supabase Discord에 문의하세요.
