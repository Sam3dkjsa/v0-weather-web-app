import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ReactNode } from "react"

interface TrendChartProps {
  title: string
  icon: ReactNode
  data: Array<{ time: string; value: number }>
  unit: string
  color: string
}

export function TrendChart({ title, icon, data, unit, color }: TrendChartProps) {
  return (
    <Card className="p-6 bg-sky-50 dark:bg-sky-950/20">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={13}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={13}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <div className="text-xs text-muted-foreground mb-1">{payload[0].payload.time}</div>
                    <div className="text-base font-bold" style={{ color }}>
                      {payload[0].value} {unit}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill={`url(#gradient-${title})`}
            dot={{ fill: color, strokeWidth: 2, r: 5, fillOpacity: 1 }}
            activeDot={{ r: 7, strokeWidth: 2, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
