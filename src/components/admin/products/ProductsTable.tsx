'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Eye, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteProduct, updateProductStatus } from '@/app/actions/admin/products'

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  category: string
  price_per_hour: number
  capacity: number
  status: 'active' | 'inactive'
  created_at: string
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable ({ products }: ProductsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  async function handleDelete (id: string) {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return

    setIsDeleting(id)
    const result = await deleteProduct(id)
    setIsDeleting(null)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  async function handleStatusToggle (id: string, currentStatus: 'active' | 'inactive') {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const result = await updateProductStatus(id, newStatus)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 검색 & 필터 */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="상품명 또는 카테고리로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상품 목록 */}
      <Card className="border-2">
        <CardContent className="pt-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-4">
                {search || statusFilter !== 'all' 
                  ? '검색 결과가 없습니다'
                  : '등록된 상품이 없습니다'
                }
              </p>
              {!search && statusFilter === 'all' && (
                <Link href="/admin/products/new">
                  <Button>첫 상품 등록하기</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">이미지</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">상품명</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">카테고리</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">가격</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">수용인원</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted">
                          {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {product.price_per_hour.toLocaleString()}원/시간
                      </td>
                      <td className="py-3 px-4">
                        {product.capacity}명
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleStatusToggle(product.id, product.status)}
                          className="cursor-pointer"
                        >
                          <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
                            {product.status === 'active' ? 'O' : 'X'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/products/${product.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting === product.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
