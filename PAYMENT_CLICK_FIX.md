# 결제창 버튼 클릭 문제 해결

## 🐛 문제 상황

포트원 결제창은 정상적으로 열리지만, 결제창 내부의 버튼들이 클릭되지 않는 문제가 발생했습니다.

## 🔍 원인 분석

### 문제의 원인

Dialog 컴포넌트가 열려있는 상태에서 포트원 결제창이 열렸기 때문에:

1. **Dialog의 오버레이 레이어**가 화면을 덮고 있음
2. **z-index 충돌**: Dialog의 오버레이가 결제창보다 높은 z-index를 가짐
3. **이벤트 캡처**: Dialog 오버레이가 모든 클릭 이벤트를 가로챔

```
레이어 구조 (문제 상황):
─────────────────────────
결제창 버튼 (클릭 안됨)
─────────────────────────
포트원 결제창
─────────────────────────
Dialog 오버레이 ← 이벤트 차단!
─────────────────────────
Dialog 내용
─────────────────────────
```

## ✅ 해결 방법

### 수정 전 프로세스

```typescript
handleSubmit() {
  1. 예약 생성
  2. 결제 요청 (Dialog 열린 상태)  ← 문제!
  3. 결제 검증
  4. Dialog 닫기
}
```

### 수정 후 프로세스

```typescript
handleSubmit() {
  1. 예약 생성
  2. Dialog 닫기  ← 먼저 Dialog를 닫음!
  3. setTimeout으로 약간의 딜레이
  4. 결제 요청 (Dialog 닫힌 상태)
  5. 결제 검증
}
```

## 💻 코드 변경사항

### 핵심 변경

```typescript
// 1단계: 예약 생성
const reservationResult = await createReservationAction(...)

// 2단계: Dialog를 먼저 닫음
setOpen(false)
setLoading(false)

// 3단계: Dialog 닫힘 애니메이션 대기 (300ms)
setTimeout(async () => {
  // 4단계: 결제 진행 (Dialog가 완전히 닫힌 후)
  const paymentResult = await requestPayment(...)
  const verifyResult = await verifyAndProcessPayment(...)
}, 300)
```

### setTimeout을 사용한 이유

1. **애니메이션 완료 대기**: Dialog가 닫히는 애니메이션(fade-out)이 완료될 때까지 대기
2. **DOM 업데이트**: 오버레이가 DOM에서 완전히 제거될 시간 확보
3. **안정적인 결제창 표시**: 결제창이 아무런 방해 없이 최상위 레이어에 표시됨

## 🎯 개선된 사용자 경험

### 변경 전
```
예약 정보 입력
   ↓
"결제 및 예약하기" 클릭
   ↓
결제창 열림 (Dialog 뒤에 가려짐)
   ↓
버튼 클릭 안됨 ❌
```

### 변경 후
```
예약 정보 입력
   ↓
"결제 및 예약하기" 클릭
   ↓
Dialog 닫힘 (부드러운 애니메이션)
   ↓
결제창 열림 (화면 최상단)
   ↓
버튼 정상 작동 ✅
```

## 🔧 에러 처리 개선

### 예약 생성 실패
```typescript
if (!reservationResult.success) {
  setError(reservationResult.error)
  setLoading(false)
  return  // Dialog는 열린 상태 유지
}
```

### 결제 실패
```typescript
if (!paymentResult.success) {
  alert(`결제 실패: ${paymentResult.message}`)
  // Dialog는 이미 닫힌 상태
  // 사용자가 다시 예약 시도 가능
}
```

### 결제 검증 실패
```typescript
if (!verifyResult.success) {
  alert(`결제 검증 실패: ${verifyResult.error}`)
  // 예약은 pending 상태로 남아있음
  // 관리자가 수동으로 처리 가능
}
```

## 📱 테스트 시나리오

### 1. 정상 결제 플로우
1. 예약 정보 입력
2. "결제 및 예약하기" 클릭
3. Dialog가 부드럽게 닫힘
4. 300ms 후 결제창 표시
5. 결제 진행 (버튼 정상 클릭)
6. 결제 완료
7. 마이페이지로 이동

### 2. 결제 취소
1. 예약 정보 입력
2. "결제 및 예약하기" 클릭
3. Dialog 닫힘
4. 결제창 표시
5. 결제 취소 버튼 클릭
6. "결제 실패" 알림
7. 예약은 pending 상태

### 3. 결제창 닫기
1. 예약 정보 입력
2. "결제 및 예약하기" 클릭
3. Dialog 닫힘
4. 결제창 표시
5. X 버튼으로 결제창 닫기
6. "결제 실패" 알림

## ⚠️ 주의사항

### 1. setTimeout 딜레이
- **300ms**: Dialog 닫힘 애니메이션에 충분한 시간
- 너무 짧으면: 오버레이가 아직 남아있을 수 있음
- 너무 길면: 사용자가 기다리는 시간이 길어짐

### 2. 예약 상태 관리
- 예약 생성 후 Dialog가 닫히므로, 폼 데이터는 초기화되지 않음
- 사용자가 다시 시도할 경우 같은 정보로 새 예약이 생성됨
- pending 상태 예약이 누적될 수 있으므로 정기적인 정리 필요

### 3. 에러 메시지
- Dialog가 닫힌 후 에러는 alert로 표시
- Dialog 내부 에러는 setError로 표시
- 사용자 경험 차이 발생 가능

## 🚀 추가 개선 가능 사항

### 1. 로딩 인디케이터
```typescript
// Dialog 닫힌 후 결제 대기 중 표시
// 전역 로딩 스피너 또는 토스트 메시지
```

### 2. 예약 데이터 저장
```typescript
// Dialog 닫기 전 localStorage에 저장
// 결제 실패 시 데이터 복원 가능
```

### 3. 예약 취소 로직
```typescript
// 결제 실패 시 pending 예약 자동 취소
// 또는 일정 시간 후 자동 정리
```

### 4. 결제창 z-index 조정
```typescript
// CSS로 포트원 결제창 z-index 강제 설정
// (Dialog보다 높은 값)
// 단, 포트원 SDK가 제공하는 기능이 제한적
```

## 📊 문제 해결 효과

### Before (문제 상황)
- ❌ 결제창 버튼 클릭 불가
- ❌ 사용자 혼란 (왜 안되지?)
- ❌ 결제 진행 불가능
- ❌ 서비스 이용 불가

### After (해결 후)
- ✅ 결제창 버튼 정상 작동
- ✅ 부드러운 사용자 경험
- ✅ 결제 정상 진행
- ✅ 서비스 정상 이용

## 🎉 결론

**문제**: Dialog 오버레이가 결제창 버튼 클릭을 차단

**해결**: Dialog를 먼저 닫고 딜레이 후 결제 진행

**결과**: 결제창의 모든 버튼이 정상적으로 작동

이제 사용자는 아무 문제 없이 결제를 진행할 수 있습니다! 🎊
