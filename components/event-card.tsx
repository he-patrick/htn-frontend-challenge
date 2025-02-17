import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react"
import type { TEvent } from "@/types/event"
import { cn } from "@/lib/utils"

const eventTypeColors = {
  workshop: "bg-primary text-primary-foreground",
  activity: "bg-secondary text-secondary-foreground",
  tech_talk: "bg-accent text-accent-foreground",
}

export default function EventCard({
  event,
  isLoggedIn,
}: {
  event: TEvent
  isLoggedIn: boolean
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      <CardHeader className="relative">
        <div className="flex justify-between items-start mb-2">
          <Badge className={cn(eventTypeColors[event.event_type])}>
            {event.event_type.replace("_", " ")}
          </Badge>
          {event.permission === "private" && <Badge variant="outline">Private</Badge>}
        </div>
        <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{`${formatDate(event.start_time)} - ${formatDate(event.end_time)}`}</span>
          </div>
          {event.speakers.length > 0 && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{event.speakers.map((s) => s.name).join(", ")}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Link
          href={isLoggedIn ? event.private_url : event.public_url || event.private_url}
          target="_blank"
          className="w-full"
        >
          <Button className="w-full">
            View Event <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
