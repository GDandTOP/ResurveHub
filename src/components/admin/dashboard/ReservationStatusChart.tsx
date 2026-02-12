'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ReservationStatusChartProps {
  data: Array<{ name: string, value: number }>
}

const COLORS = {
  '대기': '#f59e0b',
  '확정': '#10b981',
  '취소': '#ef4444',
  '완료': '#6b7280'
}

export function ReservationStatusChart ({ data }: ReservationStatusChartProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">예약 상태 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}건`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number | undefined) => value !== undefined ? [`${value}건`, '예약'] : ['0건', '예약']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
