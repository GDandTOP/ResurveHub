'use client'

import * as PortOne from '@portone/browser-sdk/v2'

/**
 * 포트원 결제 요청
 */
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

    if (!response) {
      throw new Error('결제 응답이 없습니다.')
    }

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

/**
 * 주문번호 생성 유틸리티
 */
export function generatePaymentId(prefix: string = 'payment'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000)
  return `${prefix}_${timestamp}_${random}`
}
