import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string
  unit: string
  subtext: string
  trend?: string
  subtextColor?: string
}

export function MetricCard({ icon, label, value, unit, subtext, trend, subtextColor }: MetricCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        {trend && <span className="text-sm text-muted-foreground">{trend}</span>}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground font-medium">{unit}</span>
        </div>
        <p className={`text-xs ${subtextColor || "text-muted-foreground"}`}>{subtext}</p>
      </div>
    </Card>
  )
}
