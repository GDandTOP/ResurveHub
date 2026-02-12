# 예약 취소 및 결제 환불 시스템 통합 완료

## 📋 개요

관리자 예약 관리 페이지와 사용자 마이페이지에서 예약 취소 시 포트원(PortOne) 결제 취소 API를 자동으로 호출하여 환불 처리하는 기능이 완성되었습니다.

## ✨ 주요 기능

### 1. **관리자 예약 취소 (환불 포함)**
- 위치: `/admin/reservations`
- 기능:
  - 예약 취소 시 자동으로 포트원 결제 취소 API 호출
  - 결제 상태를 `refunded`로 변경
  - 예약 상태를 `cancelled`로 변경
  - 취소 사유 기록

### 2. **사용자 예약 취소 (환불 포함)**
- 위치: `/mypage`
- 기능:
  - 본인 예약만 취소 가능
  - 자동 결제 환불 처리
  - 이미 취소된 예약 중복 처리 방지

### 3. **관리자 결제 환불**
- 위치: `/admin/payments`
- 기능:
  - 결제 페이지에서 직접 환불 처리
  - 포트원 API 호출하여 실제 환불 진행
  - 관련 예약도 자동 취소

## 🔧 구현된 서버 액션

### 1. `cancelReservation` (관리자용)
**파일:** `src/app/actions/admin/reservations.ts`

```typescript
export async function cancelReservation (id: string, reason?: string)
```

**프로세스:**
1. 예약 정보 조회
2. 관련 결제 정보 조회
3. **포트원 결제 취소 API 호출** ✨
4. 결제 상태 → `refunded`
5. 예약 상태 → `cancelled`
6. 캐시 무효화

