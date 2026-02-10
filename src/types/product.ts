/**
 * 상품(Product) 관련 타입 정의
 */

export interface Product {
  id: string;                     // 상품 고유 ID
  name: string;                   // 상품명 (예: 스터디 룸 A)
  description: string;            // 상품 설명
  images: string[];               // 이미지 URL 배열
  category: string;               // 카테고리 (예: 스터디룸, 회의실)
  pricePerHour: number;           // 시간당 가격
  capacity: number;               // 최대 수용 인원
  location: string;               // 위치
  amenities: string[];            // 편의시설 (예: 화이트보드, 프로젝터)
  availableTimeSlots: {           // 예약 가능 시간대
    dayOfWeek: number;            // 0(일요일) ~ 6(토요일)
    startTime: string;            // 시작 시간 (HH:mm)
    endTime: string;              // 종료 시간 (HH:mm)
  }[];
  status: 'active' | 'inactive';  // 상태 (활성/비활성)
  createdAt: Date;                // 생성일
  updatedAt: Date;                // 수정일
}
