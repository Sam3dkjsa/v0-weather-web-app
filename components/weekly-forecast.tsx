import { Card } from "@/components/ui/card"

interface DailyData {
  date: string
  maxTemp: number
  minTemp: number
  icon: string
  description: string
  precipitation: number
}

interface WeeklyForecastProps {
  daily: DailyData[]
  unit: "celsius" | "fahrenheit"
  convertTemp: (temp: number) => number
}

export function WeeklyForecast({ daily, unit, convertTemp }: WeeklyForecastProps) {
  return (
    <div className="grid gap-2">
      {daily.map((day, index) => (
        <Card key={index} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm font-medium text-foreground min-w-[80px]">{day.date}</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{day.icon}</span>
                <span className="text-sm text-muted-foreground capitalize hidden sm:block">{day.description}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-accent">
                <span>💧</span>
                <span>{day.precipitation}%</span>
              </div>
              <div className="flex items-center gap-2 min-w-[120px] justify-end">
                <span className="text-muted-foreground">{convertTemp(day.minTemp)}°</span>
                <div className="h-1.5 w-16 bg-gradient-to-r from-accent via-primary to-destructive rounded-full" />
                <span className="text-foreground font-semibold">{convertTemp(day.maxTemp)}°</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
