'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import type { Product } from '@/types/product'
import { getReservationsForDateRange } from '@/app/actions/products'
import { ReservationForm } from './ReservationForm'

interface AvailableTimeSlotViewProps {
  product: Product
}

type ViewMode = 'daily' | 'weekly'

interface ReservationData {
  reservation_date: string
  start_time: string
  end_time: string
}

export function AvailableTimeSlotView({ product }: AvailableTimeSlotViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  
  // 예약 폼 제어용 상태
  const [reservationFormOpen, setReservationFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedEndTime, setSelectedEndTime] = useState('')

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  // 요일별 시간대 데이터 구조화
  const timeSlotsByDay = product.availableTimeSlots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = []
    }
    acc[slot.dayOfWeek].push(slot)
    return acc
  }, {} as Record<number, typeof product.availableTimeSlots>)

  // 이번 주의 시작일과 종료일 계산
  const getWeekRange = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day
    const weekStart = new Date(date)
    weekStart.setDate(diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    return { weekStart, weekEnd }
  }

  // 이번 달의 시작일과 종료일 계산
  const getMonthRange = (date: Date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return { monthStart, monthEnd }
  }

  // 예약 데이터 로드
  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true)
      try {
        let startDate: Date
        let endDate: Date
        
        if (viewMode === 'daily') {
          const { weekStart, weekEnd } = getWeekRange(currentDate)
          startDate = weekStart
          endDate = weekEnd
        } else {
          const { monthStart, monthEnd } = getMonthRange(currentDate)
          startDate = monthStart
          endDate = monthEnd
        }
        
        const data = await getReservationsForDateRange(
          product.id,
          startDate,
          endDate
        )
        setReservations(data)
      } catch (error) {
        console.error('예약 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReservations()
  }, [product.id, currentDate, viewMode])

  // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (시간대 문제 방지)
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 특정 날짜의 예약 조회
  const getReservationsForDay = (date: Date) => {
    const dateStr = formatDateToString(date)
    return reservations.filter(r => r.reservation_date === dateStr)
  }

  // 시간이 예약된 시간대에 포함되는지 확인
  const isTimeReserved = (date: Date, startTime: string, endTime: string) => {
    const dayReservations = getReservationsForDay(date)
    return dayReservations.some(r => {
      // 시간 문자열 정규화 (HH:mm 또는 HH:mm:ss 형식 지원)
      const rStart = r.start_time.substring(0, 5)
      const rEnd = r.end_time.substring(0, 5)
      const slotStart = startTime.substring(0, 5)
      const slotEnd = endTime.substring(0, 5)
      // 시간 겹침 확인
      return !(slotEnd <= rStart || slotStart >= rEnd)
    })
  }

  // 시간대별 예약 상태 확인 (1시간 단위)
  const getHourlyReservationStatus = (date: Date, hour: number) => {
    const dateStr = formatDateToString(date)
    const dayReservations = reservations.filter(r => r.reservation_date === dateStr)
    
    // 해당 시간에 예약이 있는지 확인
    const currentTimeStart = `${hour.toString().padStart(2, '0')}:00`
    const currentTimeEnd = `${(hour + 1).toString().padStart(2, '0')}:00`
    
    return dayReservations.some(r => {
      const rStart = r.start_time.substring(0, 5)
      const rEnd = r.end_time.substring(0, 5)
      // 시간 겹침 확인
      return !(currentTimeEnd <= rStart || currentTimeStart >= rEnd)
    })
  }

  // 시간대 클릭 핸들러 (일별 보기)
  const handleTimeSlotClick = (date: Date, hour: number) => {
    const dateStr = formatDateToString(date)
    const startTime = `${hour.toString().padStart(2, '0')}:00`
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
    
    setSelectedDate(dateStr)
    setSelectedStartTime(startTime)
    setSelectedEndTime(endTime)
    setReservationFormOpen(true)
  }

  // 날짜 클릭 핸들러 (월별 보기)
  const handleDateClick = (date: Date) => {
    const dateStr = formatDateToString(date)
    const dayReservations = getReservationsForDay(date)
    
    // 하루 종일 예약이 꽉 찬 경우 체크
    const totalAvailableHours = 13 // 09:00 ~ 22:00
    const reservedHours = new Set<number>()
    
    dayReservations.forEach(res => {
      const startHour = parseInt(res.start_time.split(':')[0])
      const endHour = parseInt(res.end_time.split(':')[0])
      for (let h = startHour; h < endHour; h++) {
        reservedHours.add(h)
      }
    })
    
    // 예약 가능한 시간이 있는 경우에만 열기
    if (reservedHours.size < totalAvailableHours) {
      setSelectedDate(dateStr)
      setSelectedStartTime('')
      setSelectedEndTime('')
      setReservationFormOpen(true)
    }
  }

  // 일별 보기 (이번 주)
  const renderDailyView = () => {
    const { weekStart } = getWeekRange(currentDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date
    })

    // 오늘 이후의 날짜만 필터링 (주말 포함)
    const filteredDays = weekDays.filter(date => {
      const isPast = date < today
      return !isPast
    })

    // 09:00 ~ 22:00 시간대 생성 (13시간)
    const hours = Array.from({ length: 13 }, (_, i) => 9 + i)

    return (
      <div className="space-y-4">
        {/* 주 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() - 7)
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            이전 주
          </Button>
          <div className="text-base font-semibold">
            {weekStart.getMonth() + 1}월 {weekStart.getDate()}일 - {weekDays[6].getMonth() + 1}월 {weekDays[6].getDate()}일
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() + 7)
              setCurrentDate(newDate)
            }}
          >
            다음 주
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
        ) : filteredDays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            이번 주에 예약 가능한 날짜가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDays.map((date) => {
              const dayOfWeek = date.getDay()
              const slots = timeSlotsByDay[dayOfWeek] || []
              const isToday = formatDateToString(date) === formatDateToString(today)

              if (slots.length === 0) {
                return (
                  <div
                    key={date.toISOString()}
                    className={`p-4 rounded-lg border ${
                      isToday ? 'border-primary bg-primary/5' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-semibold ${isToday ? 'text-primary' : ''}`}>
                          {date.getMonth() + 1}월 {date.getDate()}일 ({dayNames[dayOfWeek]})
                          {isToday && ' (오늘)'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">휴무</span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={date.toISOString()}
                  className={`p-4 rounded-lg border ${
                    isToday ? 'border-primary bg-primary/5' : 'bg-secondary'
                  }`}
                >
                  {/* 날짜 헤더 */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`font-semibold text-base ${isToday ? 'text-primary' : ''}`}>
                      {date.getMonth() + 1}월 {date.getDate()}일 ({dayNames[dayOfWeek]})
                      {isToday && ' (오늘)'}
                    </span>
                  </div>

                  {/* 타임테이블 (가로 스크롤) */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-1 min-w-max pb-2">
                      {hours.map((hour) => {
                        const isReserved = getHourlyReservationStatus(date, hour)
                        const hourStr = hour.toString().padStart(2, '0')
                        
                        return (
                          <div
                            key={hour}
                            onClick={() => !isReserved && handleTimeSlotClick(date, hour)}
                            className={`flex-shrink-0 w-16 sm:w-20 px-2 py-3 rounded-md text-center border-2 transition-all ${
                              isReserved
                                ? 'bg-red-100 text-red-800 border-red-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-800 border-green-400 hover:bg-green-200 cursor-pointer hover:shadow-md'
                            }`}
                          >
                            <div className="text-xs font-semibold">{hourStr}:00</div>
                            <div className="text-[10px] mt-1">
                              {isReserved ? '예약' : '가능'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 범례 */}
        <div className="flex items-center justify-center gap-6 text-sm pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400" />
            <span>예약 가능</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-400" />
            <span>예약됨</span>
          </div>
        </div>
      </div>
    )
  }

  // 주별 보기 (캘린더 형식)
  const renderWeeklyView = () => {
    const { monthStart, monthEnd } = getMonthRange(currentDate)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // 달력 생성
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // 현재 달의 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
      <div className="space-y-4">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() - 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            이전 달
          </Button>
          <div className="text-lg font-bold">
            {year}년 {month + 1}월
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() + 1)
              setCurrentDate(newDate)
            }}
          >
            다음 달
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
        ) : (
          <>
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="min-h-[100px]" />
                }

                const dayOfWeek = date.getDay()
                const slots = timeSlotsByDay[dayOfWeek] || []
                const isToday = formatDateToString(date) === formatDateToString(today)
                const isPast = date < today
                const dayReservations = getReservationsForDay(date)
                const hasReservations = dayReservations.length > 0
                
                // 클릭 가능 여부 판단
                const isClickable = !isPast && slots.length > 0

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => isClickable && handleDateClick(date)}
                    className={`min-h-[100px] p-2 rounded-lg border transition-all ${
                      isToday
                        ? 'border-primary bg-primary/10 shadow-md'
                        : slots.length === 0
                        ? 'bg-muted/50 border-muted'
                        : hasReservations
                        ? 'bg-yellow-50 border-yellow-200 hover:shadow-md cursor-pointer'
                        : isPast
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : 'bg-green-50 border-green-200 hover:shadow-md cursor-pointer'
                    } ${isClickable ? 'hover:scale-[1.02]' : ''}`}
                  >
                    <div className="h-full flex flex-col">
                      <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-primary' : ''}`}>
                        {date.getDate()}
                      </div>
                      
                      {slots.length === 0 ? (
                        <div className="text-xs text-muted-foreground">휴무</div>
                      ) : hasReservations ? (
                        <div className="flex-1 flex flex-col gap-1 overflow-auto">
                          {dayReservations.map((res, idx) => (
                            <div 
                              key={idx} 
                              className="text-[9px] leading-tight bg-yellow-300 text-yellow-900 rounded px-1 py-0.5 font-medium border border-yellow-500" 
                              title={`${res.start_time.substring(0, 5)} - ${res.end_time.substring(0, 5)}`}
                            >
                              <div className="break-all whitespace-normal">
                                {res.start_time.substring(0, 5)} ~ {res.end_time.substring(0, 5)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : isPast ? (
                        <div className="text-xs text-gray-500"></div>
                      ) : (
                        <div className="text-xs text-green-700 font-medium">예약 가능</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* 범례 */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/10 border border-primary" />
            <span>오늘</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
            <span>예약 가능</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-50 border border-yellow-200" />
            <span>예약 있음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted border border-muted" />
            <span>휴무</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              이용 가능 시간
            </CardTitle>
            <CardDescription>
              예약 가능한 날짜와 시간대를 확인하세요
            </CardDescription>
          </div>
        </div>

        {/* 뷰 모드 선택 버튼 */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('daily')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            이번 주
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('weekly')}
            className="flex-1"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            월별 캘린더
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === 'daily' && renderDailyView()}
        {viewMode === 'weekly' && renderWeeklyView()}
      </CardContent>
    </Card>

    {/* 숨겨진 예약 폼 - 시간대/날짜 클릭 시 열림 */}
    <div className="hidden">
      <ReservationForm
        product={product}
        initialOpen={reservationFormOpen}
        initialDate={selectedDate}
        initialStartTime={selectedStartTime}
        initialEndTime={selectedEndTime}
        onOpenChange={setReservationFormOpen}
      />
    </div>
    </>
  )
}
