'use client'

import Image from 'next/image'

interface TopProductsTableProps {
  products: Array<{
    rank: number
    id: string
    name: string
    category: string
    image?: string
    reservationCount: number
  }>
}

export function TopProductsTable ({ products }: TopProductsTableProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">인기 상품 TOP 10</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">순위</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">상품</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">카테고리</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">예약 건수</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {product.rank}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No Image</span>
                      </div>
                    )}
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-semibold">
                  {product.reservationCount}건
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
