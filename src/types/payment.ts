// 결제 요청 데이터
export interface PaymentRequest {
  storeId: string
  channelKey: string
  paymentId: string
  orderName: string
  totalAmount: number
  currency: string
  customer: {
    email: string
    fullName: string
    phoneNumber?: string
  }
}

// 결제 응답 데이터
export interface PaymentResponse {
  code?: string
  message?: string
  paymentId?: string
  txId?: string
}

// 결제 검증 요청 데이터
export interface PaymentVerification {
  paymentId: string
  amount: number
  reservationId: string
}

// 결제 상태
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// 결제 방법
export type PaymentMethod = 'card' | 'trans' | 'vbank' | 'phone' | 'kakaopay' | 'tosspay'
