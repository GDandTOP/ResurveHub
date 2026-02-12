# 포트원(PortOne) 결제 연동 가이드

## 📋 개요

포트원(구 아임포트)은 여러 PG사를 통합 관리할 수 있는 결제 대행 서비스입니다.

**공식 사이트:**
- 관리자 콘솔: https://admin.portone.io/
- 개발자 문서: https://developers.portone.io/

## 🔑 1단계: 포트원 가입 및 설정

### 1. 회원가입
1. https://admin.portone.io/ 접속
2. 회원가입 진행
3. 이메일 인증 완료

### 2. 가맹점 생성
1. 관리자 콘솔 로그인
2. **결제연동 > 연동 관리** 메뉴로 이동
3. **가맹점 추가** 버튼 클릭
4. 가맹점 정보 입력

### 3. 가맹점 식별코드 확인
- **가맹점 식별코드(IMP)**: `imp12345678` 형식
- 이 코드는 클라이언트에서 결제 요청 시 사용됩니다

### 4. REST API 키 발급
1. **결제연동 > 연동 관리** 에서 가맹점 선택
2. **REST API 키**, **REST API Secret** 확인
3. 이 값들은 서버에서 결제 검증 시 사용됩니다

## 🔧 2단계: 환경 변수 설정

### .env.local 파일 설정

```bash
# PortOne (구 아임포트) Payment Configuration
NEXT_PUBLIC_PORTONE_IMP_CODE=imp12345678        # 가맹점 식별코드
PORTONE_API_KEY=your_api_key_here               # REST API 키
PORTONE_API_SECRET=your_api_secret_here         # REST API Secret
NEXT_PUBLIC_PAYMENT_ENV=development             # 환경 (development/production)
```

**주의사항:**
- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 접근 가능
- `PORTONE_API_KEY`, `PORTONE_API_SECRET`은 서버에서만 사용 (절대 노출 금지!)

## 📦 3단계: 패키지 설치

포트원 SDK 설치:

```bash
npm install @portone/browser-sdk
```

결제 검증용 패키지:

```bash
npm install axios
```

## 💻 4단계: 타입 정의

`src/types/payment.ts` 파일 생성:

```typescript
// 결제 요청 데이터
export interface PaymentRequest {
  pg: string                    // PG사 (예: 'kakaopay', 'tosspay', 'html5_inicis')
  pay_method: string           // 결제 수단 (card, trans, vbank, phone)
  merchant_uid: string         // 주문번호 (유니크해야 함)
  name: string                 // 결제명
  amount: number               // 결제금액
  buyer_email: string          // 구매자 이메일
  buyer_name: string           // 구매자 이름
  buyer_tel?: string           // 구매자 전화번호
  buyer_addr?: string          // 구매자 주소
  buyer_postcode?: string      // 구매자 우편번호
}

// 결제 응답 데이터
export interface PaymentResponse {
  success: boolean
  imp_uid?: string             // 포트원 거래 고유번호
  merchant_uid?: string        // 주문번호
  error_code?: string          // 에러 코드
  error_msg?: string           // 에러 메시지
}

// 결제 검증 데이터
export interface PaymentVerification {
  imp_uid: string              // 포트원 거래 고유번호
  merchant_uid: string         // 주문번호
  amount: number               // 결제 금액
}
```

## 🚀 5단계: 결제 클라이언트 구현

`src/lib/payment/portone-client.ts` 파일 생성:

