"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
}

/**
 * 상품 자동 슬라이드 Carousel 컴포넌트
 * 메인 페이지에서 상품을 자동으로 슬라이드하여 보여줍니다.
 */
export function ProductCarousel({ products }: ProductCarouselProps) {
  const router = useRouter();
  
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (products.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel
        opts={{
          loop: true, // 무한 회전 활성화
        }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* 이미지 섹션 */}
                    <div className="relative h-64 md:h-96 w-full bg-muted">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">이미지 없음</p>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold">
                        {product.category}
                      </div>
                    </div>

                    {/* 정보 섹션 */}
                    <div className="flex flex-col justify-between">
                      <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {product.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">위치</span>
                          <span className="font-medium text-sm text-right">
                            {product.location.split(" ").slice(0, 2).join(" ")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            수용 인원
                          </span>
                          <span className="font-semibold">
                            최대 {product.capacity}명
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-muted-foreground">
                            시간당 가격
                          </span>
                          <span className="text-3xl font-bold text-primary">
                            {product.pricePerHour.toLocaleString()}원
                          </span>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">
                            편의시설
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.amenities.slice(0, 5).map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          onClick={() => handleViewProduct(product.id)}
                          className="w-full"
                          size="lg"
                        >
                          상세보기 및 예약하기
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
