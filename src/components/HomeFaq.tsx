export default function HomeFaq() {
  const faqs = [
    {q: "What time is it?", a: "Most events run 14:00–18:00. If different, the finish time is shown on your event page."},
    {q: "Who is it for?", a: "Adults. Age guidance is 18+ recommended unless stated otherwise."},
    {q: "What music do you play?", a: "80s, 90s and 00s sing-along anthems—dancefloor classics only."},
    {q: "How much are tickets?", a: "Usually from £10 (typical £10–£15) plus Eventbrite fees."},
    {q: "Refunds & transfers?", a: "Tickets are non-refundable unless an event is cancelled. Transfer options are on Eventbrite."},
    {q: "Can I buy on the door?", a: "If not sold out, a limited number may be available. Card or cash accepted."},
    {q: "Is it accessible?", a: "Accessibility varies by venue. Limited seating areas—ask the team on arrival."}
  ];
  return (
    <section aria-labelledby="home-faq-title" className="mx-auto max-w-4xl px-4 py-12">
      <h2 id="home-faq-title" className="text-2xl font-semibold mb-4">Questions people ask before they book</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((f, i) => (
          <details key={i} className="rounded-2xl border p-4">
            <summary className="font-medium cursor-pointer">{f.q}</summary>
            <div className="mt-2 text-muted-foreground">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}