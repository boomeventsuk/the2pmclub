import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Calendar, MapPin, Clock, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventCardProps {
  id?: number;
  eventCode: string;
  eventbriteId: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  time: string;
  poster: string;
  bookUrl: string;
  infoUrl?: string;
  dateIso: string;
  start?: string;
  soldOut?: boolean;
  urgencyText?: string;
  urgencyColor?: string;
}

const EventCard = ({ id, eventCode, eventbriteId, title, date, venue, city, time, poster, bookUrl, infoUrl, dateIso, start, soldOut, urgencyText, urgencyColor }: EventCardProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const modalTriggerId = `eb-modal-trigger-${eventCode}`;

  const handleBookNow = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'ticket_click',
      eventId: eventCode,
      eventName: title,
      eventVenue: `${venue}, ${city}`,
      eventStart: start || ''
    });
    
    // Trigger Eventbrite modal
    const triggerBtn = document.getElementById(modalTriggerId);
    if (triggerBtn) {
      triggerBtn.click();
    }
  };

  const handleEventInfo = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'view_event',
      eventId: eventCode,
      eventName: title
    });
    
    // Navigate to internal event page
    window.location.href = `/events/${eventCode}`;
  };

  // Sharing functions
  const buildUtmUrl = (baseUrl: string, source: string) => {
    if (!baseUrl) return '';
    const sep = baseUrl.includes('?') ? '&' : '?';
    return baseUrl + sep
      + 'utm_source=' + encodeURIComponent(source)
      + '&utm_medium=share_button'
      + '&utm_campaign=event_share';
  };

  const handleWhatsAppShare = () => {
    const eventPageUrl = `https://www.the2pmclub.co.uk/events/${eventCode}/`;
    const utmUrl = buildUtmUrl(eventPageUrl, 'whatsapp');
    const text = `This event looks great - who's in? ✨\n${title} • ${date} • ${time}\nTickets: ${utmUrl}`;
    const wa = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(wa, '_blank');
    
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'whatsapp_share',
      eventId: eventCode,
      eventName: title
    });
  };

  const handleFacebookShare = () => {
    const eventPageUrl = `https://www.the2pmclub.co.uk/events/${eventCode}/`;
    const utmUrl = buildUtmUrl(eventPageUrl, isMobile ? 'messenger' : 'facebook');
    
    if (isMobile) {
      // Open Messenger app directly
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(utmUrl)}`;
    } else {
      // Open Facebook share dialog
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utmUrl)}`, '_blank', 'noopener');
    }
    
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: isMobile ? 'messenger_share' : 'facebook_share',
      eventId: eventCode,
      eventName: title
    });
  };

  return (
    <>
      {/* Hidden trigger button for Eventbrite modal */}
      <button id={modalTriggerId} style={{ display: 'none' }} />
      
      <article className="ticket-card" data-ticket-card data-date-iso={dateIso}>
        <div className="poster relative">
        <img 
          src={poster}
          alt={`${title} event poster`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="800"
          height="1200"
          style={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
        />
        {urgencyText && (
          <div className={`urgency-strip ${urgencyColor === 'green' ? 'urgency-strip-green' : ''}`}>
            <span>{urgencyText}</span>
          </div>
        )}
      </div>
      
      <div className="meta">
        <h3 className="font-poppins text-2xl font-bold text-foreground mb-3 leading-tight">
          {soldOut && <span className="text-destructive font-bold">Sold Out - </span>}
          {title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span className="font-poppins">{date}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span className="font-poppins">{venue}, {city}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span className="font-poppins">{time}</span>
          </div>
        </div>
      </div>
      
      <div className="actions">
        <Button 
          onClick={handleBookNow}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 btn"
        >
          <ExternalLink className="w-4 h-4" />
          {soldOut ? 'Waiting List' : 'Book Now'}
        </Button>
        {infoUrl && (
          <Button 
            onClick={handleEventInfo}
            variant="outline"
            className="bg-white text-primary border-white hover:bg-white/90 flex items-center justify-center gap-2 btn"
          >
            <ExternalLink className="w-4 h-4" />
            Event Info
          </Button>
        )}
        <span className="status" data-status></span>
        
        <p className="font-poppins text-white text-sm text-left">Share This Event</p>
        
        {/* Share icons row */}
        <div className="share-icons" role="group" aria-label="Share event">
          <button 
            className="icon-btn icon-whatsapp" 
            onClick={handleWhatsAppShare}
            title="Share with friends on WhatsApp" 
            aria-label="Share with friends on WhatsApp" 
            type="button"
          >
            <img src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519736/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png" alt="Share on WhatsApp" width="22" height="22" loading="lazy" decoding="async" />
          </button>

          <button 
            className="icon-btn icon-facebook" 
            onClick={handleFacebookShare}
            title={isMobile ? "Share on Messenger" : "Share on Facebook"}
            aria-label={isMobile ? "Share on Messenger" : "Share on Facebook"}
            type="button"
          >
            {isMobile ? (
              // Messenger icon
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true" focusable="false">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.05 1.9c.02.52.49.88.98.76l2.12-.53c.19-.05.39-.02.56.05 1.01.35 2.12.54 3.29.54 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.02L10.5 12.3l-4.28 2.8 4.7-5.02 2.62 2.72 4.2-2.8-4.7 5.02z"/>
              </svg>
            ) : (
              // Facebook icon
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="28" height="28">
                <path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.5v-3h2V9.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      </article>
    </>
  );
};

export default EventCard;