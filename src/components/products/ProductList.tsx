'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'

interface ProductListProps {
  products: Product[]
}

/**
 * 상품 리스트 클라이언트 컴포넌트
 * 필터링과 카테고리 선택 기능 제공
 */
export function ProductList({ products }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')

  // 카테고리 추출
  const categories = useMemo(() => {
    return [
      '전체',
      ...Array.from(new Set(products.map((p) => p.category)))
    ]
  }, [products])

  // 필터링된 상품
  const filteredProducts = useMemo(() => {
    return selectedCategory === '전체'
      ? products
      : products.filter((product) => product.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 카테고리 필터 */}
      <div className="mb-12 bg-card border rounded-2xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-8">카테고리</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`h-14 px-8 text-xl font-medium transition-all ${
                selectedCategory === category
                  ? 'shadow-lg hover:shadow-xl'
                  : 'hover:bg-accent/50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 상품 수 표시 */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xl text-muted-foreground">
          총 <span className="font-bold text-foreground text-2xl">{filteredProducts.length}</span>
          개의 공간이 있습니다
        </p>
      </div>

      {/* 상품 그리드 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🔍</span>
          </div>
          <h3 className="text-3xl font-bold mb-3">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground text-xl">
            해당 카테고리에 상품이 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
