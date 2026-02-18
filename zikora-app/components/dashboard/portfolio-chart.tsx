'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type ChartDataPoint } from '@/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface PortfolioChartProps {
  data: ChartDataPoint[] | undefined
  isLoading: boolean
}

export function PortfolioChart({ data, isLoading }: PortfolioChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="skeleton-shimmer h-5 w-32 rounded" />
        </CardHeader>
        <CardContent>
          <div className="skeleton-shimmer h-40 md:h-48 w-full rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading">Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 md:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(val) => {
                  const d = new Date(val)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
                stroke="#6B6B8D"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B6B8D"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A26',
                  border: '1px solid hsl(240 17% 19%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#6B6B8D' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FF6B2C"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
