import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import EventCard from "./EventCard";

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
    title: "THE 2PM CLUB™ COVENTRY - 80s 90s 00s Daytime Disco",
    date: "Sat 4 Oct 2025",
    venue: "hmv Empire",
    city: "Coventry",
    time: "14:00–18:00",
    poster: "/lovable-uploads/403f8f88-dc3f-4950-867a-99ab147c40ee.png",
    bookUrl: "https://www.eventbrite.co.uk/e/daytime-disco-presents-the-2pm-club-coventry-80s-90s-00s-anthems-tickets-1443614914069?aff=BOOMWEB",
    infoUrl: ""
  },
  {
    title: "THE 2PM CLUB™ MK - 80s 90s 00s Daytime Disco",
    date: "Sat 11 Oct 2025",
    venue: "MK11 Music Venue",
    city: "Milton Keynes",
    time: "14:00–16:00",
    poster: "/lovable-uploads/c12630b8-2043-47ca-aaa1-23d7480e9096.png",
    bookUrl: "https://www.eventbrite.co.uk/e/daytime-disco-presents-the-2pm-clubtm-milton-keynes-80s-90s-00s-anthems-tickets-1403881610689",
    infoUrl: "https://www.facebook.com/events/710462968194939"
  },
  {
    title: "THE 2PM CLUB™ NORTHAMPTON - 80s 90s 00s Daytime Disco",
    date: "Sat 18 Oct 2025",
    venue: "cinch Stadium at Franklin's Gardens",
    city: "Northampton",
    time: "14:00–18:00",
    poster: "/lovable-uploads/cad5cf88-2d0c-4843-b872-e2f6b932bcba.png",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-clubtm-northampton-80s-90s-00s-daytime-disco-tickets-1557588823099?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/1099596238372820"
  },
  {
    title: "THE 2PM CLUB™ BIRMINGHAM - 80s 90s 00s Daytime Disco",
    date: "Sat 25 Oct 2025",
    venue: "The Castle & Falcon",
    city: "Birmingham",
    time: "14:00–18:00",
    poster: "/lovable-uploads/d2abf972-b1eb-4f69-bdd9-65e845683772.png",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-clubtm-birmingham-80s-90s-00s-daytime-disco-tickets-1559435135469?aff=BOOMWEB",
    infoUrl: "https://www.facebook.com/events/1252072186162573"
  },
  {
    title: "THE 2PM CLUB™ LUTON - 80s 90s 00s Daytime Disco",
    date: "Sat 1 Nov 2025",
    venue: "Hat Factory",
    city: "Luton",
    time: "14:00–18:00",
    poster: "/lovable-uploads/b5e9b224-0e38-4b36-957b-56d1d1b23a7b.png",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2pm-clubtm-luton-80s-90s-00s-daytime-disco-tickets-1645025849599?aff=BOOMWEB",
    infoUrl: "https://www.facebook.com/events/1277593650522747"
  },
  {
    title: "THE 2PM CLUB™ Northampton - Christmas Daytime Disco",
    date: "Sat 6 Dec 2025",
    venue: "The Picturedrome",
    city: "Northampton",
    time: "14:00–17:30",
    poster: "/lovable-uploads/af4aa581-f143-4788-8e18-bb07123f3146.png",
    bookUrl: "https://www.eventbrite.co.uk/e/the-2-pm-clubtm-northampton-christmas-daytime-disco-tickets-1544458540069?aff=BoomWeb",
    infoUrl: "https://www.facebook.com/events/928404249476093"
  }
];

  return (
    <section id="tickets" className="py-lg bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-lg">
          <h2 className="font-bebas text-5xl md:text-6xl font-bold text-primary mb-4">
            Upcoming Parties
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Book your tickets now for the next epic party experience across the Midlands
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
          {events.map((event, index) => (
            <EventCard key={index} {...event} dateIso={dateToIso(event.date)} />
          ))}
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