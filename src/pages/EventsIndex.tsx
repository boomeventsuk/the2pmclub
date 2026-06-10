import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EventJson {
  slug: string;
  title: string;
  location: string;
  start: string;
  image: string;
  priceLabel?: string;
  statusLabel?: string;
  status?: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${days[d.getDay()]} ${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function EventsIndex() {
  const [events, setEvents] = useState<EventJson[]>([]);

  useEffect(() => {
    fetch("/events.json")
      .then((r) => r.json())
      .then((data: EventJson[]) => {
        const now = new Date();
        setEvents(
          data
            .filter((e) => new Date(e.start) >= now)
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        );
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Upcoming Daytime Disco Events | THE 2PM CLUB</title>
        <meta name="description" content="All upcoming THE 2PM CLUB daytime disco events across the Midlands. Book your tickets for Northampton, Bedford, Milton Keynes, Coventry, Luton and Leicester." />
        <link rel="canonical" href="https://www.the2pmclub.co.uk/events/" />
      </Helmet>
      <main id="main-content" className="min-h-screen">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-bebas text-4xl md:text-6xl text-foreground mb-4 text-center">Upcoming Events</h1>
            <p className="text-center text-muted-foreground mb-10 text-lg">All upcoming THE 2PM CLUB dates. Book via site pages to guarantee your spot.</p>

            {events.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Loading events...</p>
            )}

            <div className="space-y-4">
              {events.map((ev) => {
                const city = ev.location.split(", ").pop() || "";
                const isSoldOut = ev.status === "sold-out";
                return (
                  <a
                    key={ev.slug}
                    href={`/events/${ev.slug}/`}
                    className="flex items-center gap-4 md:gap-6 p-4 rounded-xl bg-card/60 border border-border hover:border-primary/50 transition-all group"
                  >
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {city}
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(ev.start)}</div>
                      <div className="text-sm text-muted-foreground">{ev.location.split(", ")[0]}</div>
                      {ev.priceLabel && !isSoldOut && (
                        <div className="text-sm text-primary font-medium mt-1">{ev.priceLabel}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isSoldOut ? (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">Sold out</span>
                      ) : (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-primary-foreground">Book now</span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
