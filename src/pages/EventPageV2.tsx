import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import EventMobileBookBar from '@/components/EventMobileBookBar';
import TrustStrip from '@/components/TrustStrip';
import { Calendar, MapPin, Clock, Ticket, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { trackEventPageView, trackBookClick, pushToDataLayer } from '@/lib/dataLayer';
import { optimised } from '@/components/EventCard';

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
  groupTicket?: { size: number; price: number; label: string };
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
  groupTicket?: { size: number; price: number; label: string };
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
        groupTicket: event.groupTicket,
      };
    });
    return out;
  } catch (e) {
    console.error('Failed to load events', e);
    return {};
  }
};

// ============================================================
// Customer quotes, verbatim from the approved bank
// (Boombastic competitive-intel/CUSTOMER-FEEDBACK-ANALYSIS.md).
// JD-approved attributions only: never trim or paraphrase, never
// introduce new real names, never show the same quote twice on a
// page. City pages lead with their own city's quotes and top up
// from the general set.
// ============================================================
interface Quote { quote: string; author: string }

const GENERAL_QUOTES: Quote[] = [
  { quote: "Brilliant music, not just clubbing anthems the whole time", author: "Attendee, Northampton" },
  { quote: "Finally able to get all my friends together, when's the next one?", author: "Attendee, Northampton" },
  { quote: "Don't think I've danced and laughed so much in a long time. Thank you!", author: "Attendee, Bedford" },
];

const CITY_QUOTES: Record<string, Quote[]> = {
  "Northampton": [
    { quote: "It felt like 2am not 2pm!", author: "Lorne, Northampton" },
    { quote: "To be in a club that felt safe and full of music from my youth took me back. I have been trying to do this again for years! I felt liberated!", author: "Emma S, Northampton" },
    { quote: "Great music, great atmosphere everyone was happy & friendly & we still had the evening to carry on!!", author: "Jacqui M, Northampton" },
    { quote: "Second time we've gone and bloody love it!", author: "Attendee, Northampton" },
  ],
  "Coventry": [
    { quote: "Absolutely brilliant, the best day/evening I have ever had out!", author: "AL, Coventry" },
    { quote: "Daytime singing and dancing, with like minded people, just brilliant.", author: "Alison M, Coventry" },
    { quote: "Still able to leave the place whilst its still light and feel safe walking to the car", author: "Julie D, Coventry" },
  ],
  "Milton Keynes": [
    { quote: "Just not what I expected so much more than we imagined.", author: "AO, Milton Keynes" },
  ],
};

// Group-relevant quotes from the approved bank (group view leads with one).
// Exact verbatim matches against the entries above, never new copy.
const GROUP_QUOTE_TEXTS = new Set([
  "Great music, great atmosphere everyone was happy & friendly & we still had the evening to carry on!!", // Jacqui M, Northampton
  "Finally able to get all my friends together, when's the next one?", // Attendee, Northampton (general fallback)
]);

const quotesForCity = (city: string, groupFirst = false): Quote[] => {
  const merged = [...(CITY_QUOTES[city] || [])].slice(0, 3);
  for (const q of GENERAL_QUOTES) {
    if (merged.length >= 3) break;
    if (!merged.some(m => m.quote === q.quote)) merged.push(q);
  }
  const standard = merged.slice(0, 3);
  if (!groupFirst) return standard;
  // Group view: lead with the most group-relevant approved quote. The city's
  // own group quote wins; the general group quote is the fallback.
  // Same dedupe rule applies: a quote never appears twice on a page.
  const lead =
    (CITY_QUOTES[city] || []).find(q => GROUP_QUOTE_TEXTS.has(q.quote)) ||
    GENERAL_QUOTES.find(q => GROUP_QUOTE_TEXTS.has(q.quote));
  if (!lead) return standard;
  return [lead, ...standard.filter(q => q.quote !== lead.quote)].slice(0, 3);
};

// Faded mock of the ticket selector. Used as the pre-tap gate background and
// as the loading underlay while the Eventbrite script boots, so the slot
// always reads as "the checkout is right here", never a blank box.
const GhostCheckout = () => (
  <div aria-hidden="true" className="space-y-3 opacity-30 blur-[1.5px] pointer-events-none select-none">
    <div className="rounded-lg border border-foreground/20 bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3.5 w-36 rounded bg-foreground/30" />
          <div className="h-3 w-24 rounded bg-foreground/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-foreground/20" />
          <div className="h-4 w-4 rounded bg-foreground/25" />
          <div className="h-8 w-8 rounded-full bg-primary/50" />
        </div>
      </div>
    </div>
    <div className="rounded-lg border border-foreground/20 bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3.5 w-44 rounded bg-foreground/30" />
          <div className="h-3 w-20 rounded bg-foreground/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-foreground/20" />
          <div className="h-4 w-4 rounded bg-foreground/25" />
          <div className="h-8 w-8 rounded-full bg-primary/50" />
        </div>
      </div>
    </div>
    <div className="h-10 rounded-lg bg-primary/40" />
  </div>
);

