'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts'

interface DayOfWeekChartProps {
  data: Array<{
    day: string
    count: number
  }>
}

export function DayOfWeekChart ({ data }: DayOfWeekChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">요일별 예약 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="day" 
            stroke="#6b7280"
            fontSize={12}
          />
          <PolarRadiusAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Radar 
            name="예약 건수" 
            dataKey="count" 
            stroke="#ec4899" 
            fill="#ec4899" 
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Legend />
          <Tooltip 
            formatter={(value) => [`${Number(value)}건`, '예약']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