```typescript
'use client'

import * as PortOne from '@portone/browser-sdk/v2'
import type { PaymentRequest, PaymentResponse } from '@/types/payment'

/**
 * 포트원 결제 요청
 */
export async function requestPayment(
  paymentData: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const impCode = process.env.NEXT_PUBLIC_PORTONE_IMP_CODE

    if (!impCode) {
      throw new Error('포트원 가맹점 식별코드가 설정되지 않았습니다.')
    }

    // 포트원 결제 요청
    const response = await PortOne.requestPayment({
      storeId: impCode,
      paymentId: paymentData.merchant_uid,
      orderName: paymentData.name,
      totalAmount: paymentData.amount,
      currency: 'KRW',
      channelKey: paymentData.pg,
      payMethod: paymentData.pay_method as any,
      customer: {
        email: paymentData.buyer_email,
        fullName: paymentData.buyer_name,
        phoneNumber: paymentData.buyer_tel,
      },
    })

    if (response.code) {
      // 결제 실패
      return {
        success: false,
        error_code: response.code,
        error_msg: response.message,
      }
    }

    // 결제 성공
    return {
      success: true,
      imp_uid: response.paymentId,
      merchant_uid: paymentData.merchant_uid,
    }
  } catch (error) {
    console.error('결제 요청 오류:', error)
    return {
      success: false,
      error_msg: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 주문번호 생성
 */
export function generateMerchantUid(prefix: string = 'order'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000)
  return `${prefix}_${timestamp}_${random}`
}
```

## 🔒 6단계: 결제 검증 서버 액션

`src/app/actions/payment.ts` 파일 생성:

```typescript
'use server'

import axios from 'axios'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { PaymentVerification } from '@/types/payment'

/**
 * 포트원 액세스 토큰 발급
 */
async function getPortOneAccessToken(): Promise<string> {
  const apiKey = process.env.PORTONE_API_KEY
  const apiSecret = process.env.PORTONE_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('포트원 API 키가 설정되지 않았습니다.')
  }

  try {
    const response = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: apiKey,
      imp_secret: apiSecret,
    })

    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }

    return response.data.response.access_token
  } catch (error) {
    console.error('액세스 토큰 발급 오류:', error)
    throw new Error('액세스 토큰 발급에 실패했습니다.')
  }
}

/**
 * 결제 정보 조회
 */
async function getPaymentInfo(impUid: string, accessToken: string) {
  try {
    const response = await axios.get(
      `https://api.iamport.kr/payments/${impUid}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }

    return response.data.response
  } catch (error) {
    console.error('결제 정보 조회 오류:', error)
    throw new Error('결제 정보 조회에 실패했습니다.')
  }
}

/**
 * 결제 검증 및 처리
 */
export async function verifyAndProcessPayment(
  verification: PaymentVerification,
  reservationId: string
) {
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

    // 2. 포트원 액세스 토큰 발급
    const accessToken = await getPortOneAccessToken()

    // 3. 포트원에서 결제 정보 조회
    const paymentInfo = await getPaymentInfo(verification.imp_uid, accessToken)

    // 4. 결제 금액 검증
    if (paymentInfo.amount !== verification.amount) {
      return {
        success: false,
        error: '결제 금액이 일치하지 않습니다.',
      }
    }

    // 5. 결제 상태 확인
    if (paymentInfo.status !== 'paid') {
      return {
        success: false,
        error: '결제가 완료되지 않았습니다.',
      }
    }

    // 6. payments 테이블에 결제 정보 저장
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: reservationId,
        user_id: user.id,
        amount: verification.amount,
        payment_method: paymentInfo.pay_method,
        payment_status: 'completed',
        transaction_id: verification.imp_uid,
        paid_at: new Date().toISOString(),
      })

    if (paymentError) {
      console.error('결제 정보 저장 오류:', paymentError)
      return {
        success: false,
        error: '결제 정보 저장에 실패했습니다.',
      }
    }

    // 7. 예약 상태를 confirmed로 업데이트
    const { error: reservationError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)

    if (reservationError) {
      console.error('예약 상태 업데이트 오류:', reservationError)
      return {
        success: false,
        error: '예약 상태 업데이트에 실패했습니다.',
      }
    }

    return {
      success: true,
      message: '결제가 완료되었습니다.',
    }
  } catch (error) {
    console.error('결제 검증 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '결제 검증에 실패했습니다.',
    }
  }
}
```

## 🎨 7단계: UI 컴포넌트 예제

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestPayment, generateMerchantUid } from '@/lib/payment/portone-client'
import { verifyAndProcessPayment } from '@/app/actions/payment'

interface PaymentButtonProps {
  reservationId: string
  amount: number
  productName: string
  userEmail: string
  userName: string
}

export function PaymentButton({
  reservationId,
  amount,
  productName,
  userEmail,
  userName,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // 1. 결제 요청
      const merchantUid = generateMerchantUid('reservation')
      const paymentResponse = await requestPayment({
        pg: 'kakaopay',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: productName,
        amount: amount,
        buyer_email: userEmail,
        buyer_name: userName,
      })

      if (!paymentResponse.success) {
        alert(`결제 실패: ${paymentResponse.error_msg}`)
        return
      }

      // 2. 결제 검증 및 처리
      const verifyResult = await verifyAndProcessPayment(
        {
          imp_uid: paymentResponse.imp_uid!,
          merchant_uid: merchantUid,
          amount: amount,
        },
        reservationId
      )

      if (!verifyResult.success) {
        alert(`결제 검증 실패: ${verifyResult.error}`)
        return
      }

      alert('결제가 완료되었습니다!')
      window.location.href = '/mypage'
    } catch (error) {
      console.error('결제 오류:', error)
      alert('결제 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading} size="lg" className="w-full">
      {loading ? '결제 처리 중...' : `${amount.toLocaleString()}원 결제하기`}
    </Button>
  )
}
```

