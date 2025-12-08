import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
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
}

// Parse venue and city from location string
const parseLocation = (location: string): {
  venue: string;
  city: string;
  postcode: string;
} => {
  const parts = location.split(', ');
  const venue = parts[0] || location;
  const city = parts[1] || '';
  const postcodes: Record<string, string> = {
    'Coventry': 'CV1 1GX',
    'Milton Keynes': 'MK9 3PU',
    'Northampton': 'NN1 5BD',
    'Birmingham': 'B1 1AA',
    'Luton': 'LU1 2AA',
    'Bedford': 'MK40 2TH'
  };
  return {
    venue,
    city,
    postcode: postcodes[city] || ''
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

// Load and process events from JSON
const loadEventData = async (): Promise<Record<string, EventData>> => {
  try {
    console.log('[EventPage] Fetching /events.json...');
    const response = await fetch('/events.json');
    console.log('[EventPage] Fetch response status:', response.status);
    const events: EventJson[] = await response.json();
    console.log('[EventPage] Loaded events count:', events.length);
    console.log('[EventPage] Event slugs:', events.map(e => e.slug));
    const eventData: Record<string, EventData> = {};
    events.forEach(event => {
      if (event.isHidden) return;
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
        highlights
      };
    });
    return eventData;
  } catch (error) {
    console.error('Failed to load events:', error);
    return {};
  }
};
const EventPage = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStickyBookTickets, setShowStickyBookTickets] = useState(false);
  const heroBookButtonRef = useRef<HTMLButtonElement>(null);
  const {
    toast
  } = useToast();
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
    const message = `Check out this event: ${eventData.title} on ${eventData.date}! ${eventUrl}`;
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
  const handleFacebookShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.slug}/`, isMobile ? 'messenger' : 'facebook');
    if (isMobile) {
      // Open Messenger app directly
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(eventUrl)}`;
    } else {
      // Open Facebook share dialog
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
    }
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: isMobile ? 'Messenger' : 'Facebook',
        event_name: eventData.title
      });
    }
  };
  const scrollToCheckout = () => {
    // Track book click
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'eventpage_book_click',
      event_slug: event?.slug,
      event_type: '2PM'
    });

    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      console.log('[EventPage] Raw slug from URL:', slug);
      console.log('[EventPage] Slug type:', typeof slug);
      
      const eventData = await loadEventData();
      console.log('[EventPage] Event data keys:', Object.keys(eventData));
      
      // Case-insensitive lookup - normalize slug to uppercase and strip trailing slash
      const normalizedSlug = slug?.toUpperCase().replace(/\/$/, '');
      console.log('[EventPage] Normalized slug:', normalizedSlug);
      
      const currentEvent = normalizedSlug ? eventData[normalizedSlug] : null;
      console.log('[EventPage] Found event?:', currentEvent ? 'YES - ' + currentEvent.title : 'NO');
      
      setEvent(currentEvent);
      setLoading(false);
    };
    loadEvent();
  }, [slug]);

  // Detect Christmas events
  const isChristmasEvent = event?.title.toLowerCase().includes('christmas');

  // Track page view
  useEffect(() => {
    if (!event) return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'eventpage_view',
      event_slug: event.slug,
      event_type: '2PM',
      event_title: event.title
    });
  }, [event]);

  // Track hero button visibility for sticky button
  useEffect(() => {
    if (!heroBookButtonRef.current) {
      setShowStickyBookTickets(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyBookTickets(!entry.isIntersecting);
    }, {
      threshold: 0
    });
    observer.observe(heroBookButtonRef.current);
    return () => observer.disconnect();
  }, [event]);
  
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse text-center">Loading event...</div>
        </div>
        <Footer />
      </div>;
  }
  if (!event) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-4">Sorry, we couldn't find the event you're looking for.</p>
          <Button asChild>
            <a href="/">← Back to all events</a>
          </Button>
        </div>
        <Footer />
      </div>;
  }

  return <>
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
        <Header hideCommunityBanner={true} />
        
        {/* Hero Section */}
        <section className="pt-32 md:pt-36 pb-8 bg-gradient-to-b from-background via-background to-muted/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img src={event.squareImg} alt={`${event.title} event poster`} className="w-full max-w-md h-auto rounded-xl shadow-2xl shadow-primary/20" />
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
                    </div>

                    <Button ref={heroBookButtonRef} onClick={scrollToCheckout} size="lg" className="w-full md:w-auto font-poppins">
                      BOOK TICKETS
                    </Button>

                    <div className="pt-4 border-t border-border/50">
                      <p className="font-poppins text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Be the group chat hero — Share this event
                      </p>
                      <div className="share-icons justify-start">
                        <button className="icon-btn icon-whatsapp" onClick={() => handleWhatsAppShare(event)} aria-label="Share on WhatsApp">
                          <img src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519736/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png" alt="" />
                        </button>
                        <button className="icon-btn icon-facebook" onClick={() => handleFacebookShare(event)} title={isMobile ? "Share on Messenger" : "Share on Facebook"} aria-label={isMobile ? "Share on Messenger" : "Share on Facebook"}>
                          {isMobile ?
                      // Messenger icon
                      <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.05 1.9c.02.52.49.88.98.76l2.12-.53c.19-.05.39-.02.56.05 1.01.35 2.12.54 3.29.54 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.02L10.5 12.3l-4.28 2.8 4.7-5.02 2.62 2.72 4.2-2.8-4.7 5.02z" />
                            </svg> :
                      // Facebook icon
                      <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Description Section */}
        <section className="py-6 md:py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {event.fullDescription && <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8 mb-8">
                    <div className="mx-auto md:max-w-2xl">
                      {isChristmasEvent ? (
                        <>
                          {/* Christmas Intro Text */}
                          <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-3 tracking-wide">
                            THE 2PM CLUB CHRISTMAS DAYTIME DISCO HITS {event.city.toUpperCase()}.
                          </p>
                          <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-6 tracking-wide">
                            4 Hours of Iconic Anthems & Festive Favourites. Home by 7(ish).
                          </p>
                          
                          {/* Christmas Pull Quote */}
                          <blockquote className="border-l-4 border-primary pl-4 mb-6">
                            <p className="font-poppins text-lg md:text-xl text-foreground italic">
                              "Remember when Christmas parties didn't mean losing your entire weekend to regret?"
                            </p>
                          </blockquote>
                          
                          {/* Christmas Body Paragraphs */}
                          <div className="space-y-4">
                            <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed">
                              Welcome to THE 2PM CLUB Christmas Daytime Disco — the festive get-together your group chat can actually agree on. From 2PM sharp, we're upgrading your December with neon fairy lights and wall-shaking 80s, 90s & 00s anthems, spiked with the festive bangers you've been miming in the car since November.
                            </p>
                            <p className="font-poppins text-base text-foreground/85 leading-relaxed font-bold md:text-2xl">
                              Your best night out is NOW in the afternoon.
                            </p>
                            <p className="font-poppins text-base md:text-lg text-foreground/85 leading-relaxed mb-6">
                              This isn't your work's half-hearted Secret Santa do. This is full club production — confetti cannons, dazzling lights, and DJs who know exactly when to drop "All I Want For Christmas Is You." By 7pm, you'll be back on the sofa, glowing like Rudolph, still humming Mariah. Whether you're ditching the office party or finally doing something that doesn't involve being polite to Dave from accounts — this is how you do Christmas.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Regular Intro Text */}
                          <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-3 tracking-wide">
                            THE 2PM CLUB DAYTIME DISCO RETURNS TO {event.city.toUpperCase()}.
                          </p>
                          <p className="font-poppins text-xl md:text-2xl text-foreground/90 mb-6 tracking-wide">
                            An Afternoon of Iconic Anthems from the 80s 90s 00s!
                          </p>
                          
                          {/* Regular Pull Quote */}
                          <blockquote className="border-l-4 border-primary pl-4 mb-6">
                            <p className="font-poppins text-lg md:text-xl text-foreground italic">
                              "Remember when going OUT OUT didn't require a week's recovery?"
                            </p>
                          </blockquote>
                          
                          {/* Regular Body Paragraphs */}
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
                      )}
                    </div>
                  </div>}

                {/* Video Section */}
                <div className="py-10 md:py-14">
                  <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto">
                      <video
                        controls
                        playsInline
                        preload="none"
                        poster={isChristmasEvent 
                          ? "https://res.cloudinary.com/dteowuv7o/image/upload/v1764581303/CHRISTMAS_2PM_VID_WEB_thumbnail_mzaalk.png"
                          : "https://res.cloudinary.com/dteowuv7o/image/upload/v1764280330/WEB_VID_THUMBNAIL_i8cg1s.png"
                        }
                        className="w-full"
                      >
                        <source
                          src={isChristmasEvent
                            ? "https://res.cloudinary.com/dteowuv7o/video/upload/v1764581448/CHRISTMAS_2PM_VID_WEB_v2_tnraj9.mp4"
                            : "https://res.cloudinary.com/dteowuv7o/video/upload/v1764279993/2PM_video_low_res_aihmi0.mp4"
                          }
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8">
                  <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                    {isChristmasEvent ? "Why This Beats Every Other Christmas Do" : "Why Daytime Discos Are a Game Changer!"}
                  </h2>
                  <div className="space-y-4">
                    {isChristmasEvent ? (
                      // Christmas-specific pillars
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
                      // Regular event highlights
                      event.highlights.length > 0 && event.highlights.map((highlight, index) => {
                        const [title, description] = highlight.split(': ');
                        return (
                          <div key={index} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-colors">
                            <p className="font-poppins text-foreground text-base md:text-lg">
                              <strong className="font-semibold">{title}</strong>
                              {description && <span className="text-foreground/80">: {description}</span>}
                            </p>
                          </div>
                        );
                      })
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
                {["https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_1_ndjab4.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_2_qedzzq.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_3_nuwrvk.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_4_j87ixj.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_5_eln7gp.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_6_bjt6h7.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268389/2pm_web_7_jl6yvd.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_1_ndjab4.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_2_qedzzq.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_3_nuwrvk.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_4_j87ixj.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_5_eln7gp.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_6_bjt6h7.jpg", "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268389/2pm_web_7_jl6yvd.jpg"].map((img, index) => <div key={index} className="flex-shrink-0 w-64 md:w-80">
                    <img src={img} alt="2PM Club event moments" className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg" loading="lazy" />
                  </div>)}
              </div>
            </div>
          </section>

        {/* Social Proof Section */}
        <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                  Why You Love The 2PM Club
                </h2>
                
                <div className="md:max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[{
                quote: "Brilliant music, not just clubbing anthems the whole time",
                author: "Josie L, Northampton"
              }, {
                quote: "Finally able to get all my friends together, when's the next one?",
                author: "Marie T, Coventry"
              }, {
                quote: "Don't think I've danced and laughed so much in a long time. Thank you!",
                author: "Tracey M, Bedford"
              }].map((testimonial, index) => <div key={index} className="bg-primary/5 border border-border/30 rounded-xl p-4">
                      <div className="flex mb-2 text-yellow-400 text-sm">★★★★★</div>
                      <p className="font-poppins text-lg md:text-xl font-semibold text-foreground/90 mb-3">
                        "{testimonial.quote}"
                      </p>
                      <p className="font-poppins text-xs text-muted-foreground font-medium uppercase">
                        — {testimonial.author}
                      </p>
                    </div>)}
                </div>
                </div>
              </div>
            </div>
          </section>

        {/* Embedded Checkout Section */}
        <section id="checkout-section" className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Pink Block containing everything */}
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 md:p-8">
                {/* Unified Header with Icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                    <span className="text-2xl">🎟️</span>
                  </div>
                  <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-1">
                    Book Your Tickets
                  </h2>
                  <p className="font-poppins text-sm text-foreground/70">
                    Don't miss out! The most popular day party in the Midlands
                  </p>
                </div>
                
                {/* Eventbrite embed inside the pink block */}
                <div className="bg-card/50 rounded-xl overflow-hidden">
                  <EventbriteEmbed 
                    eventbriteId={event.eventbriteId} 
                    eventSlug={event.slug}
                    containerId={`eventbrite-widget-${event.slug}`} 
                    height={425} 
                    promoCode={event.promoCode} 
                    eventTitle={event.title} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 md:py-14 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card/50 border border-border/30 rounded-2xl p-6 md:p-8">
                <div className="mx-auto md:max-w-2xl">
                  <h2 className="font-poppins text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                    Questions People Ask Before They Book
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                        <AccordionTrigger className="text-left font-poppins font-medium text-foreground hover:no-underline text-base md:text-lg uppercase">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/85 font-poppins pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>)}
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

        <Footer />
        
        {/* Sticky Book Tickets Button - Top Right */}
        {showStickyBookTickets && <div className="fixed top-24 right-4 z-50 animate-fade-in">
            <Button onClick={scrollToCheckout} className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-semibold px-6 py-2 rounded-full shadow-lg">
              Book Tickets
            </Button>
          </div>}
      </div>
    </>;
};
export default EventPage;
