import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEventPageView } from "@/lib/dataLayer";

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
  priceLabel?: string;
  tierLabels?: string[];
}

const EventCard = ({ id, slug, eventType, cityCode, eventbriteId, title, date, venue, city, time, poster, bookUrl, infoUrl, dateIso, start, soldOut, urgencyText, urgencyColor, priceLabel, tierLabels }: EventCardProps) => {
  const navigate = useNavigate();

  const goToEventPage = (source: string) => {
    // Card clicks are interest, not checkout intent: fire ViewContent only.
    // InitiateCheckout now fires when the Eventbrite widget loads on the event page.
    trackEventPageView(slug, title, {
      eventbriteId,
      city,
      venue,
      date,
      startIso: start,
      eventType,
      source,
    });

    navigate(`/events/${slug}/`);
  };

  const handleBookNow = () => goToEventPage('event_card_button');

  const handleImageClick = () => goToEventPage('event_card_image');


  return (
    <article
      className="ticket-card bg-card/80 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_hsl(328_100%_54%_/_0.15)] transition-all duration-300"
      data-ticket-card 
      data-date-iso={dateIso} 
      data-event-slug={slug}
    >
      <button
        type="button"
        onClick={handleImageClick}
        className="poster relative block w-full p-0 border-0 bg-transparent cursor-pointer text-left overflow-hidden"
        aria-label={`View tickets for ${title}`}
        data-event-slug={slug}
        data-click-source="event-card-image"
      >
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
      </button>

      <div className="meta">
        {urgencyText && (
          <div className={`urgency-strip ${
            urgencyColor === 'green' ? 'urgency-strip-green' :
            urgencyColor === 'amber' ? 'urgency-strip-amber' : ''
          }`}>
            <span>{urgencyText}</span>
          </div>
        )}
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
          {priceLabel && (
            <div className="flex items-center text-foreground">
              <Ticket className="w-4 h-4 mr-2 text-primary" />
              <span className="font-poppins font-semibold">{priceLabel}</span>
            </div>
          )}
          {tierLabels && tierLabels.length > 0 && (
            <p className="font-poppins text-sm text-muted-foreground pt-1">
              {tierLabels.join(" · ")}
            </p>
          )}
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
