import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface EventJson {
  id: number;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  infoUrl: string;
  image: string;
  description: string;
}

interface EventData {
  city: string;
  date: string;
  venue: string;
  postcode: string;
  startIso: string;
  endIso: string;
  eventbriteUrl: string;
  infoUrl: string;
  squareImg: string;
  slug: string;
  title: string;
  timeRange: string; // e.g., "2–6pm" or "2–5:30pm"
  timeDisplay: string; // e.g., "2:00–6:00 pm" or "2:00–5:30 pm"
}

// Generate slug from event data
const generateSlug = (city: string, startDate: string, title: string): string => {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const isChristmas = title.toLowerCase().includes('christmas');
  
  return isChristmas ? `${citySlug}-christmas-${year}-${month}-${day}` : `${citySlug}-${year}-${month}-${day}`;
};

// Parse venue and city from location string
const parseLocation = (location: string): { venue: string; city: string; postcode: string } => {
  const parts = location.split(', ');
  const venue = parts[0] || location;
  const city = parts[1] || '';
  
  // Sample postcodes - in production, these would come from your data
  const postcodes: Record<string, string> = {
    'Coventry': 'CV1 1GX',
    'Milton Keynes': 'MK9 3PU',
    'Northampton': 'NN1 5BD',
    'Birmingham': 'B1 1AA',
    'Luton': 'LU1 2AA'
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
      const slug = generateSlug(city, event.start, event.title);
      const formattedDate = formatEventDate(event.start);
      
      // Calculate time display strings
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);
      const startHour = startTime.getHours();
      const endHour = endTime.getHours();
      const endMinutes = endTime.getMinutes();
      
      // Format display times
      const timeDisplay = endMinutes === 0 
        ? `${startHour}:00–${endHour}:00 pm`
        : `${startHour}:00–${endHour}:${endMinutes.toString().padStart(2, '0')} pm`;
      
      // Format range for meta descriptions (compact format)
      const timeRange = endMinutes === 0 
        ? `${startHour}–${endHour}pm`
        : `${startHour}–${endHour}:${endMinutes.toString().padStart(2, '0')}pm`;
      
      eventData[slug] = {
        city,
        date: formattedDate,
        venue,
        postcode,
        startIso: event.start,
        endIso: event.end,
        eventbriteUrl: event.bookUrl,
        infoUrl: event.infoUrl,
        squareImg: event.image,
        slug,
        title: event.title,
        timeRange,
        timeDisplay
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
  const [copyText, setCopyText] = useState('');
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!event) return;

    // COPY VARIANTS (REGULAR)
    const REGULAR = [
      `${event.city}, this is the one all your mates can make. On ${event.date}, THE 2PM CLUB™ Daytime Disco takes over ${event.venue} with four hours of anthems from the 80s, 90s and 00s — Spice Girls to Blur, Madonna to Oasis, Beyoncé to The Killers. Every taste covered, nobody left out. By 4pm the singing is louder than the speakers: a gloriously out-of-tune choir of mates and strangers proving the best night out doesn't need midnight. It's the perfect night out, now at 2pm — and it just works.`,
      `${event.city}, your best night out now starts at 2pm. On ${event.date}, THE 2PM CLUB™ Daytime Disco takes over ${event.venue} with four hours of wall-to-wall 80s, 90s and 00s anthems — Spice Girls to Blur, Madonna to Oasis, Beyoncé to The Killers. Every mate gets a moment, every taste is covered. By 4pm the whole place is singing louder than the music — beautifully chaotic and so wrong it's right. The best night out of your life, only smarter — because it's in the afternoon.`,
      `${event.city}, the afternoon belongs to you. On ${event.date}, THE 2PM CLUB™ Daytime Disco takes over ${event.venue} with four hours of iconic 80s, 90s and 00s — Spice Girls, Oasis, Madonna, Blur, Beyoncé, The Killers. From first track to last chorus, every mate is catered for and nobody's left out. By 4pm the music is drowned by a roar of voices — an unstoppable, tuneless choir that makes it clear: this is the night out you've been waiting for. Only difference? It all happens in daylight.`
    ];

    // COPY VARIANTS (CHRISTMAS)
    const CHRISTMAS = [
      `${event.city}, this is the one all your mates can make. On ${event.date}, THE 2PM CLUB™ Christmas Daytime Disco takes over ${event.venue} with four hours of throwback anthems from the 80s, 90s and 00s — Spice Girls, Oasis, Madonna, Blur, Beyoncé, The Killers — mixed with just the right amount of festive sparkle. By mid-afternoon, the whole place is singing louder than the music, a gloriously tuneless Christmas choir proving this is the December party that actually works.`,
      `${event.city}, your best Christmas night out now starts at 2pm. On ${event.date}, THE 2PM CLUB™ Christmas Daytime Disco transforms ${event.venue} into four hours of festive chaos and throwback joy. From confetti and carols to 80s, 90s and 00s anthems, you'll belt it all like you're back in your favourite club — only smarter, because you'll be home in time for mulled wine.`,
      `${event.city}, the afternoon belongs to Christmas. On ${event.date}, THE 2PM CLUB™ Christmas Daytime Disco takes over ${event.venue} with four hours of iconic anthems — Spice Girls, Oasis, Madonna, Blur, Beyoncé, The Killers — wrapped up with the festive hits you can't escape (and don't really want to). Expect Santa hats on the dancefloor, snow-machine selfies, and a crowd singing so loud it drowns the music. The Christmas night out of your life — now at 2pm.`
    ];

    // Check if it's a Christmas event
    const isChristmas = slug?.toLowerCase().includes('christmas') || event.title.toLowerCase().includes('christmas');
    const variants = isChristmas ? CHRISTMAS : REGULAR;
    const selectedCopy = variants[Math.floor(Math.random() * variants.length)];
    
    setCopyText(selectedCopy);

    // Update document title and meta
    document.title = `The 2 PM Club — ${event.city} — ${event.date} | ${event.venue}`;
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.the2pmclub.co.uk/events/${event.slug}/`);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `https://www.the2pmclub.co.uk/events/${event.slug}/`;
      document.head.appendChild(link);
    }

    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": `The 2 PM Club — ${event.city}`,
      "startDate": event.startIso,
      "endDate": event.endIso,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "description": `Daytime disco ${event.timeRange} with iconic anthems from the 80s, 90s and 00s.`,
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
        "url": event.eventbriteUrl,
        "availability": "https://schema.org/InStock"
      }
    };

    // Add or update JSON-LD script
    let script = document.getElementById('event-jsonld') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'event-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    // Add Open Graph and Twitter meta tags
    const updateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property === 'twitter:card') {
          (meta as HTMLMetaElement).setAttribute('property', property);
        } else {
          (meta as HTMLMetaElement).setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      (meta as HTMLMetaElement).setAttribute('content', content);
    };

    // SEO Meta tags
    updateMeta('description', `Daytime disco ${event.timeRange} with 80s/90s/00s anthems. ${event.city}, ${event.date} at ${event.venue}.`);
    
    // Open Graph
    updateMeta('og:type', 'website');
    updateMeta('og:site_name', 'The 2 PM Club');
    updateMeta('og:title', `The 2 PM Club — ${event.city} — ${event.date}`);
    updateMeta('og:description', `Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`);
    updateMeta('og:url', `https://www.the2pmclub.co.uk/events/${event.slug}/`);
    updateMeta('og:image', event.squareImg);
    
    // Twitter
    updateMeta('twitter:card', 'summary');
    updateMeta('twitter:title', `The 2 PM Club — ${event.city} — ${event.date}`);
    updateMeta('twitter:description', `Daytime disco ${event.timeRange} with 80s/90s/00s anthems.`);
    updateMeta('twitter:image', event.squareImg);

  }, [event, slug]);

  const handleShare = (platform: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!event) return;

    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`The 2 PM Club — ${event.city} (${event.date})`);
    
    let url = '';
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${shareText}%20${pageUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${shareText}&body=${shareText}%0A${pageUrl}`;
        break;
      case 'sms':
        url = `sms:?&body=${shareText}%20${pageUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        (e.target as HTMLElement).textContent = 'Copied!';
        setTimeout(() => {
          (e.target as HTMLElement).textContent = 'Copy link';
        }, 2000);
        return;
    }
    
    if (url && platform !== 'email' && platform !== 'sms') {
      window.open(url, '_blank', 'noopener');
    } else if (url) {
      window.location.href = url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black max-w-[72ch] mx-auto p-6">
        <div className="animate-pulse">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white text-black max-w-[72ch] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-4">Sorry, we couldn't find the event you're looking for.</p>
        <a href="/" className="inline-block px-4 py-2 bg-black text-white rounded-lg no-underline">
          ↩ Back to all events
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black max-w-[72ch] mx-auto p-6 leading-relaxed">
      <style dangerouslySetInnerHTML={{
        __html: `
          .btn {
            display: inline-block;
            padding: 12px 16px;
            border-radius: 10px;
            background: #111;
            color: #fff;
            text-decoration: none;
          }
          .btn.secondary {
            background: #f4f4f4;
            color: #111;
          }
          .share-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .share-list a {
            padding: 8px 10px;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            text-decoration: none;
            color: #111;
            cursor: pointer;
          }
          .small {
            color: #444;
            font-size: 0.94rem;
          }
          .ticket-block {
            padding: 16px;
            border: 1px solid #eaeaea;
            border-radius: 14px;
            margin: 18px 0;
            display: grid;
            gap: 12px;
          }
        `
      }} />
      
      <h1 className="text-2xl font-bold leading-tight mb-2">
        The 2 PM Club — {event.city} ({event.date})
      </h1>
      
      <p className="small mb-1">
        <strong>When:</strong> {event.timeDisplay}
      </p>
      <p className="small mb-4">
        <strong>Where:</strong> {event.venue}, {event.city} {event.postcode}
      </p>

      <div className="mb-4">
        <p>{copyText}</p>
      </div>

      <img 
        src={event.squareImg} 
        alt={`The 2 PM Club — ${event.city} event image`}
        className="w-full h-auto rounded-xl mb-6"
      />

      <section className="ticket-block" aria-label="Tickets and sharing">
        <div className="flex gap-3">
          <a 
            className="btn" 
            href={event.eventbriteUrl} 
            target="_blank"
            rel="noopener nofollow"
          >
            🎟️ Book tickets
          </a>
          {event.infoUrl && (
            <a 
              className="btn secondary" 
              href={event.infoUrl}
              target="_blank"
              rel="noopener"
            >
              ℹ️ Event info
            </a>
          )}
        </div>
        
        <div className="share-list" aria-label="Share this event">
          <a onClick={(e) => handleShare('whatsapp', e)}>WhatsApp</a>
          <a onClick={(e) => handleShare('facebook', e)}>Facebook</a>
          <a onClick={(e) => handleShare('twitter', e)}>X / Twitter</a>
          <a onClick={(e) => handleShare('email', e)}>Email</a>
          <a onClick={(e) => handleShare('sms', e)}>SMS</a>
          <a onClick={(e) => handleShare('copy', e)}>Copy link</a>
        </div>
      </section>

      <section id="info">
        <h2 className="text-xl font-bold mb-3">Good to know</h2>
        <ul className="mb-4 pl-5">
          <li>Four hours of 80s, 90s and 00s anthems.</li>
          <li>Proper "night out" atmosphere — in the afternoon.</li>
          <li>18+ recommended unless stated otherwise.</li>
        </ul>
        <p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ↩ Back to all events
          </a>
        </p>
      </section>
    </div>
  );
};

export default EventPage;