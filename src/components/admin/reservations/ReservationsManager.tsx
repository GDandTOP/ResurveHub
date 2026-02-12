'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  List, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react'
import { ReservationsTable } from './ReservationsTable'
import { ReservationsCalendar } from './ReservationsCalendar'
import { ReservationStats } from './ReservationStats'
import { TodayReservations } from './TodayReservations'

interface ReservationsManagerProps {
  initialReservations: any[]
  todayReservations: any[]
  initialView: 'list' | 'calendar'
  initialStatus: string
  initialSearch: string
}

/**
 * 예약 관리 메인 컴포넌트
 * 필터링, 검색, 뷰 전환 등 모든 기능 통합
 */
export function ReservationsManager ({
  initialReservations,
  todayReservations,
  initialView,
  initialStatus,
  initialSearch
}: ReservationsManagerProps) {
  const [view, setView] = useState<'list' | 'calendar'>(initialView)
  const [status, setStatus] = useState(initialStatus)
  const [search, setSearch] = useState(initialSearch)
  const [showStats, setShowStats] = useState(true)

  // 필터링된 예약
  const filteredReservations = useMemo(() => {
    let filtered = initialReservations

    // 상태 필터
    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status)
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(r =>
        r.users?.name?.toLowerCase().includes(searchLower) ||
        r.users?.email?.toLowerCase().includes(searchLower) ||
        r.products?.name?.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [initialReservations, status, search])

  // 통계 계산
  const stats = useMemo(() => {
    const pending = initialReservations.filter(r => r.status === 'pending').length
    const confirmed = initialReservations.filter(r => r.status === 'confirmed').length
    const cancelled = initialReservations.filter(r => r.status === 'cancelled').length
    const completed = initialReservations.filter(r => r.status === 'completed').length
    
    const totalRevenue = initialReservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)

    return {
      total: initialReservations.length,
      pending,
      confirmed,
      cancelled,
      completed,
      today: todayReservations.length,
      revenue: totalRevenue
    }
  }, [initialReservations, todayReservations])

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 전체 예약 */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                전체 예약
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                오늘 {stats.today}건
              </p>
            </CardContent>
          </Card>

          {/* 승인 대기 */}
          <Card className="border-2 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                승인 대기
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                {stats.pending}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                처리 필요
              </p>
            </CardContent>
          </Card>

          {/* 승인 완료 */}
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                승인 완료
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                {stats.confirmed}
              </div>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                이용 예정
              </p>
            </CardContent>
          </Card>

          {/* 총 매출 */}
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                총 매출
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {(stats.revenue / 10000).toFixed(0)}만
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                완료된 예약
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 오늘의 예약 */}
      {todayReservations.length > 0 && (
        <TodayReservations reservations={todayReservations} />
      )}

      {/* 필터 & 뷰 전환 */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="고객명, 이메일, 상품명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 상태 필터 */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={status === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('all')}
              >
                전체 ({stats.total})
              </Button>
              <Button
                variant={status === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('pending')}
                className="text-yellow-600 border-yellow-300"
              >
                <Clock className="h-3 w-3 mr-1" />
                대기 ({stats.pending})
              </Button>
              <Button
                variant={status === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('confirmed')}
                className="text-green-600 border-green-300"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                승인 ({stats.confirmed})
              </Button>
              <Button
                variant={status === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('completed')}
                className="text-blue-600 border-blue-300"
              >
                완료 ({stats.completed})
              </Button>
              <Button
                variant={status === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('cancelled')}
                className="text-red-600 border-red-300"
              >
                <XCircle className="h-3 w-3 mr-1" />
                취소 ({stats.cancelled})
              </Button>
            </div>

            {/* 뷰 전환 */}
            <div className="flex gap-2">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" />
                목록
              </Button>
              <Button
                variant={view === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                캘린더
              </Button>
            </div>
          </div>

          {/* 결과 카운트 */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {filteredReservations.length}개의 예약이 검색되었습니다
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 메인 컨텐츠 */}
      {view === 'list' ? (
        <ReservationsTable reservations={filteredReservations} />
      ) : (
        <ReservationsCalendar reservations={filteredReservations} />
      )}
    </div>
  )
}
