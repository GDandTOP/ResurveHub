import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/admin/common/Breadcrumb'
import { PageHeader } from '@/components/admin/common/PageHeader'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { getProductById } from '@/app/actions/admin/products'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage ({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { name: '상품 관리', href: '/admin/products' },
          { name: product.name, href: `/admin/products/${id}` },
          { name: '수정' }
        ]}
      />

      <PageHeader
        title="상품 수정"
        description={product.name}
      />

      <ProductForm mode="edit" productId={id} initialData={product} />
    </div>
  )
}