const EventPageV2 = () => {
  const { slug } = useParams<{ slug: string }>();
  // Group buyer variant (?v=group): a parameterised view of this same page,
  // driven entirely by event.groupTicket in events.json. No new route, no
  // duplicate page. If the param is present but groupTicket is absent (sold
  // through / never existed), the standard page renders exactly as-is, so
  // the URL never 404s and never shows a dead offer. The statusLabel ladder
  // is never overridden: the variant owns framing only, never state.
  const [searchParams] = useSearchParams();
  const isGroupParam = searchParams.get('v') === 'group';
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reelSrc, setReelSrc] = useState<string>(HERO_REEL_MASTER);
  const [reelActive, setReelActive] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const reelWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoLoadedRef = useRef(false);

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

  // Group variant render marker. Fires only when group mode actually renders
  // (param present AND groupTicket live AND not sold out), so dataLayer
  // reflects what the visitor saw, not what the URL asked for. The existing
  // ViewContent/InitiateCheckout flow is unchanged.
  useEffect(() => {
    if (event && isGroupParam && event.groupTicket && event.status !== 'sold-out') {
      pushToDataLayer({
        event: 'page_variant_view',
        variant: 'group',
        slug: event.slug,
      });
    }
  }, [event, isGroupParam]);

  // InitiateCheckout fires when the Eventbrite widget actually loads,
  // not on a card click two pages earlier.
  useEffect(() => {
    // Only fire InitiateCheckout for user-initiated loads (button tap / header
    // Book click). Scroll-proximity auto-loads are convenience, not intent;
    // genuine intent still fires inside EventbriteEmbed (AddToCart on
    // ticket_selected, checkout interaction on iframe focus).
    if (showCheckout && event && event.status !== 'sold-out' && !autoLoadedRef.current) {
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

  // Auto-load the checkout as the visitor scrolls towards it: page stays
  // light on load, but a buyer never has to tap a gate. The gate UI below
  // remains as the instant fallback while the widget initialises.
  // IntersectionObserver is primary; a passive scroll listener backs it up
  // (IO delivery pauses in hidden tabs and some in-app webviews).
  useEffect(() => {
    if (!event || event.status === 'sold-out' || showCheckout) return;
    const target = checkoutRef.current;
    if (!target) return;

    const trigger = () => {
      autoLoadedRef.current = true;
      setShowCheckout(true);
      cleanup();
    };

    const nearCheckout = () =>
      target.getBoundingClientRect().top < window.innerHeight + 600;

    const onScroll = () => { if (nearCheckout()) trigger(); };

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => { if (entries.some(e => e.isIntersecting)) trigger(); },
        { rootMargin: '600px 0px' }
      );
      observer.observe(target);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function cleanup() {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
    }
    return cleanup;
  }, [event, showCheckout]);

  // Keep the ghost + spinner under the embed container until an iframe
  // actually appears inside it (the Eventbrite script can take 1-3s on 4G).
  // MutationObserver is primary, a poll backs it up, and a hard stop clears
  // the underlay after 20s so a failed script never leaves a stuck spinner.
  useEffect(() => {
    if (!showCheckout || widgetReady || !event || event.status === 'sold-out') return;
    const containerId = `eventbrite-widget-v2-${event.slug}`;
    let done = false;
    let observer: MutationObserver | undefined;

    const hasIframe = () =>
      !!document.getElementById(containerId)?.querySelector('iframe');

    const finish = () => {
      if (done) return;
      done = true;
      observer?.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(stop);
      setWidgetReady(true);
    };

    if (hasIframe()) {
      setWidgetReady(true);
      return;
    }

    const container = document.getElementById(containerId);
    if (container && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => { if (hasIframe()) finish(); });
      observer.observe(container, { childList: true, subtree: true });
    }
    const poll = window.setInterval(() => { if (hasIframe()) finish(); }, 250);
    const stop = window.setTimeout(finish, 20000);

    return () => {
      observer?.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [showCheckout, widgetReady, event]);

  // Hero reel media diet: the reel is ~3MB, so it must never be part of the
  // initial page weight. The <video> mounts with no src (preload="none") and
  // the event poster showing; once the page has finished loading AND the reel
  // is near the viewport (IntersectionObserver), the src is set and the reel
  // streams in. The reel itself is brand-critical and stays.
  useEffect(() => {
    if (!event || reelActive) return;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let fallback: number | undefined;

    const activate = () => {
      if (cancelled) return;
      setReelActive(true);
      observer?.disconnect();
      window.clearTimeout(fallback);
    };

    const arm = () => {
      if (cancelled) return;
      const target = reelWrapRef.current;
      if (!target || typeof IntersectionObserver === 'undefined') {
        activate();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => { if (entries.some(e => e.isIntersecting)) activate(); },
        { rootMargin: '300px 0px' }
      );
      observer.observe(target);
      // IO delivery pauses in hidden tabs and some in-app webviews (a lot
      // of ad traffic): the reel is brand-critical, so a timer guarantees
      // it still arrives shortly after load.
      fallback = window.setTimeout(activate, 2500);
    };

    if (document.readyState === 'complete') {
      arm();
    } else {
      window.addEventListener('load', arm, { once: true });
    }
    return () => {
      cancelled = true;
      window.removeEventListener('load', arm);
      observer?.disconnect();
      window.clearTimeout(fallback);
    };
  }, [event, reelActive]);

  // Kick playback once the deferred src lands (the autoplay attribute alone
  // is not reliable when src is attached after mount, and an immediate
  // play() gets interrupted by the load the new src triggers).
  useEffect(() => {
    if (!reelActive) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => { v.play().catch(() => {}); };
    if (v.readyState >= 3) {
      tryPlay();
      return;
    }
    v.addEventListener('canplay', tryPlay, { once: true });
    return () => v.removeEventListener('canplay', tryPlay);
  }, [reelActive, reelSrc]);

  // Header "Book Tickets" on event pages dispatches 2pm:book-intent and
  // scrolls here itself; we just mount the widget. Explicit tap = real
  // intent, so autoLoadedRef stays false and InitiateCheckout fires.
  useEffect(() => {
    const onBookIntent = () => setShowCheckout(true);
    window.addEventListener('2pm:book-intent', onBookIntent);
    return () => window.removeEventListener('2pm:book-intent', onBookIntent);
  }, []);

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

  // GROUP MODE: only when the param asks for it AND the offer is live.
  // Sold out or no groupTicket = silent fallback to the standard page.
  const groupMode = isGroupParam && !isSoldOut && !!event.groupTicket;

  // Per-head maths for the promoted group fact row, computed from the live
  // groupTicket data (never hand-written): £40 / 4 = "£10 each".
  const perHead = event.groupTicket
    ? formatPrice(event.groupTicket.price / event.groupTicket.size)
    : '';
  const sizeWords: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };
  const sizeWord = event.groupTicket
    ? (sizeWords[event.groupTicket.size] || String(event.groupTicket.size))
    : '';

  // Group view pins the group FAQ first; standard order is untouched.
  const groupFaqIndex = faqs.findIndex(f => f.q === 'Do you offer group tickets?');
  const orderedFaqs = groupMode && groupFaqIndex > 0
    ? [faqs[groupFaqIndex], ...faqs.filter((_, i) => i !== groupFaqIndex)]
    : faqs;

  // WhatsApp share: site event page link, never Eventbrite (item 19).
  // Group view shares the group URL so the chat lands on the same framing.
  const eventUrl = `https://www.the2pmclub.co.uk/events/${event.slug}/`;
  const shareUrl = groupMode ? `${eventUrl}?v=group` : eventUrl;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `The 2PM Club, ${event.city}, ${event.date}. Daytime disco, home by 7. Who's in? ${shareUrl}`
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
                  <div ref={reelWrapRef} className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl shadow-primary/20 bg-black">
                    <video
                      key={reelSrc}
                      ref={videoRef}
                      src={reelActive ? reelSrc : undefined}
                      poster={optimised(event.squareImg, 800)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
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
                      {groupMode
                        ? 'Round up the group. The afternoon out everyone can actually make.'
                        : 'Your best night out. In the middle of the afternoon.'}
                    </p>
                    <p className="font-poppins text-base md:text-lg text-foreground/70 mt-1">
                      Iconic 80s, 90s and 00s anthems.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    {/* Group view: group ticket promoted to the first fact row,
                        with per-head maths computed from groupTicket data */}
                    {groupMode && event.groupTicket && (
                      <div className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <span className="font-poppins font-semibold text-base block">
                            {event.groupTicket.label}
                          </span>
                          <span className="font-poppins text-sm text-foreground/70 block">
                            {perHead} each for {sizeWord} of you
                          </span>
                        </div>
                      </div>
                    )}
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
                          Tickets from {formatPrice(event.price)}
                        </span>
                      </div>
                    )}
                    {/* Standard view keeps the group line in its usual slot;
                        group view already shows it as row 1 (never twice) */}
                    {!groupMode && !isSoldOut && event.groupTicket?.label && (
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-poppins font-medium text-base">
                          {event.groupTicket.label}
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
                    {isSoldOut ? 'Join Waiting List' : groupMode ? 'Book for the Group' : 'Book Tickets'}
                  </Button>

                  {/* WhatsApp share sits directly under the CTA. Group view
                      promotes it (the organiser's actual job: drop the link in
                      the chat) and shares the ?v=group URL */}
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={groupMode
                      ? 'flex items-center justify-center gap-2 w-full border-2 border-[#25D366]/70 rounded-md py-3 font-poppins font-semibold text-base text-foreground hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors'
                      : 'flex items-center justify-center gap-2 w-full border border-border/60 rounded-md py-3 font-poppins font-medium text-sm text-foreground/85 hover:border-[#25D366] hover:text-foreground transition-colors'}
                    aria-label="Share this event on WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {groupMode ? 'Send this to the group chat' : 'Share on WhatsApp'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF: 3 quotes lifted up before the widget, city-matched
            where the approved bank has quotes for this city */}
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quotesForCity(event.city, groupMode).map((t, i) => (
                  <div key={i} className="bg-primary/5 border border-border/30 rounded-xl p-5">
                    <div className="flex mb-2 text-yellow-400 text-sm">★★★★★</div>
                    <p className="font-poppins text-base md:text-lg font-semibold text-foreground/90 mb-3 leading-snug">
                      "{t.quote}"
                    </p>
                    <p className="font-poppins text-xs text-muted-foreground font-medium uppercase">
                      {t.author}
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
              {/* Self-hosted optimised WebPs (45-70KB each), same set as the
                  homepage gallery: ~300KB-per-image CDN JPEGs were the bulk of
                  the old page weight */}
              {[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5].map((n, i) => (
                <div key={i} className="flex-shrink-0 w-56 md:w-72">
                  <img
                    src={`/img/gallery/2pm-crowd-${n}.webp`}
                    alt="2PM Club event moment"
                    className="w-full h-44 md:h-52 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                    decoding="async"
                  />
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
                    {isSoldOut ? 'Join the Waiting List' : isLastTickets ? (event.urgencyLabel || 'Last Tickets') : groupMode ? 'Book the Group In' : 'Book Your Tickets'}
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
                    <div className="relative min-h-[650px]">
                      {/* Loading underlay: ghost mock + spinner stay UNDER the
                          embed container, removed once an iframe appears in it */}
                      {!widgetReady && (
                        <div className="absolute inset-0 z-0 flex flex-col justify-center px-6 py-8 md:py-10 pointer-events-none" aria-hidden="true">
                          <GhostCheckout />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="h-9 w-9 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                            <p className="font-poppins text-xs text-foreground/60 mt-3">
                              Loading secure checkout
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="relative z-10 min-h-[650px]">
                        <EventbriteEmbed
                          eventbriteId={event.eventbriteId}
                          eventSlug={event.slug}
                          containerId={`eventbrite-widget-v2-${event.slug}`}
                          height={650}
                          promoCode={event.promoCode}
                          affiliateCode={groupMode ? 'BoomWebGrp' : undefined}
                          eventTitle={event.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex flex-col justify-center min-h-[650px] px-6 py-8 md:py-10">
                      {/* Ghost checkout: faded mock of the ticket selector so it
                          reads as "the checkout is right here", not a wall */}
                      <GhostCheckout />
                      {/* Overlay CTA */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <Button
                          size="lg"
                          onClick={() => setShowCheckout(true)}
                          className="font-poppins font-bold uppercase tracking-wide shadow-lg"
                          aria-label={`Load Eventbrite checkout for ${event.title}`}
                        >
                          <Ticket className="w-5 h-5 mr-2" />
                          Book Tickets Here
                        </Button>
                        <p className="font-poppins text-xs text-foreground/60 mt-3">
                          Secure checkout powered by Eventbrite.
                        </p>
                      </div>
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
                  {orderedFaqs.map((f, i) => (
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

        {/* Mobile sticky book bar: fills the pb-20 slot reserved below */}
        <EventMobileBookBar
          shortDate={event.shortDate}
          venue={event.venue}
          statusLabel={event.statusLabel}
          isSoldOut={isSoldOut}
          ctaLabel={groupMode ? 'Book for the Group' : undefined}
          onBook={scrollToCheckout}
        />
      </div>
    </>
  );
};

export default EventPageV2;
