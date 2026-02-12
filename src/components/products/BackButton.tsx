'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

/**
 * 뒤로 가기 버튼 클라이언트 컴포넌트
 */
export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      뒤로 가기
    </Button>
  )
}
