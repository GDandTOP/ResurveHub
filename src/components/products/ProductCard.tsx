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
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full border-2 hover:border-primary/30">
      <div
        onClick={handleViewDetails}
        className="relative h-56 w-full overflow-hidden bg-muted"
      >
        {product.images && product.images.length > 0 && product.images[0] ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">이미지 없음</p>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
          {product.category}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-lg">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="flex items-center justify-between text-base py-2.5 px-4 bg-accent/50 rounded-lg">
          <span className="text-muted-foreground font-medium">위치</span>
          <span className="font-semibold text-right line-clamp-1">
            {product.location}
          </span>
        </div>

        <div className="flex items-center justify-between text-base py-2.5 px-4 bg-accent/50 rounded-lg">
          <span className="text-muted-foreground font-medium">수용 인원</span>
          <span className="font-semibold">{product.capacity}명</span>
        </div>

        <div className="flex items-center justify-between py-4 px-4 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-muted-foreground text-base font-medium">시간당 가격</span>
          <span className="text-3xl font-bold text-primary">
            {product.pricePerHour.toLocaleString()}
            <span className="text-lg font-normal ml-1">원</span>
          </span>
        </div>

        <div className="pt-2">
          <div className="text-base text-muted-foreground font-medium mb-3">편의시설</div>
          <div className="flex flex-wrap gap-2">
            {product.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {amenity}
              </span>
            ))}
            {product.amenities.length > 4 && (
              <span className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                +{product.amenities.length - 4}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-4">
        <Button onClick={handleViewDetails} className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          상세보기
        </Button>
      </CardFooter>
    </Card>
  );
}
