import { getProductsServer } from '@/lib/api/products'
import { dbProductsToClientProducts } from '@/lib/utils/product-mapper'
import { ProductList } from '@/components/products/ProductList'

/**
 * 상품 리스트 페이지
 * 모든 예약 가능한 상품을 표시하고 필터링 기능 제공
 */
export default async function ProductsPage() {
  // Supabase에서 상품 데이터 가져오기
  const dbProducts = await getProductsServer()
  const products = dbProductsToClientProducts(dbProducts)

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground border-b-4 border-primary/20">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              예약 가능한 공간
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              원하는 공간을 선택하고 간편하게 예약하세요
            </p>
          </div>
        </div>
      </div>

      <ProductList products={products} />
    </div>
  )
}
