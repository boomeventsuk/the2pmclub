import { useEffect } from "react";

export default function SiteFaqs() {
  useEffect(() => {
    document.title = "THE 2PM CLUB — FAQs";
    let c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!c) { c = document.createElement('link'); c.setAttribute('rel', 'canonical'); document.head.appendChild(c); }
    c.setAttribute('href', 'https://www.the2pmclub.co.uk/faqs/');

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "faq-global";
    ld.text = JSON.stringify({
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"What time do events run?","acceptedAnswer":{"@type":"Answer","text":"Most events run 14:00–18:00. If a different finish time applies, it is shown on the event page."}},
        {"@type":"Question","name":"Who are the events for?","acceptedAnswer":{"@type":"Answer","text":"Adults. Age guidance is 18+ recommended unless stated otherwise on the event page."}},
        {"@type":"Question","name":"What's the dress code?","acceptedAnswer":{"@type":"Answer","text":"Smart-casual; comfortable footwear encouraged."}},
        {"@type":"Question","name":"How much are tickets?","acceptedAnswer":{"@type":"Answer","text":"Tickets usually start from £10. Typical range £10–£15, with Eventbrite fees added at checkout."}},
        {"@type":"Question","name":"Are tickets refundable or transferable?","acceptedAnswer":{"@type":"Answer","text":"Tickets are non-refundable unless an event is cancelled. See the Eventbrite listing for transfer options."}},
        {"@type":"Question","name":"Can I buy tickets on the door?","acceptedAnswer":{"@type":"Answer","text":"If not sold out, a limited number may be available on the door. Card or cash accepted."}},
        {"@type":"Question","name":"Do doors open before start time?","acceptedAnswer":{"@type":"Answer","text":"For The 2 PM Club, doors open at the stated start time. The show runs straight through with no scheduled breaks."}},
        {"@type":"Question","name":"Is there a last entry time or curfew?","acceptedAnswer":{"@type":"Answer","text":"No published last entry. Curfew is not advertised; see the event's finish time."}},
        {"@type":"Question","name":"Is the event accessible?","acceptedAnswer":{"@type":"Answer","text":"Accessibility varies by venue. Limited seating areas are available—speak to the venue or our team on arrival. Many venues have accessible toilets; check your city's venue info."}},
        {"@type":"Question","name":"Do you use special effects?","acceptedAnswer":{"@type":"Answer","text":"Flashing lights are used; no strobe. Confetti appears at many events."}},
        {"@type":"Question","name":"What's the ID and bag policy?","acceptedAnswer":{"@type":"Answer","text":"Challenge 25 is in operation. Small bags only; all bags may be searched. Backpacks are discouraged."}},
        {"@type":"Question","name":"Is there a bar or food?","acceptedAnswer":{"@type":"Answer","text":"Bars are available at all events. Some venues offer food; free tap water is available at the bar."}},
        {"@type":"Question","name":"Can I leave and re-enter?","acceptedAnswer":{"@type":"Answer","text":"Re-entry is at staff discretion."}},
        {"@type":"Question","name":"Will photos or video be taken?","acceptedAnswer":{"@type":"Answer","text":"Official photo and video capture highlight moments. If you prefer not to be photographed, speak to the photographer or a team member on the day."}},
        {"@type":"Question","name":"Lost property","acceptedAnswer":{"@type":"Answer","text":"Contact the venue directly for lost property after the event."}},
        {"@type":"Question","name":"How do I contact the organisers?","acceptedAnswer":{"@type":"Answer","text":"Email hello@boomevents.co.uk. We aim to reply within 48 hours, Monday to Friday."}}
      ]
    });
    document.head.appendChild(ld);
    return () => { document.getElementById("faq-global")?.remove(); };
  }, []);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">FAQs</h1>
      <p className="text-muted-foreground">Answers to common questions about timings, tickets and accessibility.</p>
    </main>
  );
}