**포트원 API 호출:**
```typescript
const cancelResponse = await fetch(
  `https://api.portone.io/payments/${transactionId}/cancel`,
  {
    method: 'POST',
    headers: {
      'Authorization': `PortOne ${apiSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: reason || '관리자 예약 취소',
    }),
  }
)
```

### 2. `processRefund` (관리자용)
**파일:** `src/app/actions/admin/payments.ts`

```typescript
export async function processRefund (paymentId: string, reason?: string)
```

**프로세스:**
1. 결제 정보 조회 및 검증 (완료된 결제만 환불 가능)
2. **포트원 결제 취소 API 호출** ✨
3. 결제 상태 → `refunded`
4. 예약 상태 → `cancelled`
5. 환불 시간 기록

### 3. `cancelReservationAction` (사용자용)
**파일:** `src/app/actions/reservations.ts`

```typescript
export async function cancelReservationAction(reservationId: string, reason?: string)
```

**프로세스:**
1. 사용자 인증 확인
2. 본인 예약인지 검증
3. 이미 취소된 예약인지 확인
4. 관련 결제 정보 조회
5. **포트원 결제 취소 API 호출** ✨
6. 결제 상태 → `refunded`
7. 예약 상태 → `cancelled`
8. 캐시 무효화

## 📊 데이터 흐름

```
[예약 취소 요청]
    ↓
1. 예약 정보 조회
    ↓
2. 결제 정보 조회
   └─→ transaction_id 확인
    ↓
3. 포트원 결제 취소 API 호출
   POST https://api.portone.io/payments/{transaction_id}/cancel
   Headers: Authorization: PortOne {API_SECRET}
   Body: { reason: "취소 사유" }
    ↓
4. 포트원 응답 확인
   ├─→ 성공: 다음 단계 진행
   └─→ 실패: 오류 메시지 반환
    ↓
5. DB 업데이트
   ├─→ payments.payment_status = 'refunded'
   ├─→ payments.refunded_at = now()
   ├─→ reservations.status = 'cancelled'
   └─→ reservations.special_requests = "취소 사유: ..."
    ↓
6. 캐시 무효화
   ├─→ /admin/reservations
   ├─→ /admin/payments
   └─→ /mypage
    ↓
7. 성공 메시지 반환
   "예약이 취소되고 결제가 환불 처리되었습니다."
```

## 🔐 환경 변수 설정

### 필수 환경 변수

`.env.local` 파일에 포트원 V2 API Secret 추가:

```bash
# PortOne V2 API Secret (서버 전용)
PORTONE_V2_API_SECRET=your_v2_api_secret_here
```

### 환경 변수 가져오는 곳
1. 포트원 관리자 콘솔 로그인: https://admin.portone.io/
2. **개발자 설정** → **API Keys**
3. **V2 API Secret** 복사
4. `.env.local`에 붙여넣기

⚠️ **중요:** 이 값은 절대 클라이언트에 노출되면 안 됩니다! (서버 전용)

## 🎯 에러 처리

### 1. API Secret 미설정
```typescript
if (!apiSecret) {
  return {
    success: false,
    error: '결제 시스템 설정 오류가 발생했습니다.'
  }
}
```

### 2. 포트원 API 호출 실패
```typescript
if (!cancelResponse.ok) {
  return {
    success: false,
    error: `결제 취소 실패: ${cancelData.message || '알 수 없는 오류'}`
  }
}
```

### 3. 네트워크 오류
```typescript
catch (portoneError) {
  console.error('포트원 API 호출 오류:', portoneError)
  return {
    success: false,
    error: '결제 취소 API 호출 중 오류가 발생했습니다.'
  }
}
```

### 4. 권한 오류 (사용자용)
```typescript
if (authError || !user) {
  return {
    success: false,
    error: '로그인이 필요합니다.'
  }
}
```

### 5. 중복 취소 방지
```typescript
if (reservation.status === 'cancelled') {
  return {
    success: false,
    error: '이미 취소된 예약입니다.'
  }
}
```

## 📱 사용자 경험

### 관리자 페이지
1. 예약 목록에서 **취소 버튼** 클릭
2. 확인 다이얼로그: "예약을 취소하시겠습니까?"
3. 확인 클릭
4. 처리 중... (버튼 비활성화)
5. 성공 메시지: "예약이 취소되고 결제가 환불 처리되었습니다."
6. 자동으로 목록 새로고침

### 사용자 페이지
1. 마이페이지에서 **예약 취소** 클릭
2. 확인 다이얼로그: "정말 취소하시겠습니까?"
3. 확인 클릭
4. 처리 중...
5. 성공 메시지: "예약이 취소되고 결제가 환불 처리되었습니다."
6. 자동으로 페이지 새로고침

## 🔄 결제 상태 변화

### 정상 흐름
```
pending (대기)
    ↓
completed (완료) ← 결제 성공
    ↓
refunded (환불) ← 예약 취소
```

### 데이터베이스 필드
```sql
-- payments 테이블
payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
paid_at: timestamp      -- 결제 완료 시간
refunded_at: timestamp  -- 환불 처리 시간
transaction_id: string  -- 포트원 거래 ID (결제 취소에 사용)
```

## 🧪 테스트 방법

### 1. 개발 환경 테스트
```bash
NEXT_PUBLIC_PAYMENT_ENV=development
PORTONE_V2_API_SECRET=test_secret
```

### 2. 테스트 시나리오

#### A. 관리자 예약 취소
1. 관리자로 로그인
2. `/admin/reservations` 접속
3. 결제 완료된 예약 찾기
4. 취소 버튼 클릭
5. 확인
6. 콘솔에서 "✅ 포트원 결제 취소 성공" 확인
7. 예약 상태 `cancelled`, 결제 상태 `refunded` 확인

#### B. 사용자 예약 취소
1. 일반 사용자로 로그인
2. `/mypage` 접속
3. 내 예약 목록에서 취소할 예약 선택
4. 예약 취소 버튼 클릭
5. 확인
6. 환불 메시지 확인

#### C. 결제 페이지에서 직접 환불
1. 관리자로 로그인
2. `/admin/payments` 접속
3. 완료된 결제 선택
4. 환불 버튼 클릭
5. 확인
6. 관련 예약도 자동 취소되었는지 확인

## ⚠️ 주의사항

### 1. API Secret 보안
- ✅ 서버 사이드에서만 사용
- ✅ `.env.local` 파일은 Git에 커밋하지 않음
- ✅ 프로덕션에서는 환경 변수로 안전하게 관리

### 2. 중복 처리 방지
- ✅ 이미 취소된 예약 재처리 방지
- ✅ 완료된 결제만 환불 가능
- ✅ 버튼 비활성화로 중복 클릭 방지

### 3. 에러 로깅
- ✅ 포트원 API 오류는 콘솔에 로깅
- ✅ 사용자에게는 친절한 메시지 표시
- ✅ 관리자는 상세 오류 확인 가능

### 4. 트랜잭션 처리
- 포트원 API 호출 실패 시 DB 업데이트 안 함
- 일부만 성공하는 상황 방지
- 실패 시 명확한 오류 메시지 반환

## 📈 향후 개선 가능사항

1. **부분 환불**: 금액의 일부만 환불
2. **환불 수수료**: 취소 시점에 따른 수수료 계산
3. **이메일 알림**: 환불 완료 시 고객에게 이메일 발송
4. **환불 사유 선택**: 드롭다운으로 사유 선택
5. **환불 히스토리**: 환불 내역 별도 관리
6. **자동 환불 정책**: 예약 시간 기준 자동 환불 규칙

## ✅ 완료 체크리스트

- ✅ 관리자 예약 취소 시 결제 환불
- ✅ 사용자 예약 취소 시 결제 환불
- ✅ 결제 페이지에서 직접 환불
- ✅ 포트원 V2 API 통합
- ✅ 에러 처리 및 검증
- ✅ 환경 변수 설정 가이드
- ✅ 사용자 경험 개선
- ✅ 중복 처리 방지
- ✅ 로깅 및 디버깅
- ✅ 문서화 완료

## 🎉 결론

예약 취소 시 포트원 결제 취소 API가 자동으로 호출되어 실제 환불이 처리됩니다!

**주요 장점:**
- 🚀 자동화된 환불 처리
- 💰 실제 결제 취소로 자금 회수
- 🔒 안전한 API 호출
- ✨ 사용자 친화적인 UX
- 📊 정확한 상태 관리

이제 예약 취소와 환불이 완벽하게 통합되었습니다! 🎊
