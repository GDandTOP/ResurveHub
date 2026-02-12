'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createProduct, updateProduct, uploadProductImage, deleteProductImage } from '@/app/actions/admin/products'
import { useRouter } from 'next/navigation'
import { X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ProductFormData {
  name: string
  description: string
  category: string
  price_per_hour: number
  capacity: number
  location: string
  amenities: string[]
  status: 'active' | 'inactive'
  images: string[]
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  productId?: string
  mode: 'create' | 'edit'
}

export function ProductForm ({ initialData, productId, mode }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    price_per_hour: initialData?.price_per_hour || 0,
    capacity: initialData?.capacity || 1,
    location: initialData?.location || '',
    amenities: initialData?.amenities || [],
    status: initialData?.status || 'active',
    images: initialData?.images || []
  })
  const [amenityInput, setAmenityInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null)

  function handleChange (field: keyof ProductFormData, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function addAmenity () {
    if (amenityInput.trim()) {
      handleChange('amenities', [...formData.amenities, amenityInput.trim()])
      setAmenityInput('')
    }
  }

  function removeAmenity (index: number) {
    handleChange('amenities', formData.amenities.filter((_, i) => i !== index))
  }

  async function handleImageUpload (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 이미지 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.')
      return
    }

    setUploadingImage(true)
    try {
      const tempId = productId || `temp_${Date.now()}`
      const result = await uploadProductImage(file, tempId)
      
      if (result.success && result.url) {
        handleChange('images', [...formData.images, result.url])
      } else {
        alert(result.error || '이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('이미지 업로드 에러:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
      // 파일 입력 초기화
      e.target.value = ''
    }
  }

  async function removeImage (index: number) {
    if (!confirm('이미지를 삭제하시겠습니까?')) {
      return
    }

    const imageUrl = formData.images[index]
    setDeletingImageIndex(index)

    try {
      // Supabase Storage에서 이미지 삭제
      if (imageUrl.includes('supabase')) {
        const result = await deleteProductImage(imageUrl)
        if (!result.success) {
          console.error('이미지 삭제 실패:', result.error)
          alert('이미지 삭제에 실패했습니다.')
          return
        }
      }
      
      // 배열에서 제거
      handleChange('images', formData.images.filter((_, i) => i !== index))
    } catch (error) {
      console.error('이미지 삭제 에러:', error)
      alert('이미지 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingImageIndex(null)
    }
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name || !formData.category || formData.price_per_hour <= 0) {
      alert('필수 정보를 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    const result = mode === 'create'
      ? await createProduct(formData)
      : await updateProduct(productId!, formData)

    setIsSubmitting(false)

    if (result.success) {
      alert(mode === 'create' ? '상품이 등록되었습니다.' : '상품이 수정되었습니다.')
      router.push('/admin/products')
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-2">
        <CardContent className="pt-6 space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">기본 정보</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                상품명 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="예: 프리미엄 회의실 A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="상품에 대한 설명을 입력하세요"
                rows={4}
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="회의실">회의실</option>
                  <option value="스터디룸">스터디룸</option>
                  <option value="세미나실">세미나실</option>
                  <option value="라운지">라운지</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">위치</label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="예: 서울시 강남구"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  시간당 가격 (원) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price_per_hour}
                  onChange={(e) => handleChange('price_per_hour', parseInt(e.target.value))}
                  placeholder="10000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  수용 인원 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
                  placeholder="4"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">상태</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          </div>

          {/* 편의시설 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">편의시설</h3>

            <div className="flex gap-2">
              <Input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="예: WiFi, 빔프로젝터"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addAmenity()
                  }
                }}
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                추가
              </Button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-accent rounded-lg"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 이미지 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">이미지</h3>

            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {uploadingImage ? (
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {uploadingImage ? '업로드 중...' : '클릭하여 이미지 업로드'}
                </span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-muted">
                    {image && image.trim() !== '' ? (
                      <Image
                        src={image}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">이미지 없음</p>
                      </div>
                    )}
                    {deletingImageIndex === index ? (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={deletingImageIndex !== null}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 제출 버튼 */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              처리 중...
            </>
          ) : (
            mode === 'create' ? '등록하기' : '수정하기'
          )}
        </Button>
      </div>
    </form>
  )
}
