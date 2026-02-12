'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Product } from '@/types/product'

interface ProductGalleryProps {
  product: Product
}

/**
 * 제품 이미지 갤러리 클라이언트 컴포넌트
 */
export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // 이미지가 없는 경우 처리
  if (!product.images || product.images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">이미지가 없습니다</p>
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold">
            {product.category}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
        {product.images[selectedImage] && product.images[selectedImage].trim() !== '' ? (
          <Image
            src={product.images[selectedImage]}
            alt={`${product.name} - 이미지 ${selectedImage + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">이미지 없음</p>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold">
          {product.category}
        </div>
      </div>

      {/* 썸네일 이미지 */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all bg-muted ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              {image && image.trim() !== '' ? (
                <Image
                  src={image}
                  alt={`${product.name} - 썸네일 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">없음</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
