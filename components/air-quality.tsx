import { Card } from "@/components/ui/card"
import { Wind } from "lucide-react"

interface AirQualityProps {
  airQuality: {
    aqi: number
    category: string
    pm25: number
    pm10: number
    no2: number
    so2: number
    o3: number
    co: number
  }
}

export function AirQuality({ airQuality }: AirQualityProps) {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-500"
    if (aqi <= 100) return "text-yellow-500"
    if (aqi <= 150) return "text-orange-500"
    if (aqi <= 200) return "text-red-500"
    if (aqi <= 300) return "text-purple-500"
    return "text-rose-900"
  }

  const getAQIBgColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500/20 border-green-500/50"
    if (aqi <= 100) return "bg-yellow-500/20 border-yellow-500/50"
    if (aqi <= 150) return "bg-orange-500/20 border-orange-500/50"
    if (aqi <= 200) return "bg-red-500/20 border-red-500/50"
    if (aqi <= 300) return "bg-purple-500/20 border-purple-500/50"
    return "bg-rose-900/20 border-rose-900/50"
  }

  const pollutants = [
    {
      name: "PM2.5",
      value: airQuality.pm25.toFixed(1),
      unit: "µg/m³",
      description: "Fine particles",
    },
    {
      name: "PM10",
      value: airQuality.pm10.toFixed(1),
      unit: "µg/m³",
      description: "Coarse particles",
    },
    {
      name: "NO₂",
      value: airQuality.no2.toFixed(1),
      unit: "µg/m³",
      description: "Nitrogen dioxide",
    },
    {
      name: "SO₂",
      value: airQuality.so2.toFixed(1),
      unit: "µg/m³",
      description: "Sulfur dioxide",
    },
    {
      name: "O₃",
      value: airQuality.o3.toFixed(1),
      unit: "µg/m³",
      description: "Ozone",
    },
    {
      name: "CO",
      value: (airQuality.co / 1000).toFixed(2),
      unit: "mg/m³",
      description: "Carbon monoxide",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main AQI Card */}
      <Card className={`p-6 border-2 ${getAQIBgColor(airQuality.aqi)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Wind className={`w-12 h-12 ${getAQIColor(airQuality.aqi)}`} />
            <div>
              <h3 className="text-2xl font-bold text-foreground">Air Quality Index</h3>
              <p className={`text-lg font-semibold ${getAQIColor(airQuality.aqi)}`}>{airQuality.category}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getAQIColor(airQuality.aqi)}`}>{airQuality.aqi}</div>
            <p className="text-sm text-muted-foreground">US EPA AQI</p>
          </div>
        </div>
      </Card>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pollutants.map((pollutant, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">{pollutant.name}</div>
              <div className="text-2xl font-bold text-foreground">
                {pollutant.value}
                <span className="text-sm text-muted-foreground ml-1">{pollutant.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground">{pollutant.description}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* AQI Scale Reference */}
      <Card className="p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-3">AQI Scale</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-muted-foreground">0-50 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span className="text-muted-foreground">51-100 Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span className="text-muted-foreground">101-150 Unhealthy (SG)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-muted-foreground">151-200 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500" />
              <span className="text-muted-foreground">201-300 Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-rose-900" />
              <span className="text-muted-foreground">301+ Hazardous</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
