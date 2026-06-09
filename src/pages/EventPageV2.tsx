import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import TrustStrip from '@/components/TrustStrip';
import { Calendar, MapPin, Clock, Ticket, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { trackEventPageView, trackBookClick } from '@/lib/dataLayer';

// Hero reel URLs on Bunny CDN.
// Per-city cuts live at hero-1x1-{cityCode}.mp4 (NPTON, BED, COV, MK, LUT, LEIC).
// Master fallback at hero-1x1.mp4 covers any city without a current cut.
// Quarterly refresh = file replacement at the same paths.
const HERO_REEL_BASE = 'https://boombastic-events.b-cdn.net/web%20hero';
const HERO_REEL_MASTER = `${HERO_REEL_BASE}/hero-1x1.mp4`;
const cityReelUrl = (cityCode: string) => `${HERO_REEL_BASE}/hero-1x1-${cityCode}.mp4`;

interface EventJson {
  id: number;
  slug: string;
  eventType: string;
  cityCode: string;
  eventbriteId: string;
  promoCode?: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  infoUrl: string;
  image: string;
  description: string;
  status?: string;
  statusLabel?: string;
  urgencyLabel?: string;
  accentColor?: string;
  price?: number;
  legacyLine?: string;
}

interface EventData {
  slug: string;
  cityCode: string;
  eventbriteId: string;
  promoCode?: string;
  city: string;
  venue: string;
  date: string;
  shortDate: string;
  squareImg: string;
  title: string;
  timeDisplay: string;
  startIso: string;
  status?: string;
  statusLabel?: string;
  urgencyLabel?: string;
  price?: number;
  legacyLine?: string;
}

const parseLocation = (location: string): { venue: string; city: string } => {
  const parts = location.split(', ');
  const venue = parts[0] || location;
  const city = parts[parts.length - 1] || '';
  return { venue, city };
};

const formatEventDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${days[date.getDay()]} ${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = date.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'ST' : day === 2 || day === 22 ? 'ND' : day === 3 || day === 23 ? 'RD' : 'TH';
  return `${days[date.getDay()]} ${day}${suffix} ${months[date.getMonth()]}`;
};

const loadEventData = async (): Promise<Record<string, EventData>> => {
  try {
    const response = await fetch('/events.json');
    const events: EventJson[] = await response.json();
    const out: Record<string, EventData> = {};
    events.forEach(event => {
      const { venue, city } = parseLocation(event.location);
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);
      const startHour = startTime.getHours();
      const endHour = endTime.getHours();
      const startAmPm = startHour >= 12 ? 'pm' : 'am';
      const endAmPm = endHour >= 12 ? 'pm' : 'am';
      const start12 = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour;
      const end12 = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;
      const timeDisplay = `${start12}${startAmPm}–${end12}${endAmPm}`;
      out[event.slug] = {
        slug: event.slug,
        cityCode: event.cityCode,
        eventbriteId: event.eventbriteId,
        promoCode: event.promoCode,
        city,
        venue,
        date: formatEventDate(event.start),
        shortDate: formatShortDate(event.start),
        squareImg: event.image,
        title: event.title,
        timeDisplay,
        startIso: event.start,
        status: event.status,
        statusLabel: event.statusLabel,
        urgencyLabel: event.urgencyLabel,
        price: event.price,
        legacyLine: event.legacyLine,
      };
    });
    return out;
  } catch (e) {
    console.error('Failed to load events', e);
    return {};
  }
};

