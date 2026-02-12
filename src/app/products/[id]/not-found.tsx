import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 제품 상세 페이지 - 404 Not Found
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">상품을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground">
          존재하지 않는 상품이거나 삭제된 상품입니다.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="default" asChild>
          <Link href="/products">상품 목록으로 돌아가기</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  )
}
