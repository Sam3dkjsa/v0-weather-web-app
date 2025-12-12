export interface WeatherData {
  location: string
  current: {
    temperature: number
    feelsLike: number
    description: string
    icon: string
    humidity: number
    windSpeed: number
    windDirection: number
    pressure: number
    visibility: number
    uvIndex: number
    sunrise: string
    sunset: string
  }
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
  hourly: Array<{
    time: string
    temperature: number
    icon: string
    precipitation: number
  }>
  daily: Array<{
    date: string
    maxTemp: number
    minTemp: number
    icon: string
    description: string
    precipitation: number
  }>
}

function getWeatherIcon(iconCode: string): string {
  const weatherIcons: { [key: string]: string } = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "🌤️",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "🌨️",
    "13n": "🌨️",
    "50d": "🌫️",
    "50n": "🌫️",
  }

  return weatherIcons[iconCode] || "☀️"
}

function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  }

  return descriptions[code] || "Unknown"
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

function calculateAQI(pm25: number): number {
  // US EPA AQI calculation for PM2.5
  const breakpoints = [
    { low: 0, high: 12, aqiLow: 0, aqiHigh: 50 },
    { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
    { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
    { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
    { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
    { low: 250.5, high: 500, aqiLow: 301, aqiHigh: 500 },
  ]

  for (const bp of breakpoints) {
    if (pm25 >= bp.low && pm25 <= bp.high) {
      const aqi = ((bp.aqiHigh - bp.aqiLow) / (bp.high - bp.low)) * (pm25 - bp.low) + bp.aqiLow
      return Math.round(aqi)
    }
  }

  return pm25 > 500 ? 500 : 0
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const API_KEY = "44bbe22f280f0ca7d39c634e8d1f879f"

  // OpenWeather API endpoints
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`

  const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
    fetch(currentWeatherUrl),
    fetch(forecastUrl),
    fetch(airQualityUrl),
  ])

  const currentData = await currentResponse.json()
  const forecastData = await forecastResponse.json()
  const airData = await airQualityResponse.json()

  console.log("[v0] Current Weather Data:", currentData)
  console.log("[v0] Forecast Data:", forecastData.list?.length || 0)
  console.log("[v0] Air Quality Data:", airData)

  // Format sunrise/sunset times
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Process hourly data (OpenWeather forecast is 3-hour intervals)
  const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }),
    temperature: Math.round(item.main.temp),
    icon: getWeatherIcon(item.weather[0].icon),
    precipitation: item.pop ? Math.round(item.pop * 100) : 0,
  }))

  // Process daily data - group forecast by day
  const dailyMap = new Map()
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString()
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        precipitation: item.pop || 0,
      })
    }
    dailyMap.get(date).temps.push(item.main.temp)
  })

  const daily = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([date, data]: [string, any], index: number) => ({
      date: index === 0 ? "Today" : new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      maxTemp: Math.round(Math.max(...data.temps)),
      minTemp: Math.round(Math.min(...data.temps)),
      icon: getWeatherIcon(data.icon),
      description: data.description,
      precipitation: Math.round(data.precipitation * 100),
    }))

  // Get air quality data
  const aqiValue = airData.list[0]?.main.aqi || 1
  const components = airData.list[0]?.components || {}

  // Convert OpenWeather AQI (1-5) to US EPA scale (0-500)
  const aqiMap: { [key: number]: number } = {
    1: 25, // Good
    2: 75, // Fair
    3: 125, // Moderate
    4: 175, // Poor
    5: 300, // Very Poor
  }
  const aqi = aqiMap[aqiValue] || 50

  const weatherDetails = {
    visibility: Math.round(currentData.visibility / 1000),
    pressure: currentData.main.pressure,
    uvIndex: 0,
    windSpeed: Math.round(currentData.wind.speed * 3.6),
    humidity: currentData.main.humidity,
  }
  console.log("[v0] Weather Details:", weatherDetails)

  return {
    location: `${currentData.name}, ${currentData.sys.country}`,
    current: {
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      description: currentData.weather[0].description,
      icon: getWeatherIcon(currentData.weather[0].icon),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: currentData.wind.deg,
      pressure: currentData.main.pressure,
      visibility: currentData.visibility, // Keep in meters for now
      uvIndex: 0, // OpenWeather free tier doesn't include UV
      sunrise: formatTime(currentData.sys.sunrise),
      sunset: formatTime(currentData.sys.sunset),
    },
    airQuality: {
      aqi,
      category: getAQICategory(aqi),
      pm25: components.pm2_5 || 0,
      pm10: components.pm10 || 0,
      no2: components.no2 || 0,
      so2: components.so2 || 0,
      o3: components.o3 || 0,
      co: components.co || 0,
    },
    hourly,
    daily,
  }
}

export async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
    )
    const data = await response.json()

    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village
      const country = data.address.country
      return city ? `${city}, ${country}` : country || "Unknown Location"
    }

    return "Unknown Location"
  } catch {
    return "Unknown Location"
  }
}
