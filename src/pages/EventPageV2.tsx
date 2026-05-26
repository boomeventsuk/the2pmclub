import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import { Calendar, MapPin, Clock, Ticket, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { trackBookClick, trackEventPageView } from '@/lib/dataLayer';

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
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutIntentTracked = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadEventData().then(data => {
      if (cancelled) return;
      const ev = slug ? data[slug] || null : null;
      setEvent(ev);
      // Try city-specific reel first; onError handler will swap to master if 404.
      setReelSrc(ev?.cityCode ? cityReelUrl(ev.cityCode) : HERO_REEL_MASTER);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  const handleReelError = () => {
    if (reelSrc !== HERO_REEL_MASTER) {
      setReelSrc(HERO_REEL_MASTER);
    }
  };

  const getTrackingContext = (source?: string) => {
    if (!event) return {};
    return {
      eventbriteId: event.eventbriteId,
      city: event.city,
      venue: event.venue,
      date: event.date,
      startIso: event.startIso,
      status: event.status,
      price: event.price,
      source
    };
  };

  useEffect(() => {
    if (!event) return;
    trackEventPageView(event.slug, event.title, getTrackingContext('event_page'));
  }, [event?.slug]);

  const scrollToCheckout = (source = 'ticket_button') => {
    if (event && !checkoutIntentTracked.current) {
      checkoutIntentTracked.current = true;
      trackBookClick(event.slug, event.title, getTrackingContext(source));
    }
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
  const isSellingFast = event.status === 'selling-fast';
  const formatPrice = (n: number) => Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
  const canonicalUrl = `https://www.the2pmclub.co.uk/events/${event.slug}/`;
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'DanceEvent',
    name: event.title,
    description: `THE 2PM CLUB Daytime Disco in ${event.city}. Iconic 80s, 90s and 00s anthems from ${event.timeDisplay}.`,
    image: event.squareImg,
    startDate: event.startIso,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: canonicalUrl,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: 'GB'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'THE 2PM CLUB',
      url: 'https://www.the2pmclub.co.uk/'
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      price: event.price,
      priceCurrency: 'GBP',
      availability: isSoldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
    },
    identifier: event.eventbriteId
  };

  return (
    <>
      <Helmet>
        <title>The 2PM Club — {event.city} — {event.date}</title>
        <meta name="description" content={`THE 2PM CLUB Daytime Disco. ${event.city}, ${event.date}. Iconic 80s, 90s and 00s anthems. Sing your heart out. Home by 7.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`The 2PM Club — ${event.city} — ${event.date}`} />
        <meta property="og:description" content="Sing your heart out. Home by 7. Iconic 80s, 90s and 00s anthems." />
        <meta property="og:image" content={event.squareImg} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="eventbrite:id" content={event.eventbriteId} />
        <meta name="event:city" content={event.city} />
        <meta name="event:venue" content={event.venue} />
        <meta name="event:start_time" content={event.startIso} />
        {event.price && <meta name="product:price:amount" content={String(event.price)} />}
        <meta name="product:price:currency" content="GBP" />
        <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />

        {/* Sold-out / last-tickets urgency banner */}
        {isSoldOut && (
          <div className="bg-muted text-foreground py-3 text-center">
            <p className="font-poppins font-bold text-sm md:text-base tracking-wide uppercase">
              🎉 Sold Out — Join the Waiting List
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
                  {isSellingFast && (
                    <div className="inline-flex items-center gap-2.5 bg-primary/15 border border-primary/30 rounded-full px-4 py-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="font-poppins font-bold text-base text-primary tracking-wide uppercase">
                        {event.statusLabel || 'Selling fast'}
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
                    onClick={() => scrollToCheckout('hero_button')}
                    size="lg"
                    className="w-full font-poppins font-semibold text-lg"
                  >
                    {isSoldOut ? 'Join Waiting List' : 'Book Tickets'}
                  </Button>
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

        {/* WIDGET: single instance, honest caption */}
        <section ref={checkoutRef} id="checkout-section" className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 md:p-7">
                <div className="text-center mb-5">
                  <h2 className="font-poppins text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground uppercase">
                    {isSoldOut ? 'Join the Waiting List' : isLastTickets ? (event.urgencyLabel || 'Last Tickets') : 'Book Your Tickets'}
                  </h2>
                  <p className="font-poppins text-sm md:text-base text-foreground/70">
                    {event.date}, {event.venue}, {event.city}. Pick your tickets.
                  </p>
                </div>
                <div className="bg-card/50 rounded-xl overflow-hidden">
                  <EventbriteEmbed
                    eventbriteId={event.eventbriteId}
                    eventSlug={event.slug}
                    containerId={`eventbrite-widget-v2-${event.slug}`}
                    height={650}
                    promoCode={event.promoCode}
                    eventTitle={event.title}
                  />
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
