import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import { Calendar, MapPin, Clock, Copy, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackEventPageView, trackBookClick } from '@/lib/dataLayer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
  subtitle?: string;
  fullDescription?: string;
  highlights?: string;
  isHidden?: boolean;
  status?: string;
  urgencyLabel?: string;
  accentColor?: string;
}

interface EventData {
  slug: string;
  eventType: string;
  cityCode: string;
  eventbriteId: string;
  promoCode?: string;
  city: string;
  date: string;
  venue: string;
  postcode: string;
  startIso: string;
  endIso: string;
  infoUrl: string;
  squareImg: string;
  title: string;
  timeRange: string;
  timeDisplay: string;
  subtitle: string;
  fullDescription: string;
  highlights: string[];
  status?: string;
  urgencyLabel?: string;
  accentColor?: string;
}

// Parse venue and city from location string
const parseLocation = (location: string): {
  venue: string;
  city: string;
  postcode: string;
} => {
  const parts = location.split(', ');
  const venue = parts[0] || location;
  const city = parts[parts.length - 1] || '';
  
  // Venue-specific postcodes (for cities with multiple venues)
  const venuePostcodes: Record<string, string> = {
    "Franklin's Gardens": 'NN5 5BU',
    "Cinch Stadium": 'NN5 5BU',
    'The Picturedrome': 'NN1 5BD',
    'Mattioli Woods Welford Road Stadium': 'LE2 7TR',
  };
  
  // City-level postcodes (fallback)
  const cityPostcodes: Record<string, string> = {
    'Coventry': 'CV1 1GX',
    'Milton Keynes': 'MK9 3PU',
    'Northampton': 'NN1 5BD',
    'Birmingham': 'B1 1AA',
    'Luton': 'LU1 2AA',
    'Bedford': 'MK40 2TH',
    'Leicester': 'LE2 7TR'
  };
  
  // Check venue-specific first, then fall back to city
  const postcode = venuePostcodes[venue] || cityPostcodes[city] || '';
  
  return {
    venue,
    city,
    postcode
  };
};

// Format date for display
const formatEventDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${dayName} ${day}${suffix} ${month} ${year}`;
};

// Format short date for mobile sticky CTA
const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[date.getMonth()]}`;
};

// Get dynamic urgency wording for Saturday events
const getUrgencyWording = (eventStartIso: string): { urgencyText: string; showUrgency: boolean } => {
  const eventDate = new Date(eventStartIso);
  const now = new Date();
  
  // If event has passed, don't show urgency
  if (now > eventDate) {
    return { urgencyText: "", showUrgency: false };
  }
  
  // Calculate the Sunday before the event Saturday (6 days before)
  const sundayBefore = new Date(eventDate);
  sundayBefore.setDate(eventDate.getDate() - 6);
  sundayBefore.setHours(0, 0, 0, 0);
  
  // If we're in the event week (Sunday onwards), use "this Saturday"
  if (now >= sundayBefore) {
    return { urgencyText: "this Saturday", showUrgency: true };
  }
  
  // Otherwise use "next Saturday"
  return { urgencyText: "next Saturday", showUrgency: true };
};

// Load and process events from JSON
// Note: isHidden events are still loaded for direct URL access (e.g., pre-sale pages)
const loadEventData = async (includeHidden = false): Promise<Record<string, EventData>> => {
  try {
    console.log('[EventPage] Fetching /events.json...');
    const response = await fetch('/events.json');
    console.log('[EventPage] Fetch response status:', response.status);
    const events: EventJson[] = await response.json();
    console.log('[EventPage] Loaded events count:', events.length);
    console.log('[EventPage] Event slugs:', events.map(e => e.slug));
    const eventData: Record<string, EventData> = {};
    events.forEach(event => {
      // Skip hidden events unless explicitly requested (for pre-sale pages)
      if (event.isHidden && !includeHidden) return;
      const {
        venue,
        city,
        postcode
      } = parseLocation(event.location);
      const formattedDate = formatEventDate(event.start);

      // Calculate time display strings
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);
      const startHour = startTime.getHours();
      const endHour = endTime.getHours();
      const endMinutes = endTime.getMinutes();

      // Format display times (12-hour format)
      const startAmPm = startHour >= 12 ? 'pm' : 'am';
      const endAmPm = endHour >= 12 ? 'pm' : 'am';
      const start12Hour = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour;
      const end12Hour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;
      const timeDisplay = endMinutes === 0 ? `${start12Hour}${startAmPm}–${end12Hour}${endAmPm}` : `${start12Hour}${startAmPm}–${end12Hour}:${endMinutes.toString().padStart(2, '0')}${endAmPm}`;

      // Format range for meta descriptions
      const timeRange = endMinutes === 0 ? `${startHour}–${endHour}pm` : `${startHour}–${endHour}:${endMinutes.toString().padStart(2, '0')}pm`;

      // Parse highlights
      const highlights = event.highlights ? event.highlights.split('|') : [];
      eventData[event.slug] = {
        slug: event.slug,
        eventType: event.eventType,
        cityCode: event.cityCode,
        eventbriteId: event.eventbriteId,
        promoCode: event.promoCode,
        city,
        date: formattedDate,
        venue,
        postcode,
        startIso: event.start,
        endIso: event.end,
        infoUrl: event.infoUrl,
        squareImg: event.image,
        title: event.title,
        timeRange,
        timeDisplay,
        subtitle: event.subtitle || '',
        fullDescription: event.fullDescription || event.description,
        highlights,
        status: event.status,
        urgencyLabel: event.urgencyLabel,
        accentColor: event.accentColor
      };
    });
    return eventData;
  } catch (error) {
    console.error('Failed to load events:', error);
    return {};
  }
};

// Artist List Section Component
const ARTISTS = [
  'SPICE GIRLS', 'MADONNA', 'BEYONCÉ', 'WHITNEY HOUSTON', 'KYLIE MINOGUE',
  'OASIS', 'BON JOVI', 'TAKE THAT', 'QUEEN', 'ROBBIE WILLIAMS',
  'THE KILLERS', 'ABBA', 'WHAM!', 'BLUR', 'ARCTIC MONKEYS',
  'RIHANNA', 'CHRISTINA AGUILERA', 'ROBIN S', 'N-TRANCE', 'TLC',
  'CRAIG DAVID', 'SUGABABES', 'GIRLS ALOUD', 'STEPS', 'FIVE',
  "B*WITCHED", 'S CLUB 7', 'BACKSTREET BOYS', 'FATBOY SLIM'
];

