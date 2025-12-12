"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  CloudRain,
  RefreshCw,
  Download,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Gauge,
  SunIcon,
  Calendar,
} from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { TrendChart } from "@/components/trend-chart"
import { WeatherSidebar } from "@/components/weather-sidebar"
import { getWeatherData, type WeatherData } from "@/lib/weather-api"

export default function WeatherApp() {
  const [location, setLocation] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Load user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeather(latitude, longitude)
        },
        () => {
          fetchWeather(40.7128, -74.006)
        },
      )
    }
  }, [])

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true)
    setError("")
    try {
      const data = await getWeatherData(lat, lon)
      setWeatherData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!location.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const { latitude, longitude } = data.results[0]
        await fetchWeather(latitude, longitude)
      } else {
        setError("Location not found")
      }
    } catch (err) {
      setError("Failed to search location")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (weatherData) {
      const [lat, lon] = weatherData.coordinates
      fetchWeather(lat, lon)
    }
  }

  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  const getTimeAgo = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Navigation */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CloudRain className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold text-foreground">EcoWeather Pro</span>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <button className="text-foreground font-medium border-b-2 border-primary pb-1">Dashboard</button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">Weather</button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">Air Quality</button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{getTimeAgo()}</span>
              </div>
              {weatherData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{weatherData.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {weatherData && (
        <div className="container mx-auto px-6 py-8">
          <div className="flex lg:flex-row flex-col gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Page Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Environmental Dashboard</h1>
                  <p className="text-muted-foreground text-sm">
                    Real-time environmental monitoring for {weatherData.location} • Last updated: {getTimeAgo()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  icon={<Thermometer className="w-5 h-5 text-primary" />}
                  label="Temperature"
                  value={`${convertTemp(weatherData.current.temperature)}`}
                  unit={unit === "celsius" ? "°C" : "°F"}
                  subtext="Comfortable range"
                  trend={`${convertTemp(weatherData.current.feelsLike)}°`}
                />
                <MetricCard
                  icon={<Wind className="w-5 h-5 text-primary" />}
                  label="Air Quality Index"
                  value={weatherData.airQuality.aqi.toString()}
                  unit="AQI"
                  subtext={weatherData.airQuality.category}
                  subtextColor={weatherData.airQuality.aqi <= 50 ? "text-green-600" : "text-yellow-600"}
                />
                <MetricCard
                  icon={<Droplets className="w-5 h-5 text-primary" />}
                  label="Humidity"
                  value={weatherData.current.humidity.toString()}
                  unit="%"
                  subtext="Optimal humidity"
                />
                <MetricCard
                  icon={<CloudRain className="w-5 h-5 text-primary" />}
                  label="PM2.5 Levels"
                  value={weatherData.airQuality.pm25.toFixed(1)}
                  unit="µg/m³"
                  subtext={weatherData.airQuality.pm25 < 12 ? "Good quality" : "Elevated"}
                  subtextColor={weatherData.airQuality.pm25 < 12 ? "text-green-600" : "text-orange-600"}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart
                  title="Temperature Trend"
                  icon={<Thermometer className="w-5 h-5 text-muted-foreground" />}
                  data={weatherData.hourly.slice(0, 24).map((h, i) => ({
                    time: new Date(h.time).getHours().toString().padStart(2, "0") + ":00",
                    value: convertTemp(h.temperature),
                  }))}
                  unit={unit === "celsius" ? "°C" : "°F"}
                  color="hsl(var(--chart-1))"
                />
                <TrendChart
                  title="Air Quality Index"
                  icon={<Wind className="w-5 h-5 text-muted-foreground" />}
                  data={weatherData.daily.slice(0, 7).map((d, i) => ({
                    time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
                    value: Math.floor(50 + Math.random() * 50), // Simulated AQI data
                  }))}
                  unit="AQI"
                  color="hsl(var(--chart-2))"
                />
              </div>

              {/* Additional Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Additional Weather Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Eye className="w-4 h-4" />
                      <span>Visibility</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">
                      {(weatherData.current.visibility / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Gauge className="w-4 h-4" />
                      <span>Pressure</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{weatherData.current.pressure} hPa</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <SunIcon className="w-4 h-4" />
                      <span>UV Index</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{weatherData.current.uvIndex}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Wind className="w-4 h-4" />
                      <span>Wind Speed</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{weatherData.current.windSpeed} km/h</p>
                  </div>
                </div>
              </Card>

              {/* Pollutants Detail */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Air Quality Pollutants</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: "PM2.5", value: weatherData.airQuality.pm25.toFixed(1), unit: "µg/m³" },
                    { name: "PM10", value: weatherData.airQuality.pm10.toFixed(1), unit: "µg/m³" },
                    { name: "NO₂", value: weatherData.airQuality.no2.toFixed(1), unit: "µg/m³" },
                    { name: "SO₂", value: weatherData.airQuality.so2.toFixed(1), unit: "µg/m³" },
                    { name: "O₃", value: weatherData.airQuality.o3.toFixed(1), unit: "µg/m³" },
                    { name: "CO", value: (weatherData.airQuality.co / 1000).toFixed(2), unit: "mg/m³" },
                  ].map((pollutant, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs font-medium text-primary mb-1">{pollutant.name}</div>
                      <div className="text-xl font-bold text-foreground">
                        {pollutant.value}
                        <span className="text-xs text-muted-foreground ml-1">{pollutant.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 7-Day Forecast */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  7-Day Forecast
                </h3>
                <div className="space-y-3">
                  {weatherData.daily.slice(0, 7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-sm font-medium text-foreground w-16">
                          {index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <div className="text-2xl">{day.icon}</div>
                        <span className="text-sm text-muted-foreground capitalize">{day.description}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          {day.precipitationProbability}%
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          <span className="text-primary">{convertTemp(day.maxTemp)}°</span>
                          <span className="text-muted-foreground mx-2">/</span>
                          <span>{convertTemp(day.minTemp)}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <WeatherSidebar
              location={weatherData.location}
              coordinates={weatherData.coordinates}
              onSearch={handleSearch}
              searchValue={location}
              onSearchChange={setLocation}
              unit={unit}
              onUnitChange={setUnit}
              currentTemp={convertTemp(weatherData.current.temperature)}
              aqi={weatherData.airQuality.aqi}
            />
          </div>
        </div>
      )}
    </div>
  )
}
