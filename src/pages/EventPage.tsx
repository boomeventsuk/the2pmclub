import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventbriteEmbed from '@/components/EventbriteEmbed';
import { Calendar, MapPin, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EventJson {
  id: number;
  eventCode: string;
  eventbriteId: string;
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
}

interface EventData {
  eventCode: string;
  eventbriteId: string;
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
const parseLocation = (location: string): { venue: string; city: string; postcode: string } => {
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
  
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                day === 2 || day === 22 ? 'nd' : 
                day === 3 || day === 23 ? 'rd' : 'th';
  
  return `${dayName} ${day}${suffix} ${month} ${year}`;
};

// Load and process events from JSON
const loadEventData = async (): Promise<Record<string, EventData>> => {
  try {
    const response = await fetch('/events.json');
    const events: EventJson[] = await response.json();
    
    const eventData: Record<string, EventData> = {};
    
    events.forEach(event => {
      const { venue, city, postcode } = parseLocation(event.location);
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
      
      const timeDisplay = endMinutes === 0 
        ? `${start12Hour}${startAmPm}–${end12Hour}${endAmPm}`
        : `${start12Hour}${startAmPm}–${end12Hour}:${endMinutes.toString().padStart(2, '0')}${endAmPm}`;
      
      // Format range for meta descriptions
      const timeRange = endMinutes === 0 
        ? `${startHour}–${endHour}pm`
        : `${startHour}–${endHour}:${endMinutes.toString().padStart(2, '0')}pm`;
      
      // Parse highlights
      const highlights = event.highlights ? event.highlights.split('|') : [];
      
      eventData[event.eventCode] = {
        eventCode: event.eventCode,
        eventbriteId: event.eventbriteId,
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
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Share functionality
  const buildUtmUrl = (eventUrl: string, medium: string) => {
    const url = new URL(eventUrl);
    url.searchParams.set('utm_source', 'website');
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', 'event-share');
    return url.toString();
  };

  const copyText = (text: string): Promise<void> => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return Promise.resolve();
      } catch (err) {
        textArea.remove();
        return Promise.reject(err);
      }
    }
  };

  const handleWhatsAppShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.eventCode}/`, 'whatsapp');
    const message = `Check out this event: ${eventData.title} on ${eventData.date}! ${eventUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: 'WhatsApp',
        event_name: eventData.title,
      });
    }
  };

  const handleFacebookShare = (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.eventCode}/`, 'facebook');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'share_event',
        event_category: 'Social Share',
        event_label: 'Facebook',
        event_name: eventData.title,
      });
    }
  };

  const handleCopyLink = async (eventData: EventData) => {
    const eventUrl = buildUtmUrl(`https://www.the2pmclub.co.uk/events/${eventData.eventCode}/`, 'copy-link');
    try {
      await copyText(eventUrl);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      });
      
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'share_event',
          event_category: 'Social Share',
          event_label: 'Copy Link',
          event_name: eventData.title,
        });
      }
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      const eventData = await loadEventData();
      const currentEvent = slug ? eventData[slug] : null;
      setEvent(currentEvent);
      setLoading(false);
    };
    
    loadEvent();
  }, [slug]);

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

  const isLutonTrial = event.eventCode === '070226-2PM-LUT';

  return (
    <>
      <Helmet>
        <title>The 2 PM Club — {event.city} — {event.date} | {event.venue}</title>
        <meta name="description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems. ${event.city}, ${event.date} at ${event.venue}.`} />
        <link rel="canonical" href={`https://www.the2pmclub.co.uk/events/${event.eventCode}/`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The 2 PM Club" />
        <meta property="og:title" content={`The 2 PM Club — ${event.city} — ${event.date}`} />
        <meta property="og:description" content={`Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`} />
        <meta property="og:url" content={`https://www.the2pmclub.co.uk/events/${event.eventCode}/`} />
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
        
        {/* Hero Section */}
        {isLutonTrial ? (
          <section className="pt-32 pb-12 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left: Event Poster */}
                  <div className="flex justify-center md:justify-start">
                    <img
                      src={event.squareImg}
                      alt={`${event.title} event poster`}
                      className="w-full max-w-md rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  {/* Right: Event Details */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-poppins text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {event.title}
                      </h1>
                      {event.subtitle && (
                        <p className="font-poppins text-xl text-muted-foreground mb-6 leading-relaxed">
                          {event.subtitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-4 text-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-poppins">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-poppins">{event.timeDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="font-poppins">{event.venue}, {event.city}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={scrollToCheckout}
                      size="lg"
                      className="w-full md:w-auto font-poppins"
                    >
                      BOOK TICKETS
                    </Button>

                    <div className="pt-4 border-t border-border">
                      <p className="font-poppins text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share This Event
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsAppShare(event)}
                          className="flex-1 font-poppins"
                        >
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFacebookShare(event)}
                          className="flex-1 font-poppins"
                        >
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(event)}
                          className="flex-1 font-poppins"
                        >
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="pt-32 pb-12 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
              {/* Event Image */}
              <div className="max-w-2xl mx-auto mb-8">
                <img 
                  src={event.squareImg} 
                  alt={`${event.title} event poster`}
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>

              {/* Event Details */}
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-poppins text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {event.title}
                </h1>

                {event.subtitle && (
                  <p className="font-poppins text-xl text-muted-foreground mb-8 leading-relaxed">
                    {event.subtitle}
                  </p>
                )}

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-poppins">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-poppins">{event.timeDisplay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-poppins">{event.venue}, {event.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Description Section */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {event.fullDescription && (
                <div className="font-poppins text-lg text-foreground leading-relaxed mb-8 whitespace-pre-line">
                  {event.fullDescription}
                </div>
              )}

              {/* Highlights Section */}
              {event.highlights.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-poppins text-3xl font-bold text-foreground mb-6 text-center">
                    WHY THIS IS YOUR NEW TRADITION
                  </h2>
                  <div className="space-y-4">
                    {event.highlights.map((highlight, index) => {
                      const [title, description] = highlight.split(': ');
                      return (
                        <div key={index} className="bg-card border border-border rounded-lg p-4">
                          <p className="font-poppins text-foreground">
                            <strong>{title}</strong>
                            {description && <span>: {description}</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Embedded Checkout Section */}
        <section id="checkout-section" className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-poppins text-3xl font-bold text-center text-foreground mb-8">
                Book Your Tickets
              </h2>
              <div className="bg-card border border-border rounded-lg p-6">
                <EventbriteEmbed 
                  eventbriteId={event.eventbriteId}
                  containerId={`eventbrite-widget-${event.eventCode}`}
                  height={425}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-poppins text-2xl font-bold text-foreground mb-6">
                Good to Know
              </h2>
              <ul className="font-poppins text-foreground space-y-2 mb-8 list-disc list-inside">
                <li>Four hours of 80s, 90s and 00s anthems</li>
                <li>Proper "night out" atmosphere — in the afternoon</li>
                <li>18+ recommended unless stated otherwise</li>
                <li>Doors open at the stated start time</li>
              </ul>

              {event.infoUrl && event.infoUrl !== 'https://www.facebook.com/events/TBD' && (
                <div className="mb-8">
                  <Button asChild variant="outline" size="lg">
                    <a href={event.infoUrl} target="_blank" rel="noopener noreferrer">
                      View Facebook Event →
                    </a>
                  </Button>
                </div>
              )}

              <Button asChild variant="outline">
                <a href="/">← Back to all events</a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default EventPage;