## 📱 8단계: PG사 설정

### 지원하는 PG사
- **카카오페이**: `kakaopay`
- **토스페이**: `tosspay`
- **이니시스**: `html5_inicis`
- **KG이니시스**: `kginicis`
- **나이스페이**: `nice`
- **JTNet**: `jtnet`

### PG사 연동 방법
1. 포트원 관리자 콘솔 > **결제연동 > PG설정**
2. 원하는 PG사 선택
3. PG사에서 발급받은 키 입력
4. 테스트 결제 진행

## 🧪 9단계: 테스트

### 개발 환경 테스트
```bash
NEXT_PUBLIC_PAYMENT_ENV=development
```

- 실제 결제 없이 테스트 가능
- 포트원에서 제공하는 테스트 카드 사용

### 테스트 카드 번호
- 카드번호: 아무 16자리 (예: 1234-1234-1234-1234)
- 유효기간: 미래 날짜
- CVC: 아무 3자리

### 실제 결제 테스트
```bash
NEXT_PUBLIC_PAYMENT_ENV=production
```

- 실제 PG사와 연동
- 실제 카드로 결제 (테스트 후 취소 필요)

## 📊 10단계: 결제 내역 조회

관리자 콘솔에서 결제 내역 확인:
1. **결제내역** 메뉴로 이동
2. 결제 상태, 금액, 날짜 등 확인
3. 결제 취소, 환불 처리 가능

## ⚠️ 주의사항

1. **환경 변수 보안**
   - `.env.local` 파일은 절대 Git에 커밋하지 말 것
   - API Secret은 서버에서만 사용
   - 클라이언트에 노출되지 않도록 주의

2. **결제 금액 검증**
   - 클라이언트에서 보낸 금액과 서버에서 계산한 금액 비교 필수
   - 포트원에서 조회한 금액과 DB의 금액 비교 필수

3. **결제 상태 확인**
   - 결제 완료 후 반드시 포트원 API로 재확인
   - 위변조 방지를 위한 필수 과정

4. **에러 처리**
   - 결제 실패 시 사용자에게 명확한 메시지 표시
   - 네트워크 오류, 카드 오류 등 다양한 케이스 고려

## 📚 참고 자료

- [포트원 개발자 문서](https://developers.portone.io/)
- [포트원 SDK 가이드](https://developers.portone.io/docs/ko/v2-sdk/browser-sdk)
- [결제 연동 가이드](https://developers.portone.io/docs/ko/ready/readme)
- [관리자 콘솔](https://admin.portone.io/)