const ArtistListSection = ({ accentColor }: { accentColor?: string }) => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const accentTextClass = accentColor === 'coral' ? 'text-[#E88B73]' : accentColor === 'tigers-green' ? 'text-[#2E8B57]' : 'text-primary/80';
  
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            ref={elementRef}
            className={`bg-muted/30 border border-border/20 rounded-2xl p-8 md:p-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-8">
              🪩 YOUR SOUNDTRACK
            </h2>
            <p className={`font-poppins text-lg md:text-xl leading-relaxed tracking-wide ${accentTextClass}`}>
              {ARTISTS.join(' · ')}
            </p>
            <p className="font-poppins text-sm md:text-base text-foreground/60 italic mt-8">
              Zero filler. Maximum sing-along. The songs you've been mouthing along to in Sainsbury's for years.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const EventPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isRetargeting = searchParams.get('rt') === '1';
  const isEmailLanding = searchParams.has('email');
  const isTigersLanding = searchParams.has('tigers');
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStickyBookTickets, setShowStickyBookTickets] = useState(false);
  const heroBookButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // FAQs data
  const faqs = [{
    question: "Is it really like a night out clubbing in the afternoon?",
    answer: "Yes. Club-level production, proper sound system, lighting, confetti moments. But you're done by 6pm and you'll actually feel good the next day. Same energy, better timing."
  }, {
    question: "What music will be played?",
    answer: "80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. The DJ builds the energy across the afternoon—starting with solid, accessible tracks and building toward peak moments. Think Whitney, Wham!, Spice Girls, Beyoncé, Take That, The Killers, Oasis."
  }, {
    question: "Why do you start at 2pm?",
    answer: "Because it actually works with real life. You can have lunch with friends, run errands, whatever. You're done by 6pm, home by 7pm. You get a proper night out without sacrificing your Sunday or disrupting your week. That's the whole point."
  }, {
    question: "Do you offer group tickets?",
    answer: "Yes. We offer group tickets for groups of four or more. People come to celebrate all sorts—birthdays, hen dos, work dos. But honestly, you don't need an excuse. The biggest thing is getting your friends together for a proper afternoon out. That's what this is for."
  }, {
    question: "What's the crowd like?",
    answer: "Predominantly female, predominantly over 30. Everyone's welcome. Everyone's here for the same reason—to have a proper afternoon out with good music and good people. The atmosphere is genuinely welcoming."
  }, {
    question: "What should I wear?",
    answer: "Whatever makes you feel good. Smart casual works perfectly – think the outfit you'd wear out for a nice afternoon. If you're planning to dance a lot, comfy shoes are your friend. Dress code is just to feel good."
  }, {
    question: "What time do doors open and when does it finish?",
    answer: "Doors open at 2pm. Event runs until 6pm. You can arrive anytime after 2pm."
  }];

  // Share functionality
  const buildUtmUrl = (eventUrl: string, medium: string) => {
    const url = new URL(eventUrl);
    url.searchParams.set('utm_source', 'website');
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', 'event-share');
    return url.toString();
  };

  const handleWhatsAppShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.slug}/`, 'whatsapp');
    const message = `Just seen this - THE 2PM CLUB Daytime Disco - ${eventData.city}. ${eventData.date} | ${eventData.timeDisplay} | ${eventData.venue}. Up for it? ${eventUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: 'WhatsApp',
        event_name: eventData.title
      });
    }
  };

  const handleMessengerShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.slug}/`, 'messenger');
    const message = `Just seen this - THE 2PM CLUB Daytime Disco - ${eventData.city}. ${eventData.date} | ${eventData.timeDisplay} | ${eventData.venue}. Up for it? ${eventUrl}`;
    if (isMobile) {
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(eventUrl)}&app_id=966242223397117&redirect_uri=${encodeURIComponent('https://www.the2pmclub.co.uk')}&quote=${encodeURIComponent(message)}`, '_blank', 'width=600,height=500');
    }
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: 'Messenger',
        event_name: eventData.title
      });
    }
  };

  const handleEmailShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.slug}/`, 'email');
    const subject = encodeURIComponent(`THE 2PM CLUB - ${eventData.city}`);
    const body = encodeURIComponent(`Just seen this - THE 2PM CLUB Daytime Disco - ${eventData.city}. ${eventData.date} | ${eventData.timeDisplay} | ${eventData.venue}. Up for it? ${eventUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: 'Email',
        event_name: eventData.title
      });
    }
  };

  const handleCopyLink = async (eventData: EventData) => {
    const eventUrl = `https://www.the2pmclub.co.uk/events/${eventData.slug}/`;
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link copied!",
        description: "Share it with your friends",
      });
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'share_event',
          event_category: 'Social Share',
          event_label: 'Copy Link',
          event_name: eventData.title
        });
      }
    } catch (err) {
      toast({
        title: "Couldn't copy link",
        description: "Please copy the URL from your browser",
        variant: "destructive"
      });
    }
  };

  const scrollToCheckout = () => {
    // Fire InitiateCheckout via centralized dataLayer (includes Meta Pixel)
    if (event?.slug) {
      trackBookClick(event.slug, event.title);
    }

    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      console.log('[EventPage] Raw slug from URL:', slug);
      console.log('[EventPage] Slug type:', typeof slug);
      console.log('[EventPage] Is retargeting mode:', isRetargeting);
      console.log('[EventPage] Is email landing mode:', isEmailLanding);
      console.log('[EventPage] Is tigers landing mode:', isTigersLanding);
      
      // Include hidden events for direct URL access (pre-sale pages)
      const eventData = await loadEventData(true);
      console.log('[EventPage] Event data keys:', Object.keys(eventData));
      
      const normalizedSlug = slug?.toUpperCase().replace(/\/$/, '');
      console.log('[EventPage] Normalized slug:', normalizedSlug);
      
      const currentEvent = normalizedSlug ? eventData[normalizedSlug] : null;
      console.log('[EventPage] Found event?:', currentEvent ? 'YES - ' + currentEvent.title : 'NO');
      
      setEvent(currentEvent);
      setLoading(false);
    };
    loadEvent();
  }, [slug, isRetargeting, isEmailLanding, isTigersLanding]);

  // Detect Christmas events
  const isChristmasEvent = event?.title.toLowerCase().includes('christmas');

  // Track page view - fires ViewContent via centralized dataLayer (includes Meta Pixel)
  useEffect(() => {
    if (!event) return;
    trackEventPageView(event.slug, event.title);
  }, [event]);

  // Track hero button visibility for sticky button (only for non-retargeting and non-email)
  useEffect(() => {
    if (isRetargeting || isEmailLanding || isTigersLanding) return; // These have their own mobile sticky
    if (!heroBookButtonRef.current) {
      setShowStickyBookTickets(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyBookTickets(!entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(heroBookButtonRef.current);
    return () => observer.disconnect();
  }, [event, isRetargeting, isEmailLanding]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse text-center">Loading event...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-4">Sorry, we couldn't find the event you're looking for.</p>
          <Button asChild>
            <a href="/">← Back to all events</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // ==========================================
  // RETARGETING MODE - Streamlined conversion page
  // ==========================================
  if (isRetargeting) {
    return (
      <>
        <Helmet>
          <title>The 2 PM Club — {event.city} — {event.date} | {event.venue}</title>
          <meta name="description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems. ${event.city}, ${event.date} at ${event.venue}.`} />
          <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="The 2 PM Club" />
          <meta property="og:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
          <meta property="og:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:image" content={event.squareImg} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`The 2 PM Club — ${event.city} — {event.date}`} />
          <meta name="twitter:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta name="twitter:image" content={event.squareImg} />
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="min-h-screen bg-background pb-20 md:pb-0">
          <Header />
          
          {/* Retargeting Urgency Banner for last-tickets events */}
          {event.status === 'last-tickets' && (
            <div className="urgency-banner-last-tickets text-white py-4 md:py-5 text-center sticky top-0 z-50">
              <p className="font-poppins font-black text-2xl md:text-4xl tracking-tight uppercase">
                {event.urgencyLabel || 'LAST TICKETS'}
              </p>
              <p className="font-poppins text-lg md:text-xl font-bold mt-1">
                Don't miss out!
              </p>
            </div>
          )}
          
          {/* Compact Hero Section */}
          <section className="pt-24 md:pt-28 pb-6 bg-gradient-to-b from-background via-background to-muted/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img 
                      src={event.squareImg} 
                      alt={`${event.title} event poster`} 
                      className="w-full max-w-sm h-auto rounded-xl shadow-2xl shadow-primary/20" 
                    />
                  </div>
                  
                  {/* Right: Compact Details */}
                  <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-5 md:p-6 space-y-4">
                    {/* Retargeting Headline - With urgency override for last-tickets */}
                    {event.status === 'sold-out' ? (
                      <div>
                        <p className="font-poppins text-lg md:text-xl text-primary font-semibold mb-2">
                          🎉 {event.city} is Sold Out!
                        </p>
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                          Join the Waiting List
                        </h1>
                      </div>
                    ) : event.status === 'last-tickets' ? (
                      <div>
                        <div className="bg-primary/30 border-2 border-primary rounded-xl px-4 py-3 mb-3 w-full">
                          <p className="font-poppins text-xl md:text-3xl font-black text-foreground tracking-tight uppercase text-center">
                            {event.urgencyLabel || 'LAST TICKETS'}
                          </p>
                        </div>
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                          THE 2PM CLUB Daytime Disco — {event.city}
                        </h1>
                        <p className="font-poppins text-lg md:text-xl font-semibold text-foreground/80 mt-2">
                          Don't miss out!
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-poppins text-lg md:text-xl text-primary font-semibold mb-2">
                          You're back. Skip to the good bit.
                        </p>
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                          THE 2PM CLUB Daytime Disco — {event.city}
                        </h1>
                      </div>
                    )}
                    
                    {/* Event Details - Single Line Style */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.venue}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className="w-full font-poppins text-lg"
                    >
                      {event.status === 'sold-out' ? 'Join Waiting List' : 'Go on then'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket Widget - Immediately Visible */}
          <section id="checkout-section" className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 md:p-6">
                  <div className="bg-card/50 rounded-xl overflow-hidden">
                    <EventbriteEmbed 
                      eventbriteId={event.eventbriteId} 
                      eventSlug={event.slug}
                      containerId={`eventbrite-widget-rt-${event.slug}`} 
                      height={600} 
                      promoCode={event.promoCode} 
                      eventTitle={event.title} 
                    />
                  </div>
                  <p className="font-poppins text-sm text-foreground/60 text-center mt-4">
                    Same event. Same good idea. Just less scrolling this time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Four Reasons */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-poppins text-lg md:text-xl font-semibold text-foreground/90 mb-4 text-center">
                  Still thinking about it? Here's why people love it:
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🎤 A room full of people who know every word. Your kind of crowd.
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🎶 Four hours with your favourite people, your favourite songs, and zero small talk about kids or work.
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🙌 Nobody's too cool to dance or sing out loud — that's literally why we're all here!
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🏡 Done by 6pm. Sunday stays yours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Single Testimonial */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-primary/5 border border-border/30 rounded-xl p-5 text-center">
                  <div className="flex justify-center mb-3 text-yellow-400 text-lg">★★★★★</div>
                  <p className="font-poppins text-xl md:text-2xl font-semibold text-foreground/90 mb-3">
                    "Don't think I've danced and laughed so much in a long time. Thank you!"
                  </p>
                  <p className="font-poppins text-sm text-muted-foreground font-medium uppercase">
                    — TRACEY M, BEDFORD
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Group Share Prompt */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card/50 border border-border/30 rounded-xl p-5 text-center">
                  <p className="font-poppins text-base md:text-lg text-foreground/80 mb-4">
                    Share this in the group chat
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {isMobile && (
                      <Button 
                        variant="outline"
                        onClick={() => handleWhatsAppShare(event)}
                        className="font-poppins"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => handleMessengerShare(event)}
                      className="font-poppins"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messenger
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCopyLink(event)}
                      className="font-poppins"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />

          {/* Sticky Mobile CTA - Fixed Bottom Bar (Mobile Only) */}
          {isMobile && (
            <div className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 safe-area-inset-bottom ${event.status === 'last-tickets' ? 'bg-primary border-primary/50' : 'bg-background/95 border-border/50'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-poppins text-sm font-bold truncate ${event.status === 'last-tickets' ? 'text-white' : 'text-foreground'}`}>
                    {event.status === 'last-tickets' ? (event.urgencyLabel || 'LAST TICKETS') : `${event.city} — ${formatShortDate(event.startIso)}`}
                  </p>
                </div>
                <Button 
                  onClick={scrollToCheckout}
                  className={`font-poppins font-bold px-6 shrink-0 ${event.status === 'last-tickets' ? 'bg-white text-primary hover:bg-white/90' : ''}`}
                  variant={event.status === 'last-tickets' ? 'secondary' : 'default'}
                >
                  {event.status === 'sold-out' ? 'Join Waiting List' : 'Book Now'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // EMAIL LANDING MODE - Reminder page with video
  // ==========================================
  if (isEmailLanding) {
    // Video URLs (same as standard page)
    const videoUrl = 'https://boombastic-events.b-cdn.net/2PM%20web%20videos/2PM%20video%20low%20res.mp4';
    const videoPoster = 'https://boombastic-events.b-cdn.net/2PM%20web%20videos/2PM%20Web%20Video%20Thumbnail.jpg';

    return (
      <>
        <Helmet>
          <title>The 2 PM Club — {event.city} — {event.date} | {event.venue}</title>
          <meta name="description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems. ${event.city}, ${event.date} at ${event.venue}.`} />
          <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="The 2 PM Club" />
          <meta property="og:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
          <meta property="og:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:image" content={event.squareImg} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
          <meta name="twitter:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta name="twitter:image" content={event.squareImg} />
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="min-h-screen bg-background pb-20 md:pb-0">
          <Header />
          
          {/* Email Urgency Banner for last-tickets events */}
          {event.status === 'last-tickets' && (
            <div className="urgency-banner-last-tickets text-white py-4 md:py-5 text-center sticky top-0 z-50">
              <p className="font-poppins font-black text-2xl md:text-4xl tracking-tight uppercase">
                {event.urgencyLabel || 'LAST TICKETS'}
              </p>
              <p className="font-poppins text-lg md:text-xl font-bold mt-1">
                Don't miss out!
              </p>
            </div>
          )}
          
          {/* Northampton Email Urgency Banner */}
          {event.status === 'sold-out' && (
            <div className="urgency-banner-npton text-white py-3 text-center">
              <p className="font-poppins font-bold text-sm md:text-base tracking-wide">
              🎉 SOLD OUT — Join the Waiting List
              </p>
            </div>
          )}
          
          {/* Hero Section */}
          <section className="pt-24 md:pt-28 pb-6 bg-gradient-to-b from-background via-background to-muted/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img 
                      src={event.squareImg} 
                      alt={`${event.title} event poster`} 
                      className="w-full max-w-sm h-auto rounded-xl shadow-2xl shadow-primary/20" 
                    />
                  </div>
                  
                  {/* Right: Details */}
                  <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-5 md:p-6 space-y-4">
                    {/* Email Headline - Northampton urgent version */}
                    {event.status === 'sold-out' ? (
                      <div>
                        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase mb-2">
                          NORTHAMPTON IS SOLD OUT
                        </h1>
                        <p className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-2">
                          🎉 Join the Waiting List
                        </p>
                        <p className="font-poppins text-sm text-foreground/70 tracking-wider uppercase">
                          YOUR CREW | ANTHEMS | HOME BY 7
                        </p>
                      </div>
                    ) : event.status === 'last-tickets' ? (
                      <div>
                        <div className="bg-primary/30 border-2 border-primary rounded-xl px-4 py-3 mb-3 w-full">
                          <p className="font-poppins text-xl md:text-3xl font-black text-foreground tracking-tight uppercase text-center">
                            {event.urgencyLabel || 'LAST TICKETS'}
                          </p>
                        </div>
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                          THE 2PM CLUB Daytime Disco — {event.city}
                        </h1>
                        <p className="font-poppins text-lg md:text-xl font-semibold text-foreground/80 mt-2">
                          Don't miss out!
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-poppins text-lg md:text-xl text-primary font-semibold mb-2">
                          Ready for another one?
                        </p>
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                          THE 2PM CLUB Daytime Disco — {event.city}
                        </h1>
                      </div>
                    )}
                    
                    {/* Event Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">{event.venue}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className="w-full font-poppins text-lg"
                    >
                      {event.status === 'sold-out' ? 'Join Waiting List' : 'Book Tickets'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket Widget - Moved up after hero */}
          <section id="checkout-section" className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 md:p-6">
                  <div className="bg-card/50 rounded-xl overflow-hidden">
                    <EventbriteEmbed 
                      eventbriteId={event.eventbriteId} 
                      eventSlug={event.slug}
                      containerId={`eventbrite-widget-email-${event.slug}`} 
                      height={600} 
                      promoCode={event.promoCode} 
                      eventTitle={event.title} 
                    />
                  </div>
                  <p className="font-poppins text-sm text-foreground/60 text-center mt-4">
                    Same good idea. Less scrolling this time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <video 
                  className="w-full rounded-2xl shadow-xl"
                  controls 
                  muted
                  playsInline 
                  preload="metadata"
                  poster={videoPoster}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
                <p className="font-poppins text-sm text-foreground/60 text-center mt-3">
                  This is what you're walking into.
                </p>
              </div>
            </div>
          </section>

          {/* Intro + Four Reasons */}
          <section className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <p className="font-poppins text-lg md:text-xl text-foreground/90 text-center mb-6">
                  An afternoon of iconic 80s, 90s, and 00s anthems. Here's why it hits different:
                </p>
                <div className="grid gap-4">
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🎤</span>
                    <p className="font-poppins text-foreground/90">
                      A room full of people who know every word. Your kind of crowd.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">👯‍♀️</span>
                    <p className="font-poppins text-foreground/90">
                      Four hours with your favourite people, your favourite songs, and zero small talk about kids or work.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🙌</span>
                    <p className="font-poppins text-foreground/90">
                      Nobody's too cool to dance or sing out loud – that's literally why we're all here!
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🏠</span>
                    <p className="font-poppins text-foreground/90">
                      Done by 6pm. Sunday stays yours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Share Row */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card/50 border border-border/30 rounded-xl p-5 text-center">
                  <p className="font-poppins text-base md:text-lg text-foreground/80 mb-4">
                    Share this in the group chat
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {/* Messenger - Always available */}
                    <Button 
                      variant="outline"
                      onClick={() => handleMessengerShare(event)}
                      className="font-poppins"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.05 1.9c.02.52.49.88.98.76l2.12-.53c.19-.05.39-.02.56.05 1.01.35 2.12.54 3.29.54 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.02L10.5 12.3l-4.28 2.8 4.7-5.02 2.62 2.72 4.2-2.8-4.7 5.02z" />
                      </svg>
                      Messenger
                    </Button>
                    {/* WhatsApp on mobile, Email on desktop */}
                    {isMobile ? (
                      <Button 
                        variant="outline"
                        onClick={() => handleWhatsAppShare(event)}
                        className="font-poppins"
                      >
                        <img 
                          src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png"
                          alt="WhatsApp" 
                          className="w-5 h-5 mr-2" 
                        />
                        WhatsApp
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => handleEmailShare(event)}
                        className="font-poppins"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Email
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => handleCopyLink(event)}
                      className="font-poppins"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />

          {/* Sticky Mobile CTA */}
          {isMobile && (
            <div className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 safe-area-inset-bottom ${event.status === 'last-tickets' ? 'bg-primary border-primary/50' : 'bg-background/95 border-border/50'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-poppins text-sm font-bold truncate ${event.status === 'last-tickets' ? 'text-white' : 'text-foreground'}`}>
                    {event.status === 'last-tickets' ? (event.urgencyLabel || 'LAST TICKETS') : `${event.city} — ${formatShortDate(event.startIso)}`}
                  </p>
                </div>
                <Button 
                  onClick={scrollToCheckout}
                  className={`font-poppins font-bold px-6 shrink-0 ${event.status === 'last-tickets' ? 'bg-white text-primary hover:bg-white/90' : ''}`}
                  variant={event.status === 'last-tickets' ? 'secondary' : 'default'}
                >
                  {event.status === 'sold-out' ? 'Join Waiting List' : 'Book Now'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // TIGERS PARTNER LANDING MODE - Leicester Tigers website traffic
  // ==========================================
  if (isTigersLanding) {
    return (
      <>
        <Helmet>
          <title>The 2 PM Club — Leicester — {event.date} | {event.venue}</title>
          <meta name="description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems. Leicester, ${event.date} at ${event.venue}.`} />
          <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="The 2 PM Club" />
          <meta property="og:title" content={`The 2 PM Club — Leicester — ${event.date}`} />
          <meta property="og:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:image" content={event.squareImg} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="min-h-screen bg-background pb-20 md:pb-0">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-24 md:pt-28 pb-6 bg-gradient-to-b from-background via-background to-muted/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img 
                      src={event.squareImg} 
                      alt={`${event.title} event poster`} 
                      className="w-full max-w-sm h-auto rounded-xl shadow-2xl shadow-tigers-green" 
                    />
                  </div>
                  
                  {/* Right: Details Card */}
                  <div className="bg-card/60 backdrop-blur-sm border border-[#2E8B57]/40 rounded-2xl p-5 md:p-6 space-y-4">
                    <div>
                      <p className="font-poppins text-lg md:text-xl text-[#2E8B57] font-semibold mb-2">
                        WELCOME FROM LEICESTER TIGERS
                      </p>
                      <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                        THE 2PM CLUB Daytime Disco
                      </h1>
                      <p className="font-poppins text-base text-foreground/70 mt-2">
                        Your exclusive link to the ultimate afternoon party at Welford Road
                      </p>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 icon-tigers-green" />
                        <span className="font-poppins text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 icon-tigers-green" />
                        <span className="font-poppins text-sm">{event.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 icon-tigers-green" />
                        <span className="font-poppins text-sm">{event.venue}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className="w-full font-poppins text-lg btn-tigers-green"
                    >
                      Book Tickets
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket Widget */}
          <section id="checkout-section" className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#1A6D37]/10 border border-[#2E8B57]/30 rounded-2xl p-4 md:p-6">
                  <div className="bg-card/50 rounded-xl overflow-hidden">
                    <EventbriteEmbed 
                      eventbriteId={event.eventbriteId} 
                      eventSlug={event.slug}
                      containerId={`eventbrite-widget-tigers-${event.slug}`} 
                      height={600} 
                      promoCode={event.promoCode} 
                      eventTitle={event.title} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Four Reasons */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-poppins text-lg md:text-xl font-semibold text-foreground/90 mb-4 text-center">
                  Here's why people love it:
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🎤 A room full of people who know every word. Your kind of crowd.
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🎶 Four hours with your favourite people, your favourite songs, and zero small talk about kids or work.
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🙌 Nobody's too cool to dance or sing out loud — that's literally why we're all here!
                    </p>
                  </div>
                  <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                    <p className="font-poppins text-sm md:text-base text-foreground/90">
                      🏡 Done by 6pm. Sunday stays yours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Share Row */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card/50 border border-border/30 rounded-xl p-5 text-center">
                  <p className="font-poppins text-base md:text-lg text-foreground/80 mb-4">
                    Share this in the group chat
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {isMobile && (
                      <Button 
                        variant="outline"
                        onClick={() => handleWhatsAppShare(event)}
                        className="font-poppins"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => handleMessengerShare(event)}
                      className="font-poppins"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messenger
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCopyLink(event)}
                      className="font-poppins"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />

          {/* Sticky Mobile CTA - Tigers Green */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t border-[#2E8B57]/50 bg-background/95 p-3 safe-area-inset-bottom">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm font-bold truncate text-foreground">
                    Leicester — {formatShortDate(event.startIso)}
                  </p>
                </div>
                <Button 
                  onClick={scrollToCheckout}
                  className="font-poppins font-bold px-6 shrink-0 btn-tigers-green"
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // PRE-SALE MODE - Exclusive early access page
  // ==========================================
  if (event.status === 'pre-sale') {
    const isCoralAccent = event.accentColor === 'coral';
    const isTigersGreenAccent = event.accentColor === 'tigers-green';
    const hasAccent = isCoralAccent || isTigersGreenAccent;
    
    return (
      <>
        <Helmet>
          <title>Pre-Sale | The 2 PM Club — {event.city} — {event.date}</title>
          <meta name="description" content={`Exclusive pre-sale access: THE 2PM CLUB Daytime Disco at ${event.venue}, ${event.city}. ${event.date}.`} />
          <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="The 2 PM Club" />
          <meta property="og:title" content={`Pre-Sale | The 2 PM Club — ${event.city}`} />
          <meta property="og:description" content={`Exclusive pre-sale access: Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
          <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
          <meta property="og:image" content={event.squareImg} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="min-h-screen bg-background pb-20 md:pb-0">
          <Header />
          
          {/* Pre-Sale Hero Section */}
          <section className="pt-28 md:pt-32 pb-8 md:pb-12 bg-gradient-to-b from-background via-background to-muted/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                
                {/* Pre-Sale Badge */}
                <div className="text-center mb-6">
                  <span className="pre-sale-badge">🎉 Exclusive Pre-Sale</span>
                </div>
                
                {/* Fun Headline */}
                <div className="text-center mb-8">
                  <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-4">
                    Welcome to the Pre-Sale!
                  </h1>
                  <p className="font-poppins text-xl md:text-2xl text-foreground/80 mb-6">
                    You're part of the group. Let's get this party started! 🎶
                  </p>
                  <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-6 max-w-2xl mx-auto">
                    <p className="font-poppins text-lg md:text-xl text-foreground/90 mb-2">
                      We're back at <strong>Franklin's Gardens</strong> — the home of <strong>Northampton Saints</strong>.
                    </p>
                    <p className="font-poppins text-lg md:text-xl text-primary font-bold">
                      Last time at Cinch Stadium? SOLD OUT. 🔥
                    </p>
                    <p className="font-poppins text-base text-foreground/70 mt-2">
                      This is your early access.
                    </p>
                  </div>
                </div>
                
                {/* Event Poster + Details */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img 
                      src={event.squareImg} 
                      alt={`${event.title} event poster`} 
                      className={`w-full max-w-sm h-auto rounded-xl shadow-2xl ${isCoralAccent ? 'shadow-coral' : isTigersGreenAccent ? 'shadow-tigers-green' : 'shadow-primary/20'}`}
                    />
                  </div>
                  
                  {/* Right: Details Card */}
                  <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-5 md:p-6 space-y-4">
                    <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
                      THE 2PM CLUB Daytime Disco
                    </h2>
                    <p className="font-poppins text-lg text-foreground/80">
                      {event.venue}, {event.city}
                    </p>
                    
                    {/* Event Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className={`w-5 h-5 ${isCoralAccent ? 'icon-coral' : isTigersGreenAccent ? 'icon-tigers-green' : 'text-primary'}`} />
                        <span className="font-poppins text-base font-semibold">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-5 h-5 ${isCoralAccent ? 'icon-coral' : isTigersGreenAccent ? 'icon-tigers-green' : 'text-primary'}`} />
                        <span className="font-poppins text-base">{event.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`w-5 h-5 ${isCoralAccent ? 'icon-coral' : isTigersGreenAccent ? 'icon-tigers-green' : 'text-primary'}`} />
                        <span className="font-poppins text-base">{event.venue}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      ref={heroBookButtonRef}
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className={`w-full font-poppins text-lg ${isCoralAccent ? 'btn-coral' : isTigersGreenAccent ? 'btn-tigers-green' : ''}`}
                    >
                      Book Your Tickets 🎫
                    </Button>
                    
                    <p className="font-poppins text-sm text-foreground/60 text-center">
                      Limited tickets available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket Widget */}
          <section id="checkout-section" className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className={`rounded-2xl p-4 md:p-6 ${isCoralAccent ? 'bg-[#E88B73]/10 border border-[#E88B73]/30' : isTigersGreenAccent ? 'bg-[#1A6D37]/10 border border-[#1A6D37]/30' : 'bg-primary/10 border border-primary/30'}`}>
                  <div className="bg-card/50 rounded-xl overflow-hidden">
                    <EventbriteEmbed 
                      eventbriteId={event.eventbriteId} 
                      eventSlug={event.slug}
                      containerId={`eventbrite-widget-presale-${event.slug}`} 
                      height={600} 
                      promoCode={event.promoCode} 
                      eventTitle={event.title} 
                    />
                  </div>
                  <p className="font-poppins text-sm text-foreground/60 text-center mt-4">
                    Early bird gets the dancefloor. 💃
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why You'll Love It - Brief version */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-center mb-6">
                  Why You'll Love It
                </h2>
                <div className="grid gap-4">
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🎤</span>
                    <p className="font-poppins text-foreground/90">
                      A room full of people who know every word. Wall-to-wall 80s, 90s & 00s anthems.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">👯‍♀️</span>
                    <p className="font-poppins text-foreground/90">
                      The night out everyone actually says yes to. Four hours, your favourite people.
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🏟️</span>
                    <p className="font-poppins text-foreground/90">
                      Back at Franklin's Gardens — home of the Saints. We sold this place out before!
                    </p>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="text-2xl">🏠</span>
                    <p className="font-poppins text-foreground/90">
                      Done by 6pm. Home by 7. Sunday stays yours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Share Row */}
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card/40 border border-border/30 rounded-2xl p-4 md:p-6 text-center">
                  <p className="font-poppins text-lg font-semibold text-foreground mb-4">
                    Got mates who need to see this? 👇
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button 
                      onClick={() => handleWhatsAppShare(event)}
                      className="font-poppins bg-[#25D366] hover:bg-[#128C7E] text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleEmailShare(event)}
                      className="font-poppins"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCopyLink(event)}
                      className="font-poppins"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />

          {/* Sticky Mobile CTA */}
          {isMobile && showStickyBookTickets && (
            <div className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 safe-area-inset-bottom ${isCoralAccent ? 'bg-[#E88B73]/95 border-[#E88B73]/50' : isTigersGreenAccent ? 'bg-[#1A6D37]/95 border-[#1A6D37]/50' : 'bg-primary/95 border-primary/50'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm font-bold text-white truncate">
                    🎉 Pre-Sale Access
                  </p>
                </div>
                <Button 
                  onClick={scrollToCheckout}
                  className="font-poppins font-bold px-6 shrink-0 bg-white text-foreground hover:bg-white/90"
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // STANDARD MODE - Full event page
  // ==========================================
  return (
    <>
      <Helmet>
        <title>The 2 PM Club — {event.city} — {event.date} | {event.venue}</title>
        <meta name="description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems. ${event.city}, ${event.date} at ${event.venue}.`} />
        <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The 2 PM Club" />
        <meta property="og:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
        <meta property="og:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
        <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.slug}/`} />
        <meta property="og:image" content={event.squareImg} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
        <meta name="twitter:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
        <meta name="twitter:image" content={event.squareImg} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "startDate": event.startIso,
            "endDate": event.endIso,
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "description": event.fullDescription,
            "image": [event.squareImg],
            "location": {
              "@type": "Place",
              "name": event.venue,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": event.city,
                "postalCode": event.postcode,
                "addressCountry": "GB"
              }
            },
            "organizer": {
              "@type": "Organization",
              "name": "Boombastic Events Ltd",
              "url": "https://www.the2pmclub.co.uk/"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "url": `https://www.eventbrite.co.uk/e/${event.eventbriteId}`,
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Sold Out Banner */}
        {event.status === 'sold-out' && (
          <div className="urgency-banner-npton text-white py-3 text-center">
            <p className="font-poppins font-bold text-sm md:text-base tracking-wide">
              🎉 SOLD OUT — Join the Waiting List
            </p>
          </div>
        )}
        
        {/* Last Tickets Urgency Banner - MASSIVE, IMPOSSIBLE TO IGNORE */}
        {event.status === 'last-tickets' && (
          <div className="urgency-banner-last-tickets text-white py-4 md:py-5 text-center sticky top-0 z-50">
            <p className="font-poppins font-black text-2xl md:text-4xl tracking-tight uppercase">
              {event.urgencyLabel || 'LAST TICKETS'}
            </p>
            <p className="font-poppins text-lg md:text-xl font-bold mt-1">
              Don't miss out!
            </p>
          </div>
        )}
        
        {/* Hero Section */}
        <section className="pt-32 md:pt-36 pb-8 bg-gradient-to-b from-background via-background to-muted/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Left: Event Poster */}
                <div className="flex justify-center md:justify-start">
                  <img 
                    src={event.squareImg} 
                    alt={`${event.title} event poster`} 
                    className={`w-full max-w-md h-auto rounded-xl shadow-2xl ${event.accentColor === 'coral' ? 'shadow-coral' : event.accentColor === 'tigers-green' ? 'shadow-tigers-green' : 'shadow-primary/20'}`} 
                  />
                </div>
                
                {/* Right: Event Details - Wrapped in Card */}
                <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-4 md:p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    {isChristmasEvent ? (
                      <>
                        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-1 uppercase">
                          THE 2PM CLUB Christmas
                        </h1>
                        <p className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-2 uppercase">
                          Daytime Disco {event.city}
                        </p>
                        <p className="font-poppins text-base md:text-lg text-foreground/70">
                          Iconic 80s 90s 00s Anthems plus Festive Classics
                        </p>
                      </>
                    ) : event.status === 'sold-out' ? (
                      <>
                        <div className="inline-block bg-muted border border-muted-foreground/40 rounded-lg px-3 py-1 mb-2">
                          <span className="font-poppins text-sm font-bold text-foreground tracking-wider">🎉 SOLD OUT</span>
                        </div>
                        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-1 uppercase">
                          THE 2PM CLUB Daytime Disco {event.city.toUpperCase()}
                        </h1>
                        <p className="font-poppins text-xl md:text-2xl font-semibold text-foreground/70 mb-2">
                          Join the waiting list for cancellations
                        </p>
                      </>
                    ) : event.status === 'last-tickets' ? (
                      <>
                        <div className="bg-primary/30 border-2 border-primary rounded-xl px-6 py-4 mb-4 w-full">
                          <p className="font-poppins text-2xl md:text-4xl font-black text-foreground tracking-tight uppercase text-center">
                            {event.urgencyLabel || 'LAST TICKETS'}
                          </p>
                        </div>
                        <h1 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-1 uppercase">
                          THE 2PM CLUB Daytime Disco {event.city.toUpperCase()}
                        </h1>
                        <p className="font-poppins text-xl md:text-2xl font-semibold text-foreground/80 mb-2">
                          Don't miss out!
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-1 uppercase">
                          THE 2PM CLUB Daytime Disco {event.city.toUpperCase()}
                        </h1>
                        <p className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-foreground/80 mb-2 uppercase">
                          Iconic 80s 90s 00s Anthems
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${event.accentColor === 'coral' ? 'icon-coral' : event.accentColor === 'tigers-green' ? 'icon-tigers-green' : 'text-primary'}`} />
                      <span className="font-poppins font-medium text-base">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-5 h-5 ${event.accentColor === 'coral' ? 'icon-coral' : event.accentColor === 'tigers-green' ? 'icon-tigers-green' : 'text-primary'}`} />
                      <span className="font-poppins font-medium text-base">{event.timeDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-5 h-5 ${event.accentColor === 'coral' ? 'icon-coral' : event.accentColor === 'tigers-green' ? 'icon-tigers-green' : 'text-primary'}`} />
                      <span className="font-poppins font-medium text-base">{event.venue}, {event.city}</span>
                    </div>
                  </div>

                  {event.status === 'last-tickets' ? (
                    <Button 
                      ref={heroBookButtonRef} 
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className="w-full md:w-auto font-poppins font-semibold text-lg"
                    >
                      Book Now
                    </Button>
                  ) : (
                    <Button 
                      ref={heroBookButtonRef} 
                      onClick={scrollToCheckout} 
                      size="lg" 
                      className={`w-full md:w-auto font-poppins ${event.accentColor === 'coral' ? 'btn-coral' : event.accentColor === 'tigers-green' ? 'btn-tigers-green' : ''}`}
                    >
                      {event.status === 'sold-out' ? 'Join Waiting List' : 'BOOK TICKETS'}
                    </Button>
                  )}

                  <div className="pt-4 border-t border-border/50">
                    <p className="font-poppins text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Be the group chat hero — Share this event
                    </p>
                    <div className="share-icons justify-start">
                      {isMobile ? (
                        <button className="icon-btn icon-whatsapp" onClick={() => handleWhatsAppShare(event)} aria-label="Share on WhatsApp">
                          <img src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png" alt="" />
                        </button>
                      ) : (
                        <button className="icon-btn" onClick={() => handleEmailShare(event)} aria-label="Share via Email" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                          <Mail className="w-5 h-5" />
                        </button>
                      )}
                      <button className="icon-btn icon-messenger" onClick={() => handleMessengerShare(event)} title="Share on Messenger" aria-label="Share on Messenger">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.05 1.9c.02.52.49.88.98.76l2.12-.53c.19-.05.39-.02.56.05 1.01.35 2.12.54 3.29.54 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.02L10.5 12.3l-4.28 2.8 4.7-5.02 2.62 2.72 4.2-2.8-4.7 5.02z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eventbrite Embed - Moved up directly after hero */}
        <section id="checkout-section" className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl p-6 md:p-8 ${event.accentColor === 'coral' ? 'bg-[#E88B73]/10 border border-[#E88B73]/30' : event.accentColor === 'tigers-green' ? 'bg-[#1A6D37]/10 border border-[#1A6D37]/30' : 'bg-primary/10 border border-primary/30'}`}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 bg-primary/20">
                    <span className="text-2xl">🎟️</span>
                  </div>
                  {event.status === 'last-tickets' ? (
                    <>
                      <h2 className="font-poppins text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground">
                        {event.urgencyLabel || 'LAST TICKETS'}
                      </h2>
                      <p className="font-poppins text-sm text-foreground/70">
                        Don't miss out!
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="font-poppins text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground">
                        BOOK YOUR TICKETS
                      </h2>
                      <p className="font-poppins text-sm text-foreground/70">
                        The most popular day party in the Midlands. Choose your tickets below.
                      </p>
                    </>
                  )}
                </div>
                
                <div className="bg-card/50 rounded-xl overflow-hidden">
                  <EventbriteEmbed 
                    eventbriteId={event.eventbriteId} 
                    eventSlug={event.slug}
                    containerId={`eventbrite-widget-${event.slug}`} 
                    height={700} 
                    promoCode={event.promoCode} 
                    eventTitle={event.title} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section - New hardcoded copy */}
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8 mb-8">
                <div className="mx-auto md:max-w-2xl">
                  {isChristmasEvent ? (
                    (() => {
                      const { urgencyText, showUrgency } = getUrgencyWording(event.startIso);
                      return (
                        <>
                          {showUrgency ? (
                            <>
                              <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-3 tracking-wide">
                                Christmas is nearly here. 🎄
                              </p>
                              <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-6 tracking-wide font-bold">
                                {urgencyText.charAt(0).toUpperCase() + urgencyText.slice(1)} is YOUR chance to dance before the family chaos kicks in!
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-3 tracking-wide">
                                THE 2PM CLUB CHRISTMAS DAYTIME DISCO HITS {event.city.toUpperCase()}.
                              </p>
                              <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-6 tracking-wide">
                                4 Hours of Iconic Anthems & Festive Favourites. Home by 7(ish).
                              </p>
                            </>
                          )}
                          
                          <blockquote className="border-l-4 border-primary pl-4 mb-6">
                            <p className="font-poppins text-lg md:text-xl text-foreground italic">
                              {showUrgency 
                                ? `"Before the family chaos kicks in, before the endless Monopoly and leftover turkey sandwiches — ${urgencyText} is YOUR chance to dance."`
                                : `"Remember when Christmas parties didn't mean losing your entire weekend to regret?"`
                              }
                            </p>
                          </blockquote>
                          
                          {showUrgency && (
                            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                              <p className="font-poppins text-base md:text-lg text-foreground/90 leading-relaxed">
                                🎟 Tickets just £10. No fees. No surprises.<br />
                                👯‍♀️ 4 for £35 — perfect for the group chat crew.
                              </p>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                              Four hours of iconic 80s, 90s, and 00s anthems — Whitney, Wham!, Bon Jovi, Spice Girls — plus all your favourite Christmas classics thrown in for good measure. 🎤
                            </p>
                            <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                              Full confetti. Full volume. Home by 7 feeling like absolute legends. 🪩
                            </p>
                            <p className="font-poppins text-base text-foreground/85 leading-relaxed font-bold md:text-xl">
                              Bring your mates. Bring your workmates. Bring the group chat crew who've been saying "we should do something" since September.<br />
                              <span className="text-primary">This is the something.</span> ✨
                            </p>
                            <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                              You DESERVE a proper dance with your mates before Christmas!<br />
                              One link. Everyone books. Christmas sorted.
                            </p>
                          </div>
                        </>
                      );
                    })()
                  ) : event.status === 'sold-out' ? (
                    <>
                      {/* Sold Out Block */}
                      <div className="bg-muted border border-muted-foreground/40 rounded-xl p-4 mb-6">
                        <p className="font-poppins text-lg md:text-xl font-bold text-foreground">
                          🎉 We did it. {event.city} is officially SOLD OUT!
                        </p>
                        <p className="font-poppins text-base text-foreground/80 mt-2">
                          Join our waiting list and we'll contact you if any tickets become available.
                        </p>
                      </div>
                      
                      <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-3 tracking-wide">
                        THE 2PM CLUB DAYTIME DISCO RETURNS TO {event.city.toUpperCase()}.
                      </p>
                      <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-6 tracking-wide">
                        An Afternoon of Iconic Anthems from the 80s 90s 00s!
                      </p>
                      
                      <blockquote className="border-l-4 border-primary pl-4 mb-6">
                        <p className="font-poppins text-lg md:text-xl text-foreground italic">
                          "Remember when going OUT OUT didn't require a week's recovery?"
                        </p>
                      </blockquote>
                      
                      <div className="space-y-4">
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                          When you could sing every word, lose your voice, and still feel human the next day?
                        </p>
                        <p className="font-poppins text-base text-foreground/85 leading-relaxed font-bold md:text-2xl">
                          We've created the perfect solution!<br />
                          Welcome to THE 2PM CLUB!
                        </p>
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed mb-6">
                          4 hours from 2pm til 6pm where nothing else matters. Just you, your mates, and every anthem you've ever loved. All the fun of a proper night out – and still home by 7ish to actually enjoy your Sunday
                        </p>
                      </div>
                    </>
                  ) : event.cityCode === 'LEIC' ? (
                    <>
                      <h2 className="font-poppins text-xl md:text-2xl text-foreground font-bold mb-6 tracking-wide">
                        WE'RE BRINGING THE PARTY TO WELFORD ROAD 🏉
                      </h2>
                      
                      <blockquote className="border-l-4 border-[#1A6D37] pl-4 mb-6">
                        <p className="font-poppins text-lg md:text-xl text-foreground italic">
                          "You know that feeling. Mr. Brightside kicks in and suddenly you're 22 again, screaming every word with your mates. No responsibility. No overthinking. Just pure, ridiculous joy."
                        </p>
                      </blockquote>
                      
                      <div className="space-y-4">
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                          That feeling is coming to Leicester. We're launching THE 2PM CLUB at the home of Leicester Tigers for the ultimate afternoon party — and you're invited.
                        </p>
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                          Four hours of the biggest hairbrush anthems and sing-alongs, with night-out energy, confetti moments, and a room full of people who know every word too. The perfect party, at a time that actually works.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Standard hardcoded description */}
                      <h2 className="font-poppins text-xl md:text-2xl text-foreground font-bold mb-6 tracking-wide">
                        THE NIGHT OUT THAT STARTS AT 2PM ✨
                      </h2>
                      
                      <blockquote className="border-l-4 border-primary pl-4 mb-6">
                        <p className="font-poppins text-lg md:text-xl text-foreground italic">
                          "You know that feeling. Mr. Brightside kicks in and suddenly you're 22 again, screaming every word with your mates. No responsibility. No overthinking. Just pure, ridiculous joy."
                        </p>
                      </blockquote>
                      
                      <div className="space-y-4">
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                          That feeling still exists. And it starts at 2pm.
                        </p>
                        <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                          Four hours of the biggest hairbrush anthems and sing-alongs, with night-out energy, confetti moments, and a room full of people who know every word too.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artist List Section */}
        <ArtistListSection accentColor={event.accentColor} />

        {/* Video Section */}
        <div className="py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto">
              <video
                controls
                playsInline
                preload="none"
                poster="https://boombastic-events.b-cdn.net/2PM%20web%20videos/2PM%20Web%20Video%20Thumbnail.jpg"
                className="w-full"
              >
                <source
                  src="https://boombastic-events.b-cdn.net/2PM%20web%20videos/2PM%20video%20low%20res.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8">
                <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                  {isChristmasEvent ? "Why This Beats Every Other Christmas Do" : "WHY EVERYONE SAYS YES TO THIS ONE"}
                </h2>
                <div className="space-y-4">
                  {isChristmasEvent ? (
                    [
                      {
                        emoji: "🎄",
                        title: "Festive Floor-Fillers",
                        description: "Mariah, Wham!, Slade, Shakin' Stevens — every Christmas banger you've been waiting all year to belt out. No ironic distance. No holding back. Just pure, unfiltered festive joy with a room full of people who get it."
                      },
                      {
                        emoji: "🎤",
                        title: "Iconic Throwbacks",
                        description: "Wall-to-wall 80s, 90s & 00s anthems. Every chorus you still know by heart — even the ones you forgot you knew. Whitney to Oasis. Spice Girls to Bon Jovi. Four hours of songs that shaped your Saturday nights, now soundtracking your Saturday afternoon."
                      },
                      {
                        emoji: "🕑",
                        title: "The 7pm Win",
                        description: "Full night-out energy — confetti, lights, the lot — but you're home before your takeaway gets cold. No 2am regrets. No lost Sunday. Just that post-party buzz while you're curled up on the sofa, still smiling."
                      },
                      {
                        emoji: "👯‍♀️",
                        title: "Group-Chat Hero",
                        description: "You know how group plans usually go: 47 messages, three \"maybes,\" someone bails. Not this time. Afternoon timing means everyone can actually make it. One link, one plan — you just became the legend who sorted Christmas."
                      }
                    ].map((pillar, index) => (
                      <div key={index} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <p className="font-poppins text-foreground text-base md:text-lg">
                          <span className="mr-2">{pillar.emoji}</span>
                          <strong className="font-semibold">{pillar.title}</strong>
                          <span className="text-foreground/80 block mt-2">{pillar.description}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    [
                      {
                        emoji: "🎤",
                        title: "THE ROOM WHERE EVERYONE KNOWS EVERY WORD",
                        description: "Wall-to-wall 80s, 90s and 00s perfection. Confetti cannons, dazzling lights, and that moment the whole room sings together. That's what you're booking."
                      },
                      {
                        emoji: "🕺",
                        title: "NIGHT-OUT ENERGY. AFTERNOON TIMING.",
                        description: "Same Boombastic production. Same atmosphere you remember from your best nights out. Dance freely, laugh loudly, and still be home by 7pm."
                      },
                      {
                        emoji: "👯",
                        title: "THE ONE PLAN THAT DOESN'T FALL APART",
                        description: "2pm Saturday works for everyone. No babysitter dramas, no late-night worries. One link. One plan. You just became the legend who sorted it."
                      },
                      {
                        emoji: "😎",
                        title: "ALL THE FUN. STILL BUZZING BY WEDNESDAY.",
                        description: "You walked out last time saying \"Let's do it again!\" This is the time to do it. This is your plan."
                      },
                      {
                        emoji: "🏆",
                        title: "TRUST THE TRACK RECORD",
                        description: "Created by Boombastic Events — 10+ years of consistent sell-outs across the UK because we know how to create moments that matter."
                      }
                    ].map((card, index) => (
                      <div key={index} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <p className="font-poppins text-foreground text-base md:text-lg">
                          <span className="mr-2">{card.emoji}</span>
                          <strong className="font-semibold">{card.title}</strong>
                          <span className="text-foreground/80 block mt-2">{card.description}</span>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery - Auto-scrolling */}
        <section className="py-8 md:py-12 overflow-hidden">
          <div className="relative">
            <div className="flex gap-4 animate-scroll">
              {["https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_6_bjt6h7.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_7_jl6yvd.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_6_bjt6h7.jpg", "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_7_jl6yvd.jpg"].map((img, index) => (
                <div key={index} className="flex-shrink-0 w-64 md:w-80">
                  <img src={img} alt="2PM Club event moments" className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                WHY YOU LOVE THE 2PM CLUB
              </h2>
              
              <div className="md:max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      quote: "Brilliant music, not just clubbing anthems the whole time",
                      author: "Josie L, Northampton"
                    },
                    {
                      quote: "Finally able to get all my friends together, when's the next one?",
                      author: "Marie T, Coventry"
                    },
                    {
                      quote: "Don't think I've danced and laughed so much in a long time. Thank you!",
                      author: "Tracey M, Bedford"
                    }
                  ].map((testimonial, index) => (
                    <div key={index} className="bg-primary/5 border border-border/30 rounded-xl p-4">
                      <div className="flex mb-2 text-yellow-400 text-sm">★★★★★</div>
                      <p className="font-poppins text-lg md:text-xl font-semibold text-foreground/90 mb-3">
                        "{testimonial.quote}"
                      </p>
                      <p className="font-poppins text-xs text-muted-foreground font-medium uppercase">
                        — {testimonial.author}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Eventbrite Embed - Bottom of page */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl p-6 md:p-8 ${event.accentColor === 'coral' ? 'bg-[#E88B73]/10 border border-[#E88B73]/30' : event.accentColor === 'tigers-green' ? 'bg-[#1A6D37]/10 border border-[#1A6D37]/30' : 'bg-primary/10 border border-primary/30'}`}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 bg-primary/20">
                    <span className="text-2xl">🎟️</span>
                  </div>
                  <h2 className="font-poppins text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground">
                    READY? BOOK YOUR TICKETS
                  </h2>
                  <p className="font-poppins text-sm text-foreground/70">
                    Don't miss out — don't wait for the group chat to decide.
                  </p>
                </div>
                
                <div className="bg-card/50 rounded-xl overflow-hidden">
                  <EventbriteEmbed 
                    eventbriteId={event.eventbriteId} 
                    eventSlug={event.slug}
                    containerId={`eventbrite-widget-bottom-${event.slug}`} 
                    height={700} 
                    promoCode={event.promoCode} 
                    eventTitle={event.title} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8">
                <div className="mx-auto md:max-w-2xl">
                  <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                    Questions People Ask Before They Book
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                        <AccordionTrigger className="text-left font-poppins font-medium text-foreground hover:no-underline text-base md:text-lg uppercase">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/85 font-poppins pt-2">
                          {faq.answer}
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
          </div>
        </section>

        {/* Facebook Community CTA */}
        <section className="py-8 md:py-12 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <a 
                href="https://www.facebook.com/groups/the2pmclub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-primary/20 border border-primary/40 rounded-xl px-6 py-5 text-center hover:bg-primary/30 transition-colors"
              >
                <p className="font-poppins text-lg text-foreground">
                  Join the conversation in our official <span className="text-primary font-semibold">Facebook Group</span>
                </p>
              </a>
            </div>
          </div>
        </section>

        <Footer />
        
        {/* Sticky Book Tickets Button - Top Right */}
        {showStickyBookTickets && (
          <div className="fixed top-24 right-4 z-50 animate-fade-in">
            <Button 
              onClick={scrollToCheckout} 
              className={`font-poppins font-semibold px-6 py-2 rounded-full shadow-lg ${event.accentColor === 'coral' ? 'btn-coral' : event.accentColor === 'tigers-green' ? 'btn-tigers-green' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
            >
              {event.status === 'sold-out' ? 'Join Waiting List' : 'Book Tickets'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventPage;
