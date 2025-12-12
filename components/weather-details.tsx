import { Card } from "@/components/ui/card"
import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Compass } from "lucide-react"

interface WeatherDetailsProps {
  current: {
    humidity: number
    windSpeed: number
    windDirection: number
    pressure: number
    visibility: number
    uvIndex: number
    sunrise: string
    sunset: string
  }
}

export function WeatherDetails({ current }: WeatherDetailsProps) {
  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return "Low"
    if (uv <= 5) return "Moderate"
    if (uv <= 7) return "High"
    if (uv <= 10) return "Very High"
    return "Extreme"
  }

  const details = [
    {
      icon: <Droplets className="w-6 h-6 text-accent" />,
      label: "Humidity",
      value: `${current.humidity}%`,
    },
    {
      icon: <Wind className="w-6 h-6 text-primary" />,
      label: "Wind Speed",
      value: `${Math.round(current.windSpeed)} km/h`,
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      label: "Wind Direction",
      value: getWindDirection(current.windDirection),
    },
    {
      icon: <Gauge className="w-6 h-6 text-muted-foreground" />,
      label: "Pressure",
      value: `${current.pressure} hPa`,
    },
    {
      icon: <Eye className="w-6 h-6 text-muted-foreground" />,
      label: "Visibility",
      value: `${(current.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: <span className="text-2xl">☀️</span>,
      label: "UV Index",
      value: `${current.uvIndex} (${getUVLevel(current.uvIndex)})`,
    },
    {
      icon: <Sunrise className="w-6 h-6 text-destructive" />,
      label: "Sunrise",
      value: current.sunrise,
    },
    {
      icon: <Sunset className="w-6 h-6 text-primary" />,
      label: "Sunset",
      value: current.sunset,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {details.map((detail, index) => (
        <Card key={index} className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {detail.icon}
              <span className="text-sm text-muted-foreground">{detail.label}</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{detail.value}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
