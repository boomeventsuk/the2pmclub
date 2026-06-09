import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface EventJson {
  slug: string;
  title: string;
  location: string;
  start: string;
  isHidden?: boolean;
  status?: string;
  statusLabel?: string;
  priceLabel?: string;
}

interface NextEvent {
  city: string;
  date: string;
  slug: string;
  priceLabel?: string;
  statusLabel?: string;
}

// "Sat 13th Jun" per house date rule
const formatShort = (iso: string) => {
  const d = new Date(iso);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][day % 10] || "th";
  return `${days[d.getDay()]} ${day}${suffix} ${months[d.getMonth()]}`;
};

/**
 * Inline next-event strip for the homepage hero. Renders the soonest
 * on-sale event from events.json: city, date, price, honest status,
 * one button to the site event page.
 */
const NextEventStrip = () => {
  const [next, setNext] = useState<NextEvent | null>(null);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data: EventJson[]) => {
        const now = new Date();
        const upcoming = data
          .filter((e) => new Date(e.start) >= now && !e.isHidden && e.status !== "sold-out")
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
        if (upcoming) {
          setNext({
            city: (upcoming.location.split(", ").pop() || "").trim(),
            date: formatShort(upcoming.start),
            slug: upcoming.slug,
            priceLabel: upcoming.priceLabel,
            statusLabel: upcoming.statusLabel,
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!next) return null;

  return (
    <a
      href={`/events/${next.slug}/`}
      className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-background/70 backdrop-blur-md border border-primary/40 rounded-2xl px-5 py-4 max-w-full hover:border-primary transition-colors"
      data-testid="next-event-strip"
    >
      <span className="font-poppins text-xs uppercase tracking-widest text-primary font-bold">
        Next event
      </span>
      <span className="font-poppins text-base md:text-lg font-bold text-foreground">
        {next.city} · {next.date}
      </span>
      {next.priceLabel && (
        <span className="font-poppins text-sm md:text-base text-foreground/85">{next.priceLabel}</span>
      )}
      {next.statusLabel && (
        <span className="font-poppins text-xs font-semibold uppercase tracking-wide bg-primary/15 border border-primary/30 text-primary rounded-full px-3 py-1">
          {next.statusLabel}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-poppins font-semibold uppercase tracking-wide text-xs md:text-sm rounded-full px-4 py-2">
        Book Now <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </a>
  );
};

export default NextEventStrip;
