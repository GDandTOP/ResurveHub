# 회의실 예약 및 결제 프로세스 완전 가이드

## 📋 전체 프로세스 개요

```
사용자 여정:
홈페이지 → 상품 목록 → 상품 상세 → 예약 정보 입력 → 결제 → 예약 확정 → 마이페이지
```

## 1️⃣ 상품 목록 페이지

### 파일 위치
`src/app/products/page.tsx`

### 코드 구조

```typescript
// 서버 컴포넌트에서 상품 목록 조회
export default async function ProductsPage() {
  const products = await getProductsServer()
  
  return (
    <div>
      <ProductList products={products} />
    </div>
  )
}
```

### API 호출
**파일**: `src/lib/api/products.ts`

```typescript
export async function getProductsServer() {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    
  return data
}
```

### 화면 구성
- 상품 카드 그리드
- 각 카드: 이미지, 이름, 가격, 위치, 수용 인원
- 카드 클릭 시 상세 페이지로 이동

---

## 2️⃣ 상품 상세 페이지

### 파일 위치
`src/app/products/[id]/page.tsx`

### 코드 구조

```typescript
export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // 1. 상품 데이터 조회
  const dbProduct = await getProductByIdServer(id)
  
  if (!dbProduct) {
    notFound()
  }
  
  const product = dbProductToClientProduct(dbProduct)
  
  return (
    <div>
      {/* 왼쪽: 이미지 갤러리 */}
      <ProductGallery product={product} />
      
      {/* 오른쪽: 상품 정보 및 예약 버튼 */}
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div>{product.pricePerHour.toLocaleString()}원 / 시간</div>
        
        {/* 예약 폼 (Dialog) */}
        <ReservationForm product={product} />
      </div>
      
      {/* 하단: 이용 가능 시간 */}
      <AvailableTimeSlotView product={product} />
    </div>
  )
}
```

### 주요 컴포넌트

#### A. ProductGallery
```typescript
// 이미지 슬라이더
<ProductGallery product={product} />
```

#### B. ReservationForm (예약 다이얼로그)
```typescript
<ReservationForm product={product} />
// "예약하기" 버튼을 클릭하면 Dialog 오픈
```

#### C. AvailableTimeSlotView
```typescript
<AvailableTimeSlotView product={product} />
// 이번 주 / 월별 캘린더 보기
// 예약 가능/불가능 시간 시각화
```

---

## 3️⃣ 예약 정보 입력

### 파일 위치
`src/components/products/ReservationForm.tsx`

### Dialog 열기

```typescript
export function ReservationForm({ product }: ReservationFormProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          예약하기
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        {/* 예약 폼 */}
      </DialogContent>
    </Dialog>
  )
}
```

### 입력 필드

#### 1) 날짜 선택

```typescript
const [reservationDate, setReservationDate] = useState("")
const [showCalendar, setShowCalendar] = useState(false)
const [currentMonth, setCurrentMonth] = useState(new Date())

// 달력 생성
const generateCalendar = () => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  
  // 이전 달의 빈 칸
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // 현재 달의 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  
  return days
}

// 날짜 선택
const handleDateSelect = (date: Date) => {
  const dateString = date.toISOString().split('T')[0]
  setReservationDate(dateString)
  setShowCalendar(false)
}

// 과거 날짜 비활성화
const isDateDisabled = (date: Date | null) => {
  if (!date) return true
  return date < today
}
```

#### 2) 시간 선택

```typescript
const [startTime, setStartTime] = useState("")
const [endTime, setEndTime] = useState("")

// 시간 옵션 생성 (09:00 ~ 22:00)
const timeOptions = Array.from({ length: 14 }, (_, i) => {
  const hour = 9 + i
  return `${hour.toString().padStart(2, "0")}:00`
})

// 종료 시간은 시작 시간 이후만
const endTimeOptions = timeOptions.filter((time) => time > startTime)

// 시작 시간 변경 시 종료 시간 초기화
const handleStartTimeChange = (value: string) => {
  setStartTime(value)
  if (endTime && endTime <= value) {
    setEndTime("")
  }
}
```

#### 3) 인원 선택

