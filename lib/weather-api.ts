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

function getWeatherIcon(code: number, isDay = true): string {
  const weatherIcons: { [key: number]: { day: string; night: string } } = {
    0: { day: "☀️", night: "🌙" },
    1: { day: "🌤️", night: "🌙" },
    2: { day: "⛅", night: "☁️" },
    3: { day: "☁️", night: "☁️" },
    45: { day: "🌫️", night: "🌫️" },
    48: { day: "🌫️", night: "🌫️" },
    51: { day: "🌦️", night: "🌧️" },
    53: { day: "🌦️", night: "🌧️" },
    55: { day: "🌧️", night: "🌧️" },
    61: { day: "🌧️", night: "🌧️" },
    63: { day: "🌧️", night: "🌧️" },
    65: { day: "🌧️", night: "🌧️" },
    71: { day: "🌨️", night: "🌨️" },
    73: { day: "🌨️", night: "🌨️" },
    75: { day: "🌨️", night: "🌨️" },
    77: { day: "🌨️", night: "🌨️" },
    80: { day: "🌦️", night: "🌧️" },
    81: { day: "🌧️", night: "🌧️" },
    82: { day: "⛈️", night: "🌧️" },
    85: { day: "🌨️", night: "🌨️" },
    86: { day: "🌨️", night: "🌨️" },
    95: { day: "⛈️", night: "⛈️" },
    96: { day: "⛈️", night: "⛈️" },
    99: { day: "⛈️", night: "⛈️" },
  }

  const icon = weatherIcons[code] || weatherIcons[0]
  return isDay ? icon.day : icon.night
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
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi`

  const [weatherResponse, airQualityResponse] = await Promise.all([fetch(weatherUrl), fetch(airQualityUrl)])

  const data = await weatherResponse.json()
  const airData = await airQualityResponse.json()

  // Get location name
  const locationName = await getLocationName(lat, lon)

  // Format sunrise/sunset times
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Process hourly data
  const hourly = data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
    time: new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }),
    temperature: data.hourly.temperature_2m[index],
    icon: getWeatherIcon(data.hourly.weather_code[index], true),
    precipitation: data.hourly.precipitation_probability[index] || 0,
  }))

  // Process daily data
  const daily = data.daily.time.map((date: string, index: number) => ({
    date: index === 0 ? "Today" : new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    maxTemp: data.daily.temperature_2m_max[index],
    minTemp: data.daily.temperature_2m_min[index],
    icon: getWeatherIcon(data.daily.weather_code[index], true),
    description: getWeatherDescription(data.daily.weather_code[index]),
    precipitation: data.daily.precipitation_probability_max[index] || 0,
  }))

  const pm25 = airData.current.pm2_5 || 0
  const aqi = airData.current.us_aqi || calculateAQI(pm25)

  return {
    location: locationName,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      description: getWeatherDescription(data.current.weather_code),
      icon: getWeatherIcon(data.current.weather_code, true),
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.pressure_msl,
      visibility: data.current.visibility,
      uvIndex: data.current.uv_index,
      sunrise: formatTime(data.daily.sunrise[0]),
      sunset: formatTime(data.daily.sunset[0]),
    },
    airQuality: {
      aqi,
      category: getAQICategory(aqi),
      pm25: airData.current.pm2_5 || 0,
      pm10: airData.current.pm10 || 0,
      no2: airData.current.nitrogen_dioxide || 0,
      so2: airData.current.sulphur_dioxide || 0,
      o3: airData.current.ozone || 0,
      co: airData.current.carbon_monoxide || 0,
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
