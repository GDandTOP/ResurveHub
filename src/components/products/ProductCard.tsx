"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 * 상품 리스트에서 개별 상품을 표시하는 카드
 */
export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
      <div
        onClick={handleViewDetails}
        className="relative h-48 w-full overflow-hidden"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
          {product.category}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">위치</span>
          <span className="font-medium text-right line-clamp-1">
            {product.location}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">수용 인원</span>
          <span className="font-medium">{product.capacity}명</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">시간당 가격</span>
          <span className="text-2xl font-bold text-primary">
            {product.pricePerHour.toLocaleString()}원
          </span>
        </div>

        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-1">편의시설</div>
          <div className="flex flex-wrap gap-1">
            {product.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
              >
                {amenity}
              </span>
            ))}
            {product.amenities.length > 4 && (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                +{product.amenities.length - 4}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button onClick={handleViewDetails} className="w-full">
          상세보기
        </Button>
      </CardFooter>
    </Card>
  );
}
