import Link from 'next/link'
import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsTable } from '@/components/admin/products/ProductsTable'
import { getAllProducts } from '@/app/actions/admin/products'

interface SearchParams {
  status?: 'active' | 'inactive' | 'all'
  category?: string
  search?: string
}

export default async function AdminProductsPage ({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const products = await getAllProducts({
    status: params.status || 'all',
    category: params.category,
    search: params.search
  })

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: '상품 관리' }]} />

      {/* 페이지 헤더 */}
      <PageHeader
        title="상품 관리"
        description="등록된 상품을 관리하고 새로운 상품을 추가하세요"
        action={
          <Link href="/admin/products/new">
            <Button size="lg" className="text-base font-semibold">
              <Plus className="h-5 w-5 mr-2" />
              상품 등록
            </Button>
          </Link>
        }
      />

      {/* 상품 목록 테이블 */}
      <ProductsTable products={products} />
    </div>
  )
}
