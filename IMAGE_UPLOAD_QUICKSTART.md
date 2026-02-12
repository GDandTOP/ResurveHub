# 🚀 이미지 업로드 빠른 시작 가이드

## 5분 안에 설정 완료하기

### 1단계: Supabase Storage Bucket 생성 (2분)

1. **Supabase Dashboard 접속**
   - https://app.supabase.com 로그인
   - 프로젝트 선택

2. **Storage 메뉴 클릭**
   - 왼쪽 메뉴에서 "Storage" 선택

3. **New Bucket 생성**
   - "New bucket" 버튼 클릭
   - **Name**: `product-images` (정확히 입력)
   - **Public bucket**: ✅ 체크 **(중요!)**
   - "Create bucket" 클릭

### 2단계: Storage 정책 설정 (3분)

**방법 1: 간편 설정 (추천)**

1. Storage → product-images → Policies 탭
2. "New Policy" 클릭
3. 아래 4가지 정책 추가:

#### Policy 1: SELECT (조회)
```
Policy name: public_select
Allowed operation: SELECT
Policy definition: true
```

#### Policy 2: INSERT (업로드)
```
Policy name: authenticated_insert
Allowed operation: INSERT
Target roles: authenticated
Policy definition: true
```

#### Policy 3: UPDATE (수정)
```
Policy name: authenticated_update
Allowed operation: UPDATE
Target roles: authenticated
Policy definition: true
```

#### Policy 4: DELETE (삭제)
```
Policy name: authenticated_delete
Allowed operation: DELETE
Target roles: authenticated
Policy definition: true
```

**방법 2: SQL로 한번에 설정 (빠름)**

Supabase SQL Editor에서 아래 코드 실행:

```sql
-- product-images bucket 정책 설정

-- 1. 모든 사용자 조회 허용
CREATE POLICY "public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 2. 인증된 사용자 업로드 허용
CREATE POLICY "authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 3. 인증된 사용자 수정 허용
CREATE POLICY "authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 4. 인증된 사용자 삭제 허용
CREATE POLICY "authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

### 3단계: 테스트 (1분)

1. 개발 서버 실행
   ```bash
   npm run dev
   ```

2. 관리자로 로그인
   - http://localhost:3000/login
   - 관리자 계정으로 로그인

3. 상품 등록 페이지 이동
   - 관리자 포털 → 상품 관리 → 상품 등록
   - 또는 http://localhost:3000/admin/products/new

4. 이미지 업로드 테스트
   - "클릭하여 이미지 업로드" 클릭
   - 이미지 파일 선택 (JPG, PNG, GIF, WEBP)
   - 업로드 성공 확인 ✅

5. Supabase에서 확인
   - Storage → product-images
   - 업로드된 이미지 확인

---

## ✅ 설정 완료 체크리스트

```
✅ product-images bucket 생성됨
✅ Public bucket 활성화됨
✅ 4개 Storage 정책 설정됨
✅ 이미지 업로드 테스트 성공
✅ Supabase Storage에서 이미지 확인
```

---

## 🐛 문제 해결

### "Bucket not found" 에러

**원인**: bucket 이름이 틀림

**해결**:
- Storage 메뉴에서 bucket 이름이 정확히 `product-images`인지 확인
- 대소문자, 하이픈(-) 확인

### "new row violates row-level security policy"

**원인**: Storage 정책이 설정되지 않음

**해결**:
- 2단계의 SQL 코드를 다시 실행
- 또는 UI에서 정책 수동 추가

### 이미지가 업로드되지만 표시되지 않음

**원인**: Public bucket이 아님

**해결**:
1. Storage → product-images → Configuration
2. "Public bucket" 체크
3. Save

### "Invalid API key" 에러

**원인**: 환경 변수 미설정

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# Supabase URL과 ANON_KEY가 올바른지 확인
# 개발 서버 재시작
npm run dev
```

---

## 📊 Storage 사용 현황 확인

**Supabase Dashboard**:
- Storage → product-images
- Usage 탭에서 용량 확인
- Files 탭에서 파일 목록 확인

**SQL로 확인**:
```sql
-- 업로드된 이미지 수
SELECT COUNT(*) FROM storage.objects 
WHERE bucket_id = 'product-images';

-- 전체 용량
SELECT 
  COUNT(*) as file_count,
  pg_size_pretty(SUM(metadata->>'size')::bigint) as total_size
FROM storage.objects 
WHERE bucket_id = 'product-images';

-- 최근 업로드
SELECT name, created_at 
FROM storage.objects 
WHERE bucket_id = 'product-images'
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🎯 다음 단계

설정이 완료되었다면:

1. **상품 등록 테스트**
   - 여러 이미지 업로드
   - 이미지 삭제 테스트
   - 상품 등록 완료

2. **상품 수정 테스트**
   - 기존 상품 수정
   - 이미지 추가/삭제
   - 수정 완료

3. **상품 삭제 테스트**
   - 상품 삭제 시 이미지도 함께 삭제되는지 확인
   - Storage에서 이미지 삭제 확인

---

## 📚 상세 문서

더 자세한 내용은 다음 문서를 참고하세요:

- **STORAGE_SETUP_GUIDE.md**: 상세 설정 가이드
- **ProjectGuideForVibeCoding.md**: 프로젝트 전체 구조
- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)

---

## 💡 팁

### 개발 환경에서 테스트 이미지

무료 이미지 사이트:
- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- [Pixabay](https://pixabay.com/)

### Storage 용량 관리

- Supabase Free Tier: 1GB Storage
- 불필요한 이미지 정기적으로 삭제
- 이미지 최적화 권장 (WebP 형식, 압축)

### 이미지 최적화

```bash
# 이미지 압축 도구 (선택사항)
npm install sharp

# 사용 예시
const sharp = require('sharp')
await sharp(inputBuffer)
  .resize(800, 600, { fit: 'inside' })
  .webp({ quality: 80 })
  .toFile('output.webp')
```

---

**설정 완료 시간: 약 5분**  
**문제 발생 시**: STORAGE_SETUP_GUIDE.md 참고 또는 이슈 등록
