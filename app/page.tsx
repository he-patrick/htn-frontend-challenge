"use client"

import { useState, useEffect } from "react"
import type { TEvent } from "@/types/event"
import EventCard from "@/components/event-card"
import LoginForm from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Home() {
  const [events, setEvents] = useState<TEvent[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.hackthenorth.com/v3/events")
      .then((res) => res.json())
      .then((data: TEvent[]) => {
        const sortedEvents = data.sort((a, b) => a.start_time - b.start_time)
        setEvents(sortedEvents)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching events:", error)
        setIsLoading(false)
      })
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || event.event_type === selectedType
    const matchesPermission = isLoggedIn || event.permission !== "private"
    return matchesSearch && matchesType && matchesPermission
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-center text-5xl font-bold text-primary">Hack the North 2025</h1>
          <p className="text-center text-lg text-muted-foreground">Discover amazing events and workshops</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoggedIn ? (
            <Button onClick={() => setIsLoggedIn(false)} variant="secondary">
              Logout
            </Button>
          ) : (
            <LoginForm onLogin={() => setIsLoggedIn(true)} />
          )}
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedType("all")}>
              All Events
            </TabsTrigger>
            <TabsTrigger value="workshop" onClick={() => setSelectedType("workshop")}>
              Workshops
            </TabsTrigger>
            <TabsTrigger value="activity" onClick={() => setSelectedType("activity")}>
              Activities
            </TabsTrigger>
            <TabsTrigger value="tech_talk" onClick={() => setSelectedType("tech_talk")}>
              Tech Talks
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No events found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}