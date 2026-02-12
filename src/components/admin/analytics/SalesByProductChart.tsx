'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SalesByProductChartProps {
  data: Array<{
    name: string
    value: number
    count: number
  }>
}

export function SalesByProductChart ({ data }: SalesByProductChartProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">상품별 매출 TOP 10</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
          />
          <YAxis 
            type="category"
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            width={120}
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
            dataKey="value" 
            fill="#8b5cf6" 
            radius={[0, 8, 8, 0]}
            name="매출"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
