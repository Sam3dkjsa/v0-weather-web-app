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
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {hourly.slice(0, 24).map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground font-medium">{hour.time}</span>
              <span className="text-3xl">{hour.icon}</span>
              <span className="text-lg font-semibold text-foreground">{convertTemp(hour.temperature)}°</span>
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
