'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeeklySalesChartProps {
  data: Array<{ date: string, amount: number }>
}

export function WeeklySalesChart ({ data }: WeeklySalesChartProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">주간 매출 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
            />
            <Tooltip 
              formatter={(value: number | undefined) => value !== undefined ? [`${value.toLocaleString()}원`, '매출'] : ['0원', '매출']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="oklch(0.28 0 0)" 
              strokeWidth={2}
              dot={{ fill: 'oklch(0.28 0 0)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
