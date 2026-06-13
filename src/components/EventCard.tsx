import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { trackEventPageView } from "@/lib/dataLayer";

// Bunny Optimizer params for CDN-hosted images (shared with EventPageV2)
export const optimised = (url: string, width: number) =>
  url.includes("b-cdn.net") ? `${url}${url.includes("?") ? "&" : "?"}width=${width}&quality=75` : url;

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
  groupTicket?: { size: number; price: number; label: string };
}

const EventCard = ({ slug, eventType, eventbriteId, title, date, venue, city, poster, dateIso, start, soldOut, urgencyText, priceLabel, groupTicket }: EventCardProps) => {
  const navigate = useNavigate();
  const displayPrice = priceLabel?.replace(/\.00\b/g, "");

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

  const handleCardClick = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLElement;
    const source = target.closest("[data-card-cta]") ? "event_card_button" : "event_card_image";
    goToEventPage(source);
  };

  return (
    <article
      className="min-w-0"
      data-ticket-card 
      data-date-iso={dateIso} 
      data-event-slug={slug}
    >
      <button
        type="button"
        onClick={handleCardClick}
        className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-border bg-card p-0 text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${title}, ${date}, ${venue}, ${city}${soldOut ? ", sold out, join the waiting list" : ""}`}
        data-event-slug={slug}
        data-click-source="event-card"
      >
        <img 
          src={optimised(poster, 800)}
          srcSet={`${optimised(poster, 400)} 400w, ${optimised(poster, 800)} 800w`}
          sizes="(max-width: 768px) 50vw, 33vw"
          alt={`${title} event poster`}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${soldOut ? "grayscale" : ""}`}
          loading="lazy"
          decoding="async"
          width="800"
          height="800"
        />

        <h3 className="sr-only">{title}</h3>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-1.5 p-2">
        {urgencyText && (
            <span className={`min-w-0 max-w-[68%] rounded-full px-2.5 py-1 text-[9px] font-bold leading-tight shadow-md sm:text-xs ${soldOut ? "bg-red-600 text-white" : "bg-primary text-primary-foreground"}`}>
              {urgencyText}
            </span>
          )}
          {displayPrice && !soldOut && (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-1 text-[9px] font-semibold leading-tight text-white shadow-md backdrop-blur-sm sm:text-xs">
              {displayPrice}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex h-[38%] min-h-[92px] flex-col justify-end bg-gradient-to-t from-black/95 via-black/65 to-transparent px-3 pb-2.5 sm:px-4 sm:pb-3">
          <p className="font-poppins text-xs font-semibold leading-tight text-white sm:text-sm">
            {date} · {city}
          </p>
          {!soldOut && groupTicket?.label && (
            <p className="mt-0.5 font-poppins text-[10px] leading-tight text-white/80 sm:text-xs">
              {groupTicket.label}
            </p>
          )}
          <p data-card-cta className="mt-1 font-poppins text-xs font-bold leading-tight text-white/80 transition-colors group-hover:text-white group-active:text-white sm:text-sm">
            {soldOut ? "Join the waiting list" : "Book tickets ->"}
          </p>
        </div>
      </button>
    </article>
  );
};

export default EventCard;
