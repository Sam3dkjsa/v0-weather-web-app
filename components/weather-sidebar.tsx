"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Bell, ChevronRight, Plus, X } from "lucide-react"

interface SavedLocation {
  name: string
  lat: number
  lon: number
}

interface SearchResult {
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
}

interface WeatherSidebarProps {
  location: string
  coordinates: [number, number] | null
  onSearch: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  unit: "celsius" | "fahrenheit"
  onUnitChange: (unit: "celsius" | "fahrenheit") => void
  currentTemp: number
  aqi: number
  savedLocations: SavedLocation[]
  onAddLocation: () => void
  onRemoveLocation: (index: number) => void
  onSelectLocation: (location: SavedLocation) => void
  searchResults: SearchResult[]
  onSelectSearchResult: (result: SearchResult) => void
}

export function WeatherSidebar({
  location,
  coordinates,
  onSearch,
  searchValue,
  onSearchChange,
  unit,
  onUnitChange,
  currentTemp,
  aqi,
  savedLocations,
  onAddLocation,
  onRemoveLocation,
  onSelectLocation,
  searchResults,
  onSelectSearchResult,
}: WeatherSidebarProps) {
  return (
    <div className="lg:w-80 space-y-4">
      {/* Location Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Location</h3>
          <Button onClick={onAddLocation} variant="ghost" size="sm" className="h-7 px-2">
            <Plus className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between group hover:bg-muted transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{location}</p>
              <p className="text-xs text-muted-foreground">
                {coordinates && coordinates.length === 2
                  ? `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`
                  : "Loading..."}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search location..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="pl-9 h-9 text-sm"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto border border-border rounded-lg bg-card">
              <div className="p-2 space-y-1">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSearchResult(result)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.admin1 && `${result.admin1}, `}
                          {result.country}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {savedLocations.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Saved Locations</h3>
          <div className="space-y-2">
            {savedLocations.map((loc, index) => (
              <div
                key={index}
                className="p-2.5 bg-muted/50 rounded-lg flex items-center justify-between group hover:bg-muted transition-colors cursor-pointer"
                onClick={(e) => {
                  console.log("[v0] Clicked saved location:", loc)
                  onSelectLocation(loc)
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{loc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveLocation(index)
                  }}
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Environmental Alerts */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Environmental Alerts</h3>
          <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
            <span className="text-xs text-white font-semibold">1</span>
          </div>
        </div>
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">Environmental Data Updated</p>
              <p className="text-xs text-muted-foreground mb-2">Latest readings for {location} are now available.</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
                <span className="ml-2">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Temperature Toggle */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Temperature Unit</h3>
        <div className="flex gap-2">
          <Button
            variant={unit === "celsius" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onUnitChange("celsius")}
          >
            °C
          </Button>
          <Button
            variant={unit === "fahrenheit" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onUnitChange("fahrenheit")}
          >
            °F
          </Button>
        </div>
      </Card>
    </div>
  )
}
