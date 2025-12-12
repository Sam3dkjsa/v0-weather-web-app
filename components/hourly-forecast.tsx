import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface HourlyData {
  time: string
  temperature: number
  icon: string
  precipitation: number
}

interface HourlyForecastProps {
  hourly: HourlyData[]
  unit: "celsius" | "fahrenheit"
  convertTemp: (temp: number) => number
}

export function HourlyForecast({ hourly, unit, convertTemp }: HourlyForecastProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weather Forecast (4-Hour Intervals)</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {hourly.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[90px] p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm text-muted-foreground font-medium">{hour.time}</span>
              <span className="text-4xl my-1">{hour.icon}</span>
              <span className="text-xl font-bold text-foreground">{convertTemp(hour.temperature)}°</span>
              <div className="flex items-center gap-1 text-xs text-accent">
                <span>💧</span>
                <span>{hour.precipitation}%</span>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  )
}
