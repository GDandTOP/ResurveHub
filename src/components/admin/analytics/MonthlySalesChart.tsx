'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlySalesChartProps {
  data: Array<{
    month: string
    fullMonth: string
    amount: number
  }>
}

export function MonthlySalesChart ({ data }: MonthlySalesChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">월별 매출 추이 (최근 12개월)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
          />
          <Tooltip 
            formatter={(value) => [`${Number(value).toLocaleString()}원`, '매출']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="amount" 
            fill="#6366f1" 
            radius={[8, 8, 0, 0]}
            name="매출"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
