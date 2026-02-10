"use client";

import { useState } from "react";
import { dummyProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

/**
 * 상품 리스트 페이지
 * 모든 예약 가능한 상품을 표시하고 필터링 기능 제공
 */
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  // 카테고리 추출
  const categories = [
    "전체",
    ...Array.from(new Set(dummyProducts.map((p) => p.category))),
  ];

  // 필터링된 상품
  const filteredProducts =
    selectedCategory === "전체"
      ? dummyProducts
      : dummyProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            예약 가능한 공간
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            원하는 공간을 선택하고 간편하게 예약하세요
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 카테고리 필터 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">카테고리</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 상품 수 표시 */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            총 <span className="font-semibold">{filteredProducts.length}</span>
            개의 공간이 있습니다
          </p>
        </div>

        {/* 상품 그리드 */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              해당 카테고리에 상품이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
