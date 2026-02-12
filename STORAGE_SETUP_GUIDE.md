# 🖼️ Supabase Storage 이미지 업로드 설정 가이드

## 📋 개요

상품 이미지 업로드를 위한 Supabase Storage 설정 가이드입니다.

---

## 1️⃣ Supabase Storage Bucket 생성

### 1단계: Storage 메뉴 접속

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭

### 2단계: 새 Bucket 생성

1. **"New bucket"** 버튼 클릭
2. 다음 정보 입력:
   ```
   Name: product-images
   Public bucket: ✅ (체크)
   ```
3. **"Create bucket"** 클릭

> ⚠️ **중요**: Public bucket을 활성화해야 업로드된 이미지에 공개 URL로 접근할 수 있습니다.

---

## 2️⃣ Storage 정책(Policy) 설정

### Bucket 정책 추가

1. Storage 페이지에서 **"product-images"** bucket 클릭
2. 상단의 **"Policies"** 탭 클릭
3. 다음 정책들을 추가합니다:

#### 정책 1: 인증된 사용자 이미지 업로드

**"New Policy"** → **"For full customization"** 클릭

```sql
Policy name: Allow authenticated uploads
Allowed operation: INSERT
Target roles: authenticated

USING expression:
true

WITH CHECK expression:
true
```

또는 SQL Editor에서 직접 실행:

```sql
-- 인증된 사용자 업로드 허용
CREATE POLICY "인증된 사용자 업로드 가능"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 인증된 사용자 삭제 허용
CREATE POLICY "인증된 사용자 삭제 가능"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 인증된 사용자 수정 허용
CREATE POLICY "인증된 사용자 수정 가능"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 모든 사용자 조회 허용 (Public bucket이므로)
CREATE POLICY "모든 사용자 조회 가능"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### 간편한 정책 설정 (권장)

Storage 페이지 → Policies 탭에서:

1. **"Add Policy"** 클릭
2. **"Allow authenticated uploads"** 템플릿 선택
3. Bucket: `product-images` 선택
4. **"Review"** → **"Save Policy"**

---

## 3️⃣ 설정 확인

### 테스트 업로드

1. 개발 서버 실행: `npm run dev`
2. 관리자로 로그인
3. 관리자 포털 → 상품 관리 → 상품 등록
4. 이미지 업로드 시도
5. 성공 시 Supabase Storage에서 확인:
   - Storage → product-images → 업로드된 파일 확인

### 문제 해결

#### "new row violates RLS policy"

**원인**: Storage 정책이 설정되지 않음

**해결**:
```sql
-- SQL Editor에서 실행
SELECT * FROM storage.objects WHERE bucket_id = 'product-images';

-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- 정책이 없으면 위의 SQL 정책 실행
```

#### "Bucket not found"

**원인**: bucket 이름이 잘못됨

**해결**:
- Storage 메뉴에서 bucket 이름이 정확히 `product-images`인지 확인
- 대소문자 및 철자 확인

#### 이미지가 표시되지 않음

**원인**: Public bucket이 아님

**해결**:
1. Storage → product-images → Configuration
2. "Public bucket" 활성화
3. Save

---

## 4️⃣ 추가 설정 (선택)

### 파일 크기 제한

```sql
-- 최대 5MB로 제한
CREATE POLICY "파일 크기 제한"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  octet_length(decode(storage.extension(name), 'base64')) < 5242880
);
```

### 파일 타입 제한

```sql
-- 이미지 파일만 허용
CREATE POLICY "이미지 파일만 허용"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);
```

---

## 5️⃣ 코드 사용법

### 이미지 업로드 (자동 처리됨)

상품 등록/수정 페이지에서 이미지를 선택하면 자동으로 업로드됩니다:

```typescript
// src/app/actions/admin/products.ts
export async function uploadProductImage(file: File, productId: string) {
  const supabase = await createServerSupabaseClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)
  
  return { success: true, url: publicUrl }
}
```

### 이미지 삭제

```typescript
export async function deleteProductImage(imageUrl: string) {
  const supabase = await createServerSupabaseClient()
  
  const urlParts = imageUrl.split('/product-images/')
  const filePath = urlParts[1]
  
  await supabase.storage
    .from('product-images')
    .remove([filePath])
}
```

---

## 6️⃣ 보안 체크리스트

```
✅ product-images bucket이 생성되었는지 확인
✅ Public bucket이 활성화되었는지 확인
✅ Storage 정책이 설정되었는지 확인
✅ 인증된 사용자만 업로드/삭제 가능한지 확인
✅ 이미지 URL이 public URL인지 확인
```

---

## 7️⃣ 디버깅

### 브라우저 콘솔 확인

```javascript
// F12 → Console 탭
// 에러 메시지 확인
```

### Supabase Logs 확인

1. Supabase Dashboard → Logs
2. Storage 탭에서 업로드 요청 확인
3. 에러 메시지 확인

### SQL로 Storage 내용 확인

```sql
-- 업로드된 파일 목록
SELECT * FROM storage.objects 
WHERE bucket_id = 'product-images'
ORDER BY created_at DESC;

-- Storage 정책 확인
SELECT * FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
```

---

## ✅ 완료 확인

모든 설정이 완료되면:

1. ✅ 관리자 페이지에서 상품 이미지 업로드 가능
2. ✅ 업로드된 이미지가 상품 상세 페이지에 표시됨
3. ✅ 이미지 삭제 가능
4. ✅ 상품 삭제 시 이미지도 함께 삭제됨

---

**문제가 계속되면 Supabase Dashboard의 Logs를 확인하거나 이슈를 등록하세요.**
