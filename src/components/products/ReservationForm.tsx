"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createReservationAction, cancelReservationAction } from "@/app/actions/reservations";
import { verifyAndProcessPayment } from "@/app/actions/payment";
import { requestPayment } from "@/lib/payment/portone-client";
import type { Product } from "@/types/product";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

interface ReservationFormProps {
  product: Product;
  initialOpen?: boolean;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onOpenChange?: (open: boolean) => void;
}

export function ReservationForm({ 
  product, 
  initialOpen = false,
  initialDate = "",
  initialStartTime = "",
  initialEndTime = "",
  onOpenChange
}: ReservationFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [reservationDate, setReservationDate] = useState(initialDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  // 외부에서 전달된 초기값이 변경되면 상태 업데이트
  useEffect(() => {
    if (initialOpen !== undefined) setOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    if (initialDate) setReservationDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    if (initialStartTime) setStartTime(initialStartTime);
  }, [initialStartTime]);

  useEffect(() => {
    if (initialEndTime) setEndTime(initialEndTime);
  }, [initialEndTime]);

  // open 상태 변경 시 부모에게 알림
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // 캘린더 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // 시간 옵션 생성 (09:00 ~ 22:00)
  const timeOptions = Array.from({ length: 14 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // 종료 시간 옵션 (시작 시간 이후만)
  const endTimeOptions = timeOptions.filter((time) => time > startTime);

  // 달력 생성
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setReservationDate(dateString);
    setShowCalendar(false);
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return date < today;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !reservationDate) return false;
    const dateString = date.toISOString().split('T')[0];
    return dateString === reservationDate;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const todayString = today.toISOString().split('T')[0];
    const dateString = date.toISOString().split('T')[0];
    return todayString === dateString;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!reservationDate) {
      setError("날짜를 선택해주세요.");
      return;
    }
    if (!startTime) {
      setError("시작 시간을 선택해주세요.");
      return;
    }
    if (!endTime) {
      setError("종료 시간을 선택해주세요.");
      return;
    }

    setLoading(true);

    // 시간 계산
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    const hours = endHour - startHour;
    const totalPrice = hours * product.pricePerHour;

    try {
      // 1단계: 예약 생성 (status: pending)
      const reservationResult = await createReservationAction({
        product_id: product.id,
        reservation_date: reservationDate,
        start_time: startTime,
        end_time: endTime,
        number_of_people: numberOfPeople,
        total_price: totalPrice,
        status: "pending",
      });

      if (!reservationResult.success || !reservationResult.data) {
        setError(reservationResult.error || "예약 생성에 실패했습니다.");
        setLoading(false);
        return;
      }

      const reservationId = reservationResult.data.id;
      const userEmail = reservationResult.data.user?.email || "";
      const userName = reservationResult.data.user?.name || "고객";

      // 2단계: Dialog를 먼저 닫고 결제 진행
      // Dialog가 열려있으면 결제창 버튼이 클릭되지 않음
      handleOpenChange(false);
      setLoading(false);

      // 약간의 딜레이 후 결제 진행 (Dialog 닫힘 애니메이션 대기)
      setTimeout(async () => {
        try {
          // 3단계: 포트원 결제 요청
          const paymentResult = await requestPayment({
            orderName: `${product.name} 예약`,
            totalAmount: totalPrice,
            customerEmail: userEmail,
            customerName: userName,
          });

          if (!paymentResult.success) {
            // 결제 실패 시 예약 취소
            await cancelReservationAction(reservationId);
            alert(`결제 실패: ${paymentResult.message || "알 수 없는 오류"}\n예약이 취소되었습니다.`);
            router.refresh();
            return;
          }

          // 4단계: 결제 검증 및 예약 확정
          const verifyResult = await verifyAndProcessPayment({
            paymentId: paymentResult.paymentId!,
            amount: totalPrice,
            reservationId,
          });

          if (!verifyResult.success) {
            // 검증 실패 시 예약 취소
            await cancelReservationAction(reservationId);
            alert(`결제 검증 실패: ${verifyResult.error}\n예약이 취소되었습니다.`);
            router.refresh();
            return;
          }

          // 5단계: 성공
          alert("결제 및 예약이 완료되었습니다!");
          router.push("/mypage");
          router.refresh();
        } catch (err) {
          console.error("결제 처리 오류:", err);
          // 에러 발생 시 예약 취소
          await cancelReservationAction(reservationId);
          alert(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.\n예약이 취소되었습니다.");
          router.refresh();
        }
      }, 300);
    } catch (err) {
      console.error("예약 생성 실패:", err);
      setError(err instanceof Error ? err.message : "예약 생성에 실패했습니다.");
      setLoading(false);
    }
  };

  // 시작 시간이 변경되면 종료 시간 초기화
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (endTime && endTime <= value) {
      setEndTime("");
    }
  };

  // 총 시간 및 가격 계산
  const calculateTotal = () => {
    if (!startTime || !endTime) return null;
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    const hours = endHour - startHour;
    const totalPrice = hours * product.pricePerHour;
    return { hours, totalPrice };
  };

  const total = calculateTotal();

  // 날짜 포맷팅 (YYYY-MM-DD -> YYYY년 MM월 DD일)
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  const days = generateCalendar();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg h-14 font-semibold">
          예약하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name} 예약</DialogTitle>
          <DialogDescription>
            예약 정보를 입력해주세요. 최소 1시간 단위로 예약 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 날짜 선택 */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              예약 날짜
            </Label>
            <div className="relative" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={reservationDate ? "text-foreground" : "text-muted-foreground"}>
                  {reservationDate ? formatDateDisplay(reservationDate) : "날짜를 선택하세요"}
                </span>
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </button>

              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-50 w-full bg-background border border-input rounded-lg shadow-lg p-4">
                  {/* 월 네비게이션 */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-accent rounded-md transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="text-sm font-semibold">
                      {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                    </div>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-accent rounded-md transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* 요일 헤더 */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 날짜 그리드 */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                      const disabled = isDateDisabled(date);
                      const selected = isDateSelected(date);
                      const todayDate = isToday(date);

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => date && !disabled && handleDateSelect(date)}
                          disabled={disabled}
                          className={`
                            h-9 w-full rounded-md text-sm font-normal transition-colors
                            ${!date ? 'invisible' : ''}
                            ${disabled ? 'text-muted-foreground opacity-40 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'}
                            ${selected ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold' : ''}
                            ${todayDate && !selected ? 'bg-accent text-accent-foreground font-semibold' : ''}
                          `}
                        >
                          {date ? date.getDate() : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 시간 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                시작 시간
              </Label>
              <Select value={startTime} onValueChange={handleStartTimeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="시작 시간" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                종료 시간
              </Label>
              <Select
                value={endTime}
                onValueChange={setEndTime}
                disabled={!startTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="종료 시간" />
                </SelectTrigger>
                <SelectContent>
                  {endTimeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 인원수 선택 */}
          <div className="space-y-2">
            <Label htmlFor="numberOfPeople">이용 인원</Label>
            <Select
              value={numberOfPeople.toString()}
              onValueChange={(value) => setNumberOfPeople(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="인원 선택" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: product.capacity }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}명
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              최대 {product.capacity}명까지 이용 가능합니다.
            </p>
          </div>

          {/* 예약 정보 요약 */}
          {total && (
            <div className="p-4 bg-accent rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">예약 시간</span>
                <span className="font-semibold">{total.hours}시간</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">이용 인원</span>
                <span className="font-semibold">{numberOfPeople}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">시간당 가격</span>
                <span className="font-semibold">
                  {product.pricePerHour.toLocaleString()}원
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="font-semibold">총 금액</span>
                <span className="text-xl font-bold text-primary">
                  {total.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                "처리 중..."
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  결제 및 예약하기
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
