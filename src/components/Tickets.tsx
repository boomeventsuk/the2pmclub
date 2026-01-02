import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

interface EventJson {
  id: number;
  slug: string;
  eventType: string;
  cityCode: string;
  eventbriteId: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  infoUrl: string;
  image: string;
  description: string;
  status?: "sold-out" | "selling-fast" | "new-date" | "just-announced";
  promoCode?: string;
  isHidden?: boolean;
}

interface MappedEvent {
  slug: string;
  eventType: string;
  cityCode: string;
  eventbriteId: string;
  promoCode?: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  time: string;
  poster: string;
  bookUrl: string;
  infoUrl: string;
  urgencyText?: string;
  urgencyColor?: string;
  soldOut: boolean;
  dateIso: string;
}

// Parse location string into venue and city
const parseLocation = (location: string): { venue: string; city: string } => {
  const parts = location.split(", ");
  return {
    venue: parts[0] || location,
    city: parts[1] || "",
  };
};

// Format ISO date to "Sat 6 Dec 2025"
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Format start/end to "14:00–18:00"
const formatTime = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startTime = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`;
  const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
  return `${startTime}–${endTime}`;
};

// Map status to urgency display props
const mapStatus = (status?: string): { urgencyText?: string; urgencyColor?: string; soldOut: boolean } => {
  switch (status) {
    case "sold-out":
      return { urgencyText: "SOLD OUT", urgencyColor: undefined, soldOut: true };
    case "selling-fast":
      return { urgencyText: "SELLING FAST", urgencyColor: undefined, soldOut: false };
    case "new-date":
      return { urgencyText: "NEW DATE", urgencyColor: "green", soldOut: false };
    case "just-announced":
      return { urgencyText: "JUST ANNOUNCED", urgencyColor: "green", soldOut: false };
    default:
      return { urgencyText: undefined, urgencyColor: undefined, soldOut: false };
  }
};

// Get ISO date string for schema markup
const getDateIso = (isoDate: string): string => {
  return isoDate.split("T")[0];
};

const Tickets = () => {
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "view_tickets_list" });

    fetch("/events.json")
      .then((res) => res.json())
      .then((data: EventJson[]) => {
        const now = new Date();
        
        // Filter future events and sort by date
        const futureEvents = data
          .filter((e) => new Date(e.start) >= now)
          .filter((e) => !e.isHidden)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        // Map to EventCard props
        const mapped: MappedEvent[] = futureEvents.map((e) => {
          const { venue, city } = parseLocation(e.location);
          const statusProps = mapStatus(e.status);
          
          return {
            slug: e.slug,
            eventType: e.eventType,
            cityCode: e.cityCode,
            eventbriteId: e.eventbriteId,
            promoCode: e.promoCode,
            title: e.title,
            date: formatDate(e.start),
            venue,
            city,
            time: formatTime(e.start, e.end),
            poster: e.image,
            bookUrl: e.bookUrl,
            infoUrl: e.infoUrl,
            urgencyText: statusProps.urgencyText,
            urgencyColor: statusProps.urgencyColor,
            soldOut: statusProps.soldOut,
            dateIso: getDateIso(e.start),
          };
        });

        setEvents(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section id="tickets" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-poppins text-4xl md:text-5xl font-bold text-foreground uppercase">
            Upcoming <span className="text-primary">Events</span>
          </h2>
        </div>
        
        <div className="space-y-6" id="tickets-list">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment.</p>
            </div>
          ) : (
            events.map((event) => (
              <EventCard 
                key={event.slug}
                {...event} 
              />
            ))
          )}
        </div>
        
      </div>
    </section>
  );
};

export default Tickets;
