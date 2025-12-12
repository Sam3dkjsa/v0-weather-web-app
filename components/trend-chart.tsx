import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-card p-2 shadow-md">
                    <div className="text-sm font-semibold text-foreground">
                      {payload[0].value} {unit}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