```typescript
const [numberOfPeople, setNumberOfPeople] = useState(1)

<Select
  value={numberOfPeople.toString()}
  onValueChange={(value) => setNumberOfPeople(parseInt(value))}
>
  <SelectContent>
    {Array.from({ length: product.capacity }, (_, i) => i + 1).map(
      (num) => (
        <SelectItem key={num} value={num.toString()}>
          {num}명
        </SelectItem>
      )
    )}
  </SelectContent>
</Select>
```

#### 4) 총 금액 계산

```typescript
const calculateTotal = () => {
  if (!startTime || !endTime) return null
  
  const startHour = parseInt(startTime.split(":")[0])
  const endHour = parseInt(endTime.split(":")[0])
  const hours = endHour - startHour
  const totalPrice = hours * product.pricePerHour
  
  return { hours, totalPrice }
}

const total = calculateTotal()

// UI 표시
{total && (
  <div className="p-4 bg-accent rounded-lg">
    <div>예약 시간: {total.hours}시간</div>
    <div>이용 인원: {numberOfPeople}명</div>
    <div>시간당 가격: {product.pricePerHour.toLocaleString()}원</div>
    <div className="text-xl font-bold">
      총 금액: {total.totalPrice.toLocaleString()}원
    </div>
  </div>
)}
```

---

## 4️⃣ 예약 및 결제 프로세스

### handleSubmit 함수 전체 코드

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  
  // ===== 1단계: 유효성 검사 =====
  if (!reservationDate) {
    setError("날짜를 선택해주세요.")
    return
  }
  if (!startTime) {
    setError("시작 시간을 선택해주세요.")
    return
  }
  if (!endTime) {
    setError("종료 시간을 선택해주세요.")
    return
  }
  
  setLoading(true)
  
  // ===== 2단계: 금액 계산 =====
  const startHour = parseInt(startTime.split(":")[0])
  const endHour = parseInt(endTime.split(":")[0])
  const hours = endHour - startHour
  const totalPrice = hours * product.pricePerHour
  
  try {
    // ===== 3단계: 예약 생성 (pending 상태) =====
    const reservationResult = await createReservationAction({
      product_id: product.id,
      reservation_date: reservationDate,
      start_time: startTime,
      end_time: endTime,
      number_of_people: numberOfPeople,
      total_price: totalPrice,
      status: "pending",
    })
    
    if (!reservationResult.success || !reservationResult.data) {
      setError(reservationResult.error || "예약 생성에 실패했습니다.")
      setLoading(false)
      return
    }
    
    const reservationId = reservationResult.data.id
    const userEmail = reservationResult.data.user?.email || ""
    const userName = reservationResult.data.user?.name || "고객"
    
    // ===== 4단계: Dialog 닫기 (중요!) =====
    // Dialog 오버레이가 결제창을 가리지 않도록
    setOpen(false)
    setLoading(false)
    
    // ===== 5단계: 결제 프로세스 시작 =====
    // Dialog 애니메이션 완료 대기
    setTimeout(async () => {
      try {
        // ===== 6단계: 포트원 결제 요청 =====
        const paymentResult = await requestPayment({
          orderName: `${product.name} 예약`,
          totalAmount: totalPrice,
          customerEmail: userEmail,
          customerName: userName,
        })
        
        if (!paymentResult.success) {
          alert(`결제 실패: ${paymentResult.message || "알 수 없는 오류"}`)
          return
        }
        
        // ===== 7단계: 결제 검증 및 예약 확정 =====
        const verifyResult = await verifyAndProcessPayment({
          paymentId: paymentResult.paymentId!,
          amount: totalPrice,
          reservationId,
        })
        
        if (!verifyResult.success) {
          alert(`결제 검증 실패: ${verifyResult.error}`)
          return
        }
        
        // ===== 8단계: 완료 =====
        alert("결제 및 예약이 완료되었습니다!")
        router.push("/mypage")
        router.refresh()
      } catch (err) {
        console.error("결제 처리 오류:", err)
        alert(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.")
      }
    }, 300)
  } catch (err) {
    console.error("예약 생성 실패:", err)
    setError(err instanceof Error ? err.message : "예약 생성에 실패했습니다.")
    setLoading(false)
  }
}
```

---

## 5️⃣ Server Actions

### A. 예약 생성 (createReservationAction)

**파일**: `src/app/actions/reservations.ts`

```typescript
export async function createReservationAction(
  reservationData: Omit<InsertReservation, 'user_id'>
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // 1. 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }
    
    // 2. 예약 가능 여부 확인
    const isAvailable = await checkAvailability(
      reservationData.product_id,
      reservationData.reservation_date,
      reservationData.start_time,
      reservationData.end_time
    )
    
    if (!isAvailable) {
      return {
        success: false,
        error: '해당 시간대는 이미 예약되어 있습니다.'
      }
    }
    
    // 3. 예약 생성 (user_id 자동 추가)
    const reservation: InsertReservation = {
      ...reservationData,
      user_id: user.id
    }
    
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select(`
        *,
        user:users(email, name)
      `)
      .single()
    
    if (error) {
      return {
        success: false,
        error: error.message
      }
    }
    
    // 4. 캐시 무효화
    revalidatePath('/mypage')
    revalidatePath(`/products/${reservation.product_id}`)
    
    return {
      success: true,
      data: data as any
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 생성에 실패했습니다.'
    }
  }
}
```

#### 예약 가능 여부 확인

```typescript
async function checkAvailability(
  productId: string,
  date: string,
  startTime: string,
  endTime: string
) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('reservations')
    .select('id')
    .eq('product_id', productId)
    .eq('reservation_date', date)
    .in('status', ['pending', 'confirmed'])
    .or(`start_time.lte.${startTime},end_time.gte.${endTime}`)
  
  if (error) {
    throw new Error(error.message)
  }
  
  // 겹치는 예약이 없으면 true
  return data.length === 0
}
```

### B. 결제 요청 (requestPayment)

**파일**: `src/lib/payment/portone-client.ts`

```typescript
import * as PortOne from '@portone/browser-sdk/v2'

