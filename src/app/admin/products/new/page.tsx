import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default function NewProductPage () {
  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { name: '상품 관리', href: '/admin/products' },
          { name: '상품 등록' }
        ]}
      />

      <PageHeader
        title="상품 등록"
        description="새로운 상품을 등록하세요"
      />

      <ProductForm mode="create" />
    </div>
  )
}
