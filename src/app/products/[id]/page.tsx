import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByIdServer } from '@/lib/api/products'
import { dbProductToClientProduct } from '@/lib/utils/product-mapper'
import { ProductGallery } from '@/components/products/ProductGallery'
import { BackButton } from '@/components/products/BackButton'
import { ReservationForm } from '@/components/products/ReservationForm'
import { AvailableTimeSlotView } from '@/components/products/AvailableTimeSlotView'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MapPin, Users, CheckCircle2 } from 'lucide-react'

/**
 * 상품 상세 페이지
 * 선택한 상품의 모든 정보를 상세하게 표시
 */
export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Supabase에서 상품 데이터 가져오기
  const dbProduct = await getProductByIdServer(id)

  // 상품이 없는 경우 404 페이지 표시
  if (!dbProduct) {
    notFound()
  }

  const product = dbProductToClientProduct(dbProduct)

  return (
    <div className="min-h-screen bg-background">
      {/* 뒤로 가기 버튼 */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <BackButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 이미지 갤러리 */}
          <ProductGallery product={product} />

          {/* 오른쪽: 상품 정보 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* 가격 */}
            <div className="border-t border-b py-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {product.pricePerHour.toLocaleString()}원
                </span>
                <span className="text-xl text-muted-foreground">/ 시간</span>
              </div>
            </div>

            {/* 주요 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">수용 인원</p>
                      <p className="text-lg font-semibold">
                        최대 {product.capacity}명
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">위치</p>
                      <p className="text-lg font-semibold">
                        {product.location.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 예약 버튼 */}
            <ReservationForm product={product} />

            {/* 위치 상세 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  상세 위치
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.location}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단: 추가 정보 */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 편의시설 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                편의시설
              </CardTitle>
              <CardDescription>
                이 공간에서 제공되는 편의시설입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {product.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 이용 가능 시간 */}
          <AvailableTimeSlotView product={product} />
        </div>

        {/* 안내사항 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>이용 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              예약은 최소 1시간 단위로 가능합니다.
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              예약 시간 10분 전까지 입실해주세요.
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              퇴실 시 개인 물품을 확인해주시고, 정리정돈을 부탁드립니다.
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              음식물 반입은 밀폐 용기에 한해 가능합니다.
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              취소 및 환불은 예약 시간 24시간 전까지 가능합니다.
            </p>
          </CardContent>
        </Card>

        {/* 하단 버튼 */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">상품 목록으로</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