const EventPageV2 = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reelSrc, setReelSrc] = useState<string>(HERO_REEL_MASTER);
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadEventData().then(data => {
      if (cancelled) return;
      // URLs are served lowercase (Netlify 301s uppercase to the lowercase
      // shell) but events.json slugs are uppercase: normalise before lookup.
      const normalizedSlug = slug?.toUpperCase().replace(/\/$/, "");
      const ev = normalizedSlug ? data[normalizedSlug] || null : null;
      setEvent(ev);
      // Try city-specific reel first; onError handler will swap to master if 404.
      setReelSrc(ev?.cityCode ? cityReelUrl(ev.cityCode) : HERO_REEL_MASTER);
      setLoading(false);
      if (ev) {
        // ViewContent on page view; InitiateCheckout waits for the widget load.
        trackEventPageView(ev.slug, ev.title, {
          eventbriteId: ev.eventbriteId,
          city: ev.city,
          venue: ev.venue,
          date: ev.date,
          startIso: ev.startIso,
          source: 'event_page_v2',
        });
      }
    });
    return () => { cancelled = true; };
  }, [slug]);

  // InitiateCheckout fires when the Eventbrite widget actually loads,
  // not on a card click two pages earlier.
  useEffect(() => {
    if (showCheckout && event && event.status !== 'sold-out') {
      trackBookClick(event.slug, event.title, {
        eventbriteId: event.eventbriteId,
        city: event.city,
        venue: event.venue,
        date: event.date,
        startIso: event.startIso,
        source: 'eventbrite_widget_load',
      });
    }
  }, [showCheckout, event]);

  const handleReelError = () => {
    if (reelSrc !== HERO_REEL_MASTER) {
      setReelSrc(HERO_REEL_MASTER);
    }
  };

  const scrollToCheckout = () => {
    setShowCheckout(true);
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-poppins text-foreground/60">Loading…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-poppins text-foreground/60">Event not found.</p>
      </div>
    );
  }

  const faqs = [
    { q: "Is it really like a night out clubbing in the afternoon?",
      a: "Yes. Proper sound system, lighting, confetti moments. But you're done by 6pm and you'll actually feel good the next day. Same energy, better timing." },
    { q: "What music will be played?",
      a: "80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. Whitney, Wham!, Spice Girls, Beyoncé, Take That, The Killers, Oasis." },
    { q: "Why do you start at 2pm?",
      a: "Because the best part of any night out happens early. Doors at 2, finish by 6. You get the night out, you keep your evening, you keep your Sunday." },
    { q: "Do you offer group tickets?",
      a: "Yes. Groups of four are the sweet spot. The group ticket gets you a better price per head. Get the chat sorted, book together." },
    { q: "What's the crowd like?",
      a: "Mostly 30s and 40s. People who know every word and aren't pretending otherwise. Friends, couples, work crews. No bottle service nonsense." },
    { q: "What should I wear?",
      a: "Whatever you'd wear to a proper night out. Most people dress up. It's an excuse to." },
    { q: "What time do doors open and when does it finish?",
      a: `Doors at 2pm. Finish at 6pm. You're home by 7-ish.` },
  ];

  const isLastTickets = event.status === 'last-tickets';
  const isSoldOut = event.status === 'sold-out';
  const formatPrice = (n: number) => Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;

  // WhatsApp share: site event page link, never Eventbrite (item 19)
  const eventUrl = `https://www.the2pmclub.co.uk/events/${event.slug}/`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `The 2PM Club, ${event.city}, ${event.date}. Daytime disco, home by 7. Who's in? ${eventUrl}`
  )}`;

  return (
    <>
      <Helmet>
        <title>The 2PM Club — {event.city} — {event.date}</title>
        <meta name="description" content={`THE 2PM CLUB Daytime Disco. ${event.city}, ${event.date}. Iconic 80s, 90s and 00s anthems. Sing your heart out. Home by 7.`} />
        <meta property="og:title" content={`The 2PM Club — ${event.city} — ${event.date}`} />
        <meta property="og:description" content="Sing your heart out. Home by 7. Iconic 80s, 90s and 00s anthems." />
        <meta property="og:image" content={event.squareImg} />
      </Helmet>

      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />

        {/* Sold-out / last-tickets urgency banner */}
        {isSoldOut && (
          <div className="bg-muted text-foreground py-3 text-center">
            <p className="font-poppins font-bold text-sm md:text-base tracking-wide uppercase">
              Sold Out. Join the Waiting List
            </p>
          </div>
        )}
        {isLastTickets && (
          <div className="urgency-banner-last-tickets text-white py-4 md:py-5 text-center sticky top-0 z-50">
            <p className="font-poppins font-black text-2xl md:text-4xl tracking-tight uppercase">
              {event.urgencyLabel || 'Last Tickets'}
            </p>
            <p className="font-poppins text-lg md:text-xl font-bold mt-1">Don't miss out!</p>
          </div>
        )}

        {/* HERO: video left + card right (desktop), video on top + card below (mobile) */}
        <section className="pt-24 md:pt-28 pb-8 bg-gradient-to-b from-background via-background to-muted/10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Hero video */}
                <div className="flex justify-center md:justify-start">
                  <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl shadow-primary/20 bg-black">
                    <video
                      key={reelSrc}
                      src={reelSrc}
                      poster={event.squareImg}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onError={handleReelError}
                      className="w-full h-full object-cover"
                    />
                    {/* CSS overlay: city + date badge, low contrast, bottom area, clears the baked-in logo */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                      <div className="bg-black/40 backdrop-blur-sm rounded-md px-2.5 py-1">
                        <p className="font-poppins font-bold text-white text-xs md:text-sm tracking-wider uppercase leading-none">
                          {event.city}
                        </p>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-md px-2.5 py-1">
                        <p className="font-poppins font-semibold text-white text-xs md:text-sm tracking-wider uppercase leading-none">
                          {event.shortDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right card: locked 3-line header + facts + CTA */}
                <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-5 md:p-7 space-y-5">
                  {!isSoldOut && event.statusLabel && (
                    <div className="inline-flex items-center gap-2.5 bg-primary/15 border border-primary/30 rounded-full px-4 py-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="font-poppins font-bold text-base text-primary tracking-wide uppercase">
                        {event.statusLabel}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight uppercase leading-tight">
                      The 2PM Club
                      <br />
                      <span className="text-foreground/90">Daytime Disco</span>
                      <br />
                      <span className="text-primary">{event.city}</span>
                    </h1>
                    <p className="font-poppins text-lg md:text-xl text-foreground/85 mt-3 font-medium">
                      Your best night out. In the middle of the afternoon.
                    </p>
                    <p className="font-poppins text-base md:text-lg text-foreground/70 mt-1">
                      Iconic 80s, 90s and 00s anthems.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-poppins font-medium text-base">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-poppins font-medium text-base">{event.timeDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-poppins font-medium text-base">{event.venue}, {event.city}</span>
                    </div>
                    {!isSoldOut && event.price && (
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        <span className="font-poppins font-medium text-base">
                          Tickets from {formatPrice(event.price)} (+ bf) Group offers available
                        </span>
                      </div>
                    )}
                    {event.legacyLine && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-poppins font-medium text-base">
                          {event.legacyLine}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={scrollToCheckout}
                    size="lg"
                    className="w-full font-poppins font-semibold text-lg"
                  >
                    {isSoldOut ? 'Join Waiting List' : 'Book Tickets'}
                  </Button>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-border/60 rounded-md py-3 font-poppins font-medium text-sm text-foreground/85 hover:border-[#25D366] hover:text-foreground transition-colors"
                    aria-label="Share this event on WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF: 3 quotes lifted up before the widget */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { quote: "Brilliant music, not just clubbing anthems the whole time", author: "Josie L, Northampton" },
                  { quote: "Finally able to get all my friends together, when's the next one?", author: "Marie T, Coventry" },
                  { quote: "Don't think I've danced and laughed so much in a long time. Thank you!", author: "Tracey M, Bedford" },
                ].map((t, i) => (
                  <div key={i} className="bg-primary/5 border border-border/30 rounded-xl p-5">
                    <div className="flex mb-2 text-yellow-400 text-sm">★★★★★</div>
                    <p className="font-poppins text-base md:text-lg font-semibold text-foreground/90 mb-3 leading-snug">
                      "{t.quote}"
                    </p>
                    <p className="font-poppins text-xs text-muted-foreground font-medium uppercase">
                      — {t.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO STRIP: auto-scrolling existing imagery */}
        <section className="py-6 md:py-8 overflow-hidden">
          <div className="relative">
            <div className="flex gap-4 animate-scroll">
              {[
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_6_bjt6h7.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_7_jl6yvd.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg",
                "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg",
              ].map((img, i) => (
                <div key={i} className="flex-shrink-0 w-56 md:w-72">
                  <img src={img} alt="2PM Club event moment" className="w-full h-44 md:h-52 object-cover rounded-xl shadow-lg" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOUNDTRACK: one line, replaces the 28-name list */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-poppins text-base md:text-lg text-foreground/70 uppercase tracking-wider mb-3">
                Your Soundtrack
              </p>
              <p className="font-poppins text-xl md:text-2xl text-foreground/90 leading-relaxed">
                Spice Girls. Oasis. Whitney. ABBA. Bon Jovi. Take That. Beyoncé.
                <br className="hidden md:block" />
                {' '}Every chorus you still know by heart.
              </p>
            </div>
          </div>
        </section>

        {/* Trust bar above the checkout (item 14) */}
        <TrustStrip />

        {/* WIDGET: single instance, honest caption. Sold out renders a waitlist instead (item 20) */}
        <section ref={checkoutRef} id="checkout-section" className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 md:p-7">
                <div className="text-center mb-5">
                  <h2 className="font-poppins text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground uppercase">
                    {isSoldOut ? 'Join the Waiting List' : isLastTickets ? (event.urgencyLabel || 'Last Tickets') : 'Book Your Tickets'}
                  </h2>
                  <p className="font-poppins text-sm md:text-base text-foreground/70">
                    {isSoldOut
                      ? `${event.date}, ${event.venue}, ${event.city} is sold out.`
                      : `${event.date}, ${event.venue}, ${event.city}. Pick your tickets.`}
                  </p>
                </div>
                <div className="bg-card/50 rounded-xl overflow-hidden">
                  {isSoldOut ? (
                    <form
                      name="event-waitlist"
                      method="POST"
                      action="/thanks.html"
                      data-netlify="true"
                      className="flex flex-col items-center text-center px-6 py-10 md:py-12"
                    >
                      <input type="hidden" name="form-name" value="event-waitlist" />
                      <input type="hidden" name="slug" value={event.slug} />
                      <input type="hidden" name="city" value={event.city} />
                      <p className="font-poppins text-base md:text-lg text-foreground/85 mb-5 max-w-md">
                        Join the list, returned tickets and the next {event.city} date first.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Your email"
                          aria-label="Your email"
                          className="flex-1 rounded-md border border-border/60 bg-background px-4 py-3 font-poppins text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary"
                        />
                        <Button type="submit" size="lg" className="font-poppins font-bold uppercase tracking-wide">
                          Join the List
                        </Button>
                      </div>
                      <p className="font-poppins text-xs text-foreground/50 mt-4">
                        No spam. Just tickets and dates for {event.city}.
                      </p>
                    </form>
                  ) : showCheckout ? (
                    <EventbriteEmbed
                      eventbriteId={event.eventbriteId}
                      eventSlug={event.slug}
                      containerId={`eventbrite-widget-v2-${event.slug}`}
                      height={650}
                      promoCode={event.promoCode}
                      eventTitle={event.title}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-6 py-10 md:py-14">
                      <p className="font-poppins text-sm md:text-base text-foreground/70 mb-5">
                        Tap below to load the secure Eventbrite checkout.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => setShowCheckout(true)}
                        className="font-poppins font-bold uppercase tracking-wide"
                        aria-label={`Load Eventbrite checkout for ${event.title}`}
                      >
                        <Ticket className="w-5 h-5 mr-2" />
                        Book Tickets
                      </Button>
                      <p className="font-poppins text-xs text-foreground/50 mt-4">
                        Secure checkout powered by Eventbrite. Loads on tap to keep the page fast.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY: 4 cards, trimmed from 5. Dropped "TRUST THE TRACK RECORD" - claim, not show */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6 text-center uppercase">
                Why Everyone Says Yes
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { emoji: "🎤", title: "The Room Where Everyone Knows Every Word", body: "Wall-to-wall 80s, 90s and 00s. Confetti, lights, and the moment the whole room sings together." },
                  { emoji: "🕺", title: "Night-Out Energy. Afternoon Timing.", body: "Same atmosphere you remember from your best nights out. Dance freely, and still be home by 7pm." },
                  { emoji: "👯", title: "The One Plan That Doesn't Fall Apart", body: "2pm Saturday works for everyone. No babysitter dramas, no late-night worries. One link. One plan." },
                  { emoji: "😎", title: "All The Fun. Still Buzzing By Wednesday.", body: "You walked out last time saying \"Let's do it again!\" This is the time to do it." },
                ].map((c, i) => (
                  <div key={i} className="bg-card/50 border border-border/40 rounded-xl p-5 hover:border-primary/30 transition-colors">
                    <p className="font-poppins text-foreground text-base md:text-lg">
                      <span className="mr-2">{c.emoji}</span>
                      <strong className="font-semibold uppercase tracking-tight">{c.title}</strong>
                      <span className="text-foreground/80 block mt-2 normal-case">{c.body}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8">
                <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6 uppercase">
                  Questions People Ask Before They Book
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                      <AccordionTrigger className="text-left font-poppins font-medium text-foreground hover:no-underline text-base md:text-lg uppercase">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/85 font-poppins pt-2">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <p className="text-sm text-muted-foreground mt-6">
                  This event is 18+ recommended unless stated otherwise.
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <a href="/">← Back to all events</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default EventPageV2;
