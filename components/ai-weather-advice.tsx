"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface WeatherData {
  current: {
    temperature: number
    feelsLike: number
    conditions: string
    humidity: number
    windSpeed: number
    uvIndex: number
  }
  airQuality: {
    aqi: number
    category: string
    pm25: number
  }
}

interface AIWeatherAdviceProps {
  weatherData: WeatherData | null
}

export function AIWeatherAdvice({ weatherData }: AIWeatherAdviceProps) {
  const [advice, setAdvice] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdvice = async () => {
    if (!weatherData) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/weather-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData: {
            temperature: weatherData.current.temperature,
            feelsLike: weatherData.current.feelsLike,
            conditions: weatherData.current.conditions,
            humidity: weatherData.current.humidity,
            windSpeed: weatherData.current.windSpeed,
            uvIndex: weatherData.current.uvIndex,
            aqi: weatherData.airQuality.aqi,
            aqiCategory: weatherData.airQuality.category,
            pm25: weatherData.airQuality.pm25,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch advice")
      }

      const data = await response.json()
      setAdvice(data.advice)
    } catch (err) {
      console.error("[v0] Error fetching advice:", err)
      setError("Unable to generate weather advice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weatherData) {
      fetchAdvice()
    }
  }, [weatherData])

  if (!weatherData) return null

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">AI Weather Insights</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchAdvice} disabled={loading} className="h-8 px-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            Generating personalized advice...
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && advice && <p>{advice}</p>}
        {!loading && !error && !advice && (
          <p className="text-gray-500">Click refresh to get AI-powered weather advice</p>
        )}
      </div>
    </Card>
  )
}
