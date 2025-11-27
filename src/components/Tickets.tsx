import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import EventCard from "./EventCard";
import EventbriteModal from "./EventbriteModal";

const Tickets = () => {
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "view_tickets_list" });
  }, []);

  // Helper function to convert date string to ISO format
  const dateToIso = (dateStr: string): string => {
    const monthMap: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = dateStr.split(' '); // ["Sat", "13", "Sep", "2025"]
    const day = parts[1].padStart(2, '0');
    const month = monthMap[parts[2]];
    const year = parts[3];
    return `${year}-${month}-${day}`;
  };

const events = [
  {
    eventCode: "061225-2PM-NPTON",
    eventbriteId: "1544458540069",
    title: "THE 2PM CLUB Northampton - Christmas Daytime Disco",
    date: "Sat 6 Dec 2025",
    venue: "The Picturedrome",
    city: "Northampton",
    time: "14:00–17:30",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1757522817/061225_2PM_NPTON_ANNSQ_pcnhtp.png",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2-pm-clubtm-northampton-christmas-daytime-disco-tickets-1544458540069?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/928404249476093",
    urgencyText: "SOLD OUT",
    soldOut: true
  },
  {
    eventCode: "131225-2PM-MK",
    eventbriteId: "1757042494399",
    title: "THE 2PM CLUB Milton Keynes - Christmas Daytime Disco",
    date: "Sat 13 Dec 2025",
    venue: "MK11 Music Venue",
    city: "Milton Keynes",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1759239645/131225_2PM_MK_ANNSQ_vpluvo.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2-pm-club-milton-keynes-christmas-daytime-disco-tickets-1757042494399?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/1263771188835863",
    urgencyText: "SELLING FAST"
  },
  {
    eventCode: "201225-2PM-BED",
    eventbriteId: "1758345602029",
    title: "THE 2PM CLUB Bedford - Christmas Daytime Disco",
    date: "Sat 20 Dec 2025",
    venue: "Bedford Esquires",
    city: "Bedford",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1759604893/201225_2PM_BED_ANNSQ_mfxfvg.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-club-bedford-christmas-daytime-disco-tickets-1758345602029?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/1927014331198078",
    urgencyText: "SELLING FAST"
  },
  {
    eventCode: "070226-2PM-LUT",
    eventbriteId: "1645025849599",
    title: "THE 2PM CLUB LUTON - 80s 90s 00s Daytime Disco",
    date: "Sat 7 Feb 2026",
    venue: "Hat Factory",
    city: "Luton",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1764253430/070226_2PM_LUT_ANNSQ_deq25f.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-clubtm-luton-80s-90s-00s-daytime-disco-tickets-1645025849599?aff=BOOMWEB",
    infoUrl: "https://www.facebook.com/events/1277593650522747",
    urgencyText: "NEW DATE",
    urgencyColor: "green"
  },
  {
    eventCode: "140226-2PM-BED",
    eventbriteId: "1975982183904",
    title: "THE 2PM CLUB BEDFORD - 80s 90s 00s Daytime Disco",
    date: "Sat 14 Feb 2026",
    venue: "Bedford Esquires",
    city: "Bedford",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1764253451/140226_2PM_BED_ANNSQ_cxagdp.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-club-bedford-daytime-disco-tickets-1975982183904?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/TBD",
    urgencyText: "JUST ANNOUNCED",
    urgencyColor: "green"
  },
  {
    eventCode: "140226-2PM-MK",
    eventbriteId: "1975983454705",
    title: "THE 2PM CLUB MILTON KEYNES - 80s 90s 00s Daytime Disco",
    date: "Sat 14 Feb 2026",
    venue: "MK11 Music Venue",
    city: "Milton Keynes",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1764253462/140226_2PM_MK_ANNSQ_xspc64.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-club-milton-keynes-daytime-disco-tickets-1975983454705?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/TBD",
    urgencyText: "JUST ANNOUNCED",
    urgencyColor: "green"
  },
  {
    eventCode: "280226-2PM-NPTON",
    eventbriteId: "1975984047478",
    title: "THE 2PM CLUB NORTHAMPTON - 80s 90s 00s Daytime Disco",
    date: "Sat 28 Feb 2026",
    venue: "The Picturedrome",
    city: "Northampton",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1764253472/280226_2PM_NPTON_ANNSQ_kvwa0w.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-club-northampton-daytime-disco-tickets-1975984047478?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/TBD",
    urgencyText: "JUST ANNOUNCED",
    urgencyColor: "green"
  },
  {
    eventCode: "070326-2PM-COV",
    eventbriteId: "1975984192913",
    title: "THE 2PM CLUB COVENTRY - 80s 90s 00s Daytime Disco",
    date: "Sat 7 Mar 2026",
    venue: "hmv Empire",
    city: "Coventry",
    time: "14:00–18:00",
    poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v1764253438/070326_2PM_COV_ANNSQ_ykhbc0.jpg",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-club-coventry-daytime-disco-tickets-1975984192913?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/TBD",
    urgencyText: "JUST ANNOUNCED",
    urgencyColor: "green"
  }
];

  return (
    <section id="tickets" className="py-lg bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-lg">
          <h2 className="font-poppins text-5xl md:text-6xl font-bold text-primary mb-4">
            Book early — it sells out
          </h2>
          <p className="font-poppins text-lg text-white max-w-3xl mx-auto leading-relaxed">
            Tickets usually start from £10–£15 + fees. Most dates sell out weeks ahead, 
            because people know what they're getting: the Midlands' best daytime party. 
            Group of 4 offers are available at many shows — perfect for sorting the chat. 
            On the door? Only if it hasn't sold out (and it usually has).
          </p>
        </div>

        {/* Christmas Banner */}
        <div 
          className="bg-gradient-to-r from-red-600/20 to-green-600/20 border border-red-600/30 rounded-lg p-4 mb-8 text-center hidden" 
          data-banner="christmas"
        >
          <p className="font-poppins text-lg font-semibold text-foreground">
            🎄 Christmas dates now on sale
          </p>
        </div>
        
        <div className="space-y-6" id="tickets-list">
          {events.map((event, index) => {
            const modalTriggerId = `eb-modal-trigger-${event.eventCode}`;
            return (
              <div key={index}>
                <EventbriteModal 
                  eventbriteId={event.eventbriteId}
                  triggerId={modalTriggerId}
                />
                <EventCard 
                  {...event} 
                  dateIso={dateToIso(event.date)} 
                />
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-lg">
          <Button 
            id="view-all-tickets"
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
          >
            View All Tickets
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Tickets;