'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DailyReservationsChartProps {
  data: Array<{
    date: string
    fullDate: string
    count: number
  }>
}

export function DailyReservationsChart ({ data }: DailyReservationsChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">일별 예약 건수</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            formatter={(value) => [`${Number(value)}건`, '예약']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            name="예약 건수"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
