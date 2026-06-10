import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasConsentBeenGiven } from "@/lib/cookieConsent";

interface EventMobileBookBarProps {
  shortDate: string;
  venue: string;
  statusLabel?: string;
  isSoldOut: boolean;
  onBook: () => void;
}

/**
 * Mobile-only sticky book bar for event pages (pattern: MobileBookBar on the
 * homepage). Slides up once the buyer scrolls past the hero CTA. Hidden while:
 *  - the cookie consent banner is unresolved (no stacking/overlap), and
 *  - the checkout section itself is in view (never cover the Eventbrite iframe).
 * Sold out events get a "Join Waiting List" label; the same scroll target
 * renders the waitlist form in that state.
 */
const EventMobileBookBar = ({ shortDate, venue, statusLabel, isSoldOut, onBook }: EventMobileBookBarProps) => {
  const [pastHero, setPastHero] = useState(false);
  const [consentResolved, setConsentResolved] = useState(() => hasConsentBeenGiven());
  const [checkoutInView, setCheckoutInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onConsent = () => setConsentResolved(true);
    window.addEventListener("cookie-consent-changed", onConsent);
    return () => window.removeEventListener("cookie-consent-changed", onConsent);
  }, []);

  useEffect(() => {
    const target = document.getElementById("checkout-section");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setCheckoutInView(e.isIntersecting)),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && consentResolved && !checkoutInView;

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background/95 to-background/0 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 bg-card border border-border/60 rounded-2xl pl-4 pr-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-semibold text-sm text-foreground truncate uppercase">
            {shortDate} · {venue}
          </p>
          {isSoldOut ? (
            <p className="font-poppins text-xs font-bold text-muted-foreground uppercase tracking-wide truncate">
              Sold Out
            </p>
          ) : statusLabel ? (
            <p className="font-poppins text-xs font-bold text-primary uppercase tracking-wide truncate">
              {statusLabel}
            </p>
          ) : null}
        </div>
        <Button
          onClick={onBook}
          className="rounded-full font-poppins font-semibold uppercase tracking-wide text-xs px-4 shrink-0 shadow-[0_6px_20px_hsl(328_100%_54%_/_0.45)]"
        >
          {isSoldOut ? "Join Waiting List" : "Book Tickets"}
        </Button>
      </div>
    </div>
  );
};

export default EventMobileBookBar;