export async function requestPayment({
  orderName,
  totalAmount,
  customerEmail,
  customerName,
  customerPhone,
}: {
  orderName: string
  totalAmount: number
  customerEmail: string
  customerName: string
  customerPhone?: string
}) {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY
  
  if (!storeId || !channelKey) {
    throw new Error('포트원 설정이 올바르지 않습니다.')
  }
  
  // 고유한 결제 ID 생성
  const paymentId = `payment_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
  
  try {
    // 포트원 결제 요청
    const response = await PortOne.requestPayment({
      storeId,
      channelKey,
      paymentId,
      orderName,
      totalAmount,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD',
      customer: {
        fullName: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
      },
    })
    
    return {
      success: !response.code,
      paymentId,
      code: response.code,
      message: response.message,
      txId: response.txId,
    }
  } catch (error) {
    console.error('결제 요청 오류:', error)
    throw error
  }
}
```

### C. 결제 검증 (verifyAndProcessPayment)

**파일**: `src/app/actions/payment.ts`

```typescript
export async function verifyAndProcessPayment({
  paymentId,
  amount,
  reservationId,
}: {
  paymentId: string
  amount: number
  reservationId: string
}) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // 1. 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      }
    }
    
    // 2. 포트원 API로 결제 정보 조회
    const apiSecret = process.env.PORTONE_V2_API_SECRET
    
    if (!apiSecret) {
      return {
        success: false,
        error: '결제 시스템 설정 오류',
      }
    }
    
    const response = await fetch(
      `https://api.portone.io/payments/${paymentId}`,
      {
        headers: {
          Authorization: `PortOne ${apiSecret}`,
        },
      }
    )
    
    if (!response.ok) {
      return {
        success: false,
        error: '결제 정보 조회 실패',
      }
    }
    
    const paymentData = await response.json()
    
    // 3. 결제 금액 검증
    if (paymentData.amount?.total !== amount) {
      return {
        success: false,
        error: '결제 금액이 일치하지 않습니다.',
      }
    }
    
    // 4. 결제 상태 확인
    if (paymentData.status !== 'PAID') {
      return {
        success: false,
        error: '결제가 완료되지 않았습니다.',
      }
    }
    
    // 5. 예약 정보 조회
    const { data: reservation, error: reservationFetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .eq('user_id', user.id)
      .single()
    
    if (reservationFetchError || !reservation) {
      return {
        success: false,
        error: '예약 정보를 찾을 수 없습니다.',
      }
    }
    
    // 6. payments 테이블에 저장
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: reservationId,
        user_id: user.id,
        amount: amount,
        payment_method: 'card',
        payment_status: 'completed',
        transaction_id: paymentId,
        paid_at: new Date().toISOString(),
      })
    
    if (paymentError) {
      console.error('결제 정보 저장 오류:', paymentError)
      return {
        success: false,
        error: '결제 정보 저장 실패',
      }
    }
    
    // 7. 예약 상태를 confirmed로 업데이트
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)
    
    if (updateError) {
      console.error('예약 상태 업데이트 오류:', updateError)
      return {
        success: false,
        error: '예약 상태 업데이트 실패',
      }
    }
    
    // 8. 캐시 무효화
    revalidatePath('/mypage')
    revalidatePath(`/products/${reservation.product_id}`)
    
    return {
      success: true,
      message: '결제가 완료되었습니다.',
    }
  } catch (error) {
    console.error('결제 검증 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.',
    }
  }
}
```

---

## 6️⃣ 데이터베이스 테이블

### reservations 테이블

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  user_id UUID NOT NULL REFERENCES users(id),
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  number_of_people INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, confirmed, cancelled, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### payments 테이블

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,  -- card, trans, vbank, etc.
  payment_status TEXT NOT NULL DEFAULT 'pending',  -- pending, completed, failed, refunded
  transaction_id TEXT,  -- 포트원 paymentId
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7️⃣ 마이페이지 (예약 확인)

### 파일 위치
`src/app/mypage/page.tsx`

```typescript
export default async function MyPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // 사용자의 예약 목록 조회
  const reservations = await getUserReservations()
  
  return (
    <div>
      <MyPageContent user={user} reservations={reservations} />
    </div>
  )
}
```

### 예약 목록 조회

**파일**: `src/lib/api/reservations.ts`

```typescript
export async function getUserReservations(): Promise<ReservationWithDetails[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('reservation_date', { ascending: false })
    .order('start_time', { ascending: false })
  
  if (error) {
    console.error('예약 목록 조회 오류:', error)
    return []
  }
  
  return data as unknown as ReservationWithDetails[]
}
```

### 예약 카드 표시

**파일**: `src/components/mypage/ReservationCard.tsx`

```typescript
export function ReservationCard({ reservation }: ReservationCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: '확정', className: 'bg-green-100 text-green-800' },
      cancelled: { label: '취소됨', className: 'bg-red-100 text-red-800' },
      completed: { label: '완료', className: 'bg-gray-100 text-gray-800' }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    
    return (
      <span className={`px-3 py-1 rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }
  
  return (
    <Card>
      <div className="md:flex">
        <Image src={reservation.product.images[0]} alt={reservation.product.name} />
        
        <div className="p-6">
          <h3>{reservation.product.name}</h3>
          {getStatusBadge(reservation.status)}
          
          <div>
            <Calendar /> {formatDate(reservation.reservation_date)}
            <Clock /> {reservation.start_time} - {reservation.end_time}
            <Users /> {reservation.number_of_people}명
            <CreditCard /> {reservation.total_price.toLocaleString()}원
          </div>
          
          {canCancel && (
            <Button onClick={handleCancel}>예약 취소</Button>
          )}
        </div>
      </div>
    </Card>
  )
}
```

---

## 8️⃣ 전체 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    1. 사용자가 상품 클릭                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              2. 상품 상세 페이지 (Server Component)           │
│  - getProductByIdServer(id)                                 │
│  - Supabase에서 상품 정보 조회                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            3. "예약하기" 버튼 클릭 → Dialog 열림              │
│  - ReservationForm 컴포넌트                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              4. 예약 정보 입력 (Client Component)            │
│  - 날짜 선택 (커스텀 캘린더)                                 │
│  - 시간 선택 (시작/종료)                                     │
│  - 인원 선택                                                 │
│  - 총 금액 자동 계산                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│        5. "💳 결제 및 예약하기" 버튼 클릭 → handleSubmit     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              6. createReservationAction (Server)             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ A. 사용자 인증 확인                                    │ │
│  │    - supabase.auth.getUser()                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ B. 예약 가능 여부 확인                                 │ │
│  │    - checkAvailability()                              │ │
│  │    - 시간대 겹침 확인                                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ C. reservations 테이블에 INSERT                        │ │
│  │    - status: 'pending'                                │ │
│  │    - user_id: 자동 추가                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ D. 사용자 정보와 함께 반환                             │ │
│  │    - reservation.id                                   │ │
│  │    - user.email, user.name                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   7. Dialog 닫기 (중요!)                     │
│  - setOpen(false)                                           │
│  - Dialog 오버레이가 결제창을 가리지 않도록                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              8. 300ms 대기 (애니메이션 완료)                  │
│  - setTimeout(..., 300)                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                9. requestPayment (포트원 SDK)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ A. 고유한 paymentId 생성                              │ │
│  │    - payment_${timestamp}_${random}                   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ B. PortOne.requestPayment() 호출                      │ │
│  │    - storeId, channelKey                              │ │
│  │    - orderName, totalAmount                           │ │
│  │    - customer 정보                                     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ C. 결제창 팝업 (사용자가 결제 진행)                    │ │
│  │    - 카드 정보 입력                                    │ │
│  │    - 결제 버튼 클릭                                    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ D. 결제 결과 반환                                      │ │
│  │    - success, paymentId, message                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         10. verifyAndProcessPayment (Server Action)          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ A. 포트원 API로 결제 정보 조회                         │ │
│  │    - GET https://api.portone.io/payments/{paymentId} │ │
│  │    - Authorization: PortOne {apiSecret}               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ B. 결제 금액 검증                                      │ │
│  │    - paymentData.amount.total === amount              │ │
│  │    - 위변조 방지                                       │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ C. 결제 상태 확인                                      │ │
│  │    - paymentData.status === 'PAID'                    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ D. payments 테이블에 INSERT                            │ │
│  │    - reservation_id, user_id                          │ │
│  │    - amount, payment_method                           │ │
│  │    - payment_status: 'completed'                      │ │
│  │    - transaction_id: paymentId                        │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ E. reservations 상태 UPDATE                            │ │
│  │    - status: 'pending' → 'confirmed'                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ F. 캐시 무효화                                         │ │
│  │    - revalidatePath('/mypage')                        │ │
│  │    - revalidatePath('/products/[id]')                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   11. 성공 알림 및 리다이렉트                 │
│  - alert("결제 및 예약이 완료되었습니다!")                    │
│  - router.push("/mypage")                                   │
│  - router.refresh()                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   12. 마이페이지 표시                         │
│  - getUserReservations()                                    │
│  - 예약 목록에 confirmed 상태로 표시                          │
│  - 예약 카드: 상품 정보, 날짜, 시간, 금액                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 9️⃣ 에러 처리

### 예약 생성 실패
```typescript
if (!reservationResult.success) {
  setError("예약 생성에 실패했습니다.")
  setLoading(false)
  return  // Dialog는 열린 상태 유지
}
```

### 결제 실패
```typescript
if (!paymentResult.success) {
  alert("결제 실패: " + paymentResult.message)
  // Dialog는 이미 닫힌 상태
  // 사용자가 다시 시도 가능
  // 예약은 pending 상태로 남아있음
}
```

### 결제 검증 실패
```typescript
if (!verifyResult.success) {
  alert("결제 검증 실패: " + verifyResult.error)
  // 예약은 pending 상태
  // 관리자가 수동으로 확인 필요
}
```

---

## 🔟 보안 고려사항

### 1. 서버 측 검증
```typescript
// ✅ 서버에서 모든 검증 수행
- 사용자 인증
- 예약 가능 여부
- 결제 금액 검증
- 결제 상태 확인
```

### 2. 금액 위변조 방지
```typescript
// 클라이언트에서 계산
const totalPrice = hours * product.pricePerHour

// 서버에서 재계산 및 검증
if (paymentData.amount.total !== amount) {
  return { success: false, error: '금액 불일치' }
}
```

### 3. API Secret 보호
```typescript
// ❌ 클라이언트에 노출되면 안됨
PORTONE_V2_API_SECRET=xxx

// ✅ 서버에서만 사용
const apiSecret = process.env.PORTONE_V2_API_SECRET
```

---

이것이 회의실 예약 및 결제의 전체 프로세스입니다! 🎉
