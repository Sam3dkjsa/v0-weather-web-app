"use client"

import { useEffect, useState } from "react"

interface WeatherAnimationsProps {
  weatherCondition: string
  temperature: number
}

export function WeatherAnimations({ weatherCondition, temperature }: WeatherAnimationsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const condition = weatherCondition.toLowerCase()
  const isRainy = condition.includes("rain") || condition.includes("drizzle")
  const isSnowy = condition.includes("snow") && temperature < 5
  const isCloudy = condition.includes("cloud") || condition.includes("overcast")
  const isSunny = condition.includes("clear") || condition.includes("sun")
  const isThunderstorm = condition.includes("thunder") || condition.includes("storm")

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Clouds */}
      {(isCloudy || isRainy || isThunderstorm) && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`cloud-${i}`}
              className="absolute animate-float-cloud"
              style={{
                top: `${Math.random() * 40}%`,
                left: `-10%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${20 + Math.random() * 10}s`,
                opacity: isThunderstorm ? 0.7 : 0.5,
              }}
            >
              <svg
                width={80 + Math.random() * 60}
                height={40 + Math.random() * 30}
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 35C8 35 5 30 5 25C5 20 8 15 15 15C15 10 20 5 27 5C34 5 38 10 38 15C45 15 50 20 50 27C50 34 45 35 38 35H15Z"
                  fill={isThunderstorm ? "#4B5563" : "#E5E7EB"}
                  opacity="0.8"
                />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Rain */}
      {isRainy && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              <div className="w-0.5 h-4 bg-blue-400/60 rounded-full" />
            </div>
          ))}
        </>
      )}

      {/* Snow */}
      {isSnowy && (
        <>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full opacity-80" />
            </div>
          ))}
        </>
      )}

      {/* Sunbeams */}
      {isSunny && (
        <div className="absolute top-10 right-10 animate-pulse" style={{ animationDuration: "4s" }}>
          <div className="relative w-32 h-32">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`ray-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-b from-yellow-300/40 to-transparent origin-top"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-yellow-300/30 rounded-full blur-xl" />
          </div>
        </div>
      )}

      {/* Lightning for thunderstorms */}
      {isThunderstorm && (
        <div className="absolute inset-0 animate-lightning pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-yellow-200 via-yellow-100 to-transparent opacity-0 animate-lightning-bolt" />
          <div
            className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-yellow-200 via-yellow-100 to-transparent opacity-0 animate-lightning-bolt"
            style={{ animationDelay: "3s" }}
          />
        </div>
      )}
    </div>
  )
}
