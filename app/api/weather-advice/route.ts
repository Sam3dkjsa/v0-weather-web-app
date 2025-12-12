export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json()

    const prompt = `You are a weather advisor. Based on the following weather conditions, provide practical and helpful advice (2-3 sentences):

Temperature: ${weatherData.temperature}°C (Feels like: ${weatherData.feelsLike}°C)
Conditions: ${weatherData.conditions}
Humidity: ${weatherData.humidity}%
Wind Speed: ${weatherData.windSpeed} km/h
UV Index: ${weatherData.uvIndex}
Air Quality Index: ${weatherData.aqi} (${weatherData.aqiCategory})
PM2.5: ${weatherData.pm25} µg/m³

Provide brief, actionable advice about activities, clothing, health precautions, or anything relevant to these conditions.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful weather advisor who provides practical, concise advice based on current weather conditions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const advice = data.choices[0]?.message?.content || "Unable to generate advice at this time."

    return Response.json({ advice })
  } catch (error) {
    console.error("[v0] Weather advice error:", error)
    return Response.json({ error: "Failed to generate weather advice" }, { status: 500 })
  }
}
