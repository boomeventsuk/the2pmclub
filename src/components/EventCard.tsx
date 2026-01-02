import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  id?: number;
  slug: string;
  eventType?: string;
  cityCode?: string;
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

const EventCard = ({ id, slug, eventType, cityCode, eventbriteId, title, date, venue, city, time, poster, bookUrl, infoUrl, dateIso, start, soldOut, urgencyText, urgencyColor }: EventCardProps) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'home_eventcard_click',
      event_slug: slug,
      event_type: '2PM',
      event_title: title
    });
    
    // Navigate to event page
    navigate(`/events/${slug}/`);
  };


  return (
    <article 
      className="ticket-card bg-card/80 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_hsl(328_100%_54%_/_0.15)] transition-all duration-300" 
      data-ticket-card 
      data-date-iso={dateIso} 
      data-event-slug={slug}
    >
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 btn shadow-[0_0_20px_hsl(328_100%_54%_/_0.3)] hover:shadow-[0_0_25px_hsl(328_100%_54%_/_0.4)]"
          data-event-slug={slug}
        >
          {soldOut ? 'Waiting List' : 'Book Now'}
        </Button>
      </div>
    </article>
  );
};

export default EventCard;