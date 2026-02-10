"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 상품 상세 페이지 (임시)
 * TODO: 실제 상품 상세 정보를 표시하는 페이지로 구현 예정
 */
export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">상품 상세 페이지</h1>
        <p className="text-xl text-muted-foreground">
          상품 ID: <span className="font-semibold">{productId}</span>
        </p>
        <p className="text-muted-foreground">
          이 페이지는 아직 구현되지 않았습니다.
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
  );
}
