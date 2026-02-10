# 🏢 ReserveHub - 예약 플랫폼

스터디룸, 회의실, 세미나실을 간편하게 예약할 수 있는 웹 애플리케이션입니다.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ 주요 기능

- 🔍 **상품 검색 및 필터링** - 카테고리별로 공간을 쉽게 찾을 수 있습니다
- 🎠 **자동 슬라이드 캐러셀** - 인기 공간을 무한 회전으로 소개합니다
- 📱 **완전한 반응형 디자인** - 모바일, 태블릿, 데스크톱 모두 지원
- 🎨 **현대적인 UI/UX** - shadcn/ui 기반의 세련된 인터페이스
- ⚡ **빠른 성능** - Next.js 16 App Router와 Turbopack 사용

## 🖼️ 스크린샷

### 메인 페이지
- 히어로 섹션과 그라디언트 디자인
- 자동 슬라이드 상품 캐러셀
- 서비스 소개 섹션

### 상품 리스트 페이지
- 카테고리 필터링
- 그리드 레이아웃
- 상품 카드 (이미지, 가격, 편의시설)

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui
- **Carousel**: Embla Carousel
- **Icons**: Lucide React

### 주요 라이브러리
- `class-variance-authority` - 컴포넌트 variant 관리
- `clsx` & `tailwind-merge` - 클래스명 유틸리티
- `embla-carousel-react` - 캐러셀 구현
- `embla-carousel-autoplay` - 자동 슬라이드

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   ├── products/               # 상품 관련 페이지
│   │   ├── page.tsx            # 상품 리스트
│   │   └── [id]/page.tsx       # 상품 상세 (예정)
│   └── globals.css             # 글로벌 스타일
├── components/
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── Header.tsx          # 헤더
│   │   └── Footer.tsx          # 푸터
│   ├── products/               # 상품 관련 컴포넌트
│   │   ├── ProductCard.tsx     # 상품 카드
│   │   └── ProductCarousel.tsx # 상품 캐러셀
│   └── ui/                     # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       └── dialog.tsx
├── data/
│   └── products.ts             # 더미 데이터
├── types/
│   └── product.ts              # 타입 정의
└── lib/
    └── utils.ts                # 유틸리티 함수
```

## 🚀 시작하기

### 필수 조건

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

1. 저장소 클론
```bash
git clone https://github.com/your-username/reservation-platform.git
cd reservation-platform
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 열기
```
http://localhost:3000
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 린트

```bash
npm run lint
```

## 📋 데이터 모델

### Product (상품)
```typescript
interface Product {
  id: string;                     // 상품 고유 ID
  name: string;                   // 상품명
  description: string;            // 상품 설명
  images: string[];               // 이미지 URL 배열
  category: string;               // 카테고리
  pricePerHour: number;           // 시간당 가격
  capacity: number;               // 최대 수용 인원
  location: string;               // 위치
  amenities: string[];            // 편의시설
  status: 'active' | 'inactive';  // 상태
  createdAt: Date;                // 생성일
  updatedAt: Date;                // 수정일
}
```

## 🎨 디자인 특징

- **미니멀리즘**: 깔끔하고 단조로운 디자인
- **그라디언트 포인트**: 로고와 주요 텍스트에 그라디언트 적용
- **Glassmorphism**: 헤더의 backdrop blur 효과
- **부드러운 애니메이션**: 모든 인터랙션에 자연스러운 transition
- **완벽한 반응형**: 모든 디바이스에서 최적화된 경험

## 🔜 향후 개발 예정

- [ ] 상품 상세 페이지 구현
- [ ] 예약 기능 (캘린더, 시간대 선택)
- [ ] 사용자 인증 (로그인/회원가입)
- [ ] 결제 시스템 통합
- [ ] 관리자 대시보드
- [ ] 예약 관리 시스템
- [ ] 리뷰 및 평점 기능
- [ ] 검색 기능 고도화

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🤝 기여하기

기여를 환영합니다! Pull Request를 보내주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issue를 생성해주세요.

---

**Made with ❤️ using Next.js and shadcn/ui**
