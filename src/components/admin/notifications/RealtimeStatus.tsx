'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

/**
 * Realtime 연결 상태 표시 컴포넌트
 * 개발/디버깅 용도
 */
export function RealtimeStatus () {
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState<string>('connecting')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // notifications 테이블에 직접 구독 시도
    const channel = supabase
      .channel('realtime-status-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          // 이벤트 수신 시 연결됨으로 표시
          setIsConnected(true)
          setLastUpdate(new Date())
        }
      )
      .subscribe((subscribeStatus) => {
        console.log('Realtime 구독 상태:', subscribeStatus)
        setStatus(subscribeStatus)
        
        if (subscribeStatus === 'SUBSCRIBED') {
          setIsConnected(true)
          setLastUpdate(new Date())
          setError(null)
        } else if (subscribeStatus === 'CHANNEL_ERROR') {
          setIsConnected(false)
          setError('채널 에러')
        } else if (subscribeStatus === 'TIMED_OUT') {
          setIsConnected(false)
          setError('연결 시간 초과')
        } else if (subscribeStatus === 'CLOSED') {
          setIsConnected(false)
          setError('연결 종료')
        }
      })

    // 연결 상태 주기적 확인
    const interval = setInterval(() => {
      if (channel.state === 'joined') {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shadow-lg cursor-pointer ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
      onClick={() => {
        console.log('Realtime Status:', {
          isConnected,
          status,
          error,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        })
      }}
      title="클릭하여 콘솔에 디버그 정보 출력"
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>실시간 연결됨</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>연결 끊김 {error && `(${error})`}</span>
          </>
        )}
        {!isConnected && (
          <AlertCircle className="w-4 h-4 ml-1" />
        )}
        <span className="text-xs opacity-70 ml-2">
          {status}
        </span>
      </div>
      
      {!isConnected && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-3 text-xs max-w-xs">
          <p className="font-semibold mb-1">연결 문제 해결:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>F12 콘솔 확인</li>
            <li>Supabase Realtime 활성화</li>
            <li>페이지 새로고침</li>
          </ol>
        </div>
      )}
    </div>
  )
}
