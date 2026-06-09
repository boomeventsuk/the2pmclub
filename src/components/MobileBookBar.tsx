import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface EventJson {
  slug: string;
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

/**
 * Full-width mobile book bar, pointed at the next on-sale event's site page.
 */
const MobileBookBar = () => {
  const [visible, setVisible] = useState(false);
  const [next, setNext] = useState<{ slug: string; city: string; date: string } | null>(null);

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
            slug: upcoming.slug,
            city: (upcoming.location.split(", ").pop() || "").trim(),
            date: formatShort(upcoming.start),
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
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background/95 to-background/0 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={`/events/${next.slug}/`}
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-poppins font-semibold uppercase tracking-wide text-sm rounded-full py-4 shadow-[0_10px_30px_hsl(328_100%_54%_/_0.45)]"
      >
        {next.city} · {next.date} · Book Now <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export default MobileBookBar;
