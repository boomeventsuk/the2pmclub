import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface EventJson {
  slug: string;
  title: string;
  location: string;
  start: string;
  isHidden?: boolean;
  status?: string;
}

const formatShort = (iso: string) => {
  const d = new Date(iso);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
};

const cityFromTitle = (title: string, fallback: string) => {
  const cleaned = title
    .replace(/THE 2PM CLUB/i, "")
    .replace(/Daytime Disco/i, "")
    .replace(/[—\-:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.split(/[,\s]+/)[0] || fallback;
};

const NextEventStrip = () => {
  const [next, setNext] = useState<{ city: string; date: string; slug: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data: EventJson[]) => {
        const now = new Date();
        const upcoming = data
          .filter((e) => new Date(e.start) >= now && !e.isHidden && e.status !== "sold-out")
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
        if (upcoming) {
          const fallbackCity = (upcoming.location.split(", ")[1] || "").trim();
          setNext({
            city: cityFromTitle(upcoming.title, fallbackCity),
            date: formatShort(upcoming.start),
            slug: upcoming.slug,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!next) return null;

  return (
    <a
      href={`/events/${next.slug}/`}
      className={`fixed left-0 right-0 z-40 bg-primary text-primary-foreground transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      style={{ top: "72px" }}
      aria-hidden={!visible}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-xs md:text-sm font-poppins font-semibold uppercase tracking-wide">
        <span className="hidden sm:inline opacity-90">Next event</span>
        <span className="opacity-90 sm:hidden">Next</span>
        <span>{next.city} · {next.date}</span>
        <span className="hidden sm:inline-flex items-center gap-1 opacity-90">
          Book now <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
};

export default NextEventStrip;
