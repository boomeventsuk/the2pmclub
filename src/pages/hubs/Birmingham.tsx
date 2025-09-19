import { useEffect } from "react";

export default function BirminghamHub() {
  useEffect(() => {
    document.title = "The 2 PM Club — Birmingham Hub | Event Info & FAQs";
    let c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!c) { c = document.createElement('link'); c.setAttribute('rel', 'canonical'); document.head.appendChild(c); }
    c.setAttribute('href', 'https://www.the2pmclub.co.uk/hubs/birmingham/');

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "faq-birmingham";
    ld.text = JSON.stringify({
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"Where is it held in Birmingham?","acceptedAnswer":{"@type":"Answer","text":"The Castle & Falcon, 402 Moseley Road, Birmingham B12 9AT."}},
        {"@type":"Question","name":"What time does it run?","acceptedAnswer":{"@type":"Answer","text":"Typically 14:00–18:00. If a different finish time applies, it is shown on the event page."}},
        {"@type":"Question","name":"How do I get there by train?","acceptedAnswer":{"@type":"Answer","text":"Birmingham New Street is the nearest major station. From there it's a short taxi or bus ride."}},
        {"@type":"Question","name":"Is there parking?","acceptedAnswer":{"@type":"Answer","text":"There isn't official venue parking guidance. Please use nearby public car parks and check local restrictions before travel."}},
        {"@type":"Question","name":"Is it accessible?","acceptedAnswer":{"@type":"Answer","text":"The venue states it is accessible and includes accessible toilets. If you need seating or step-free advice, speak to the team on arrival."}},
        {"@type":"Question","name":"Is there a bar or food?","acceptedAnswer":{"@type":"Answer","text":"Bar service is available. Some venues on the tour offer food; availability can vary by date."}},
        {"@type":"Question","name":"What should I bring?","acceptedAnswer":{"@type":"Answer","text":"Valid photo ID if you look under 25 (Challenge 25). Small bags only; searches may take place. Backpacks are discouraged."}}
      ]
    });
    document.head.appendChild(ld);
    return () => { document.getElementById("faq-birmingham")?.remove(); };
  }, []);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Birmingham Event Hub</h1>
      <p className="text-muted-foreground mb-6">
        Everything you need for The 2 PM Club in Birmingham: quick answers, travel notes and practical info.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick facts</h2>
        <ul className="list-disc pl-6">
          <li><strong>Venue:</strong> The Castle &amp; Falcon, 402 Moseley Road, Birmingham B12 9AT</li>
          <li><strong>Typical hours:</strong> 14:00–18:00 (check your ticket for the confirmed finish)</li>
          <li><strong>Nearest station:</strong> Birmingham New Street (short taxi/bus)</li>
          <li><strong>Dress code:</strong> Smart-casual; comfortable footwear encouraged</li>
          <li><strong>Age guidance:</strong> 18+ recommended unless stated</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
        <div className="space-y-4">
          <details><summary>Where is it held in Birmingham?</summary><div className="mt-2">The Castle &amp; Falcon, 402 Moseley Road, Birmingham B12 9AT.</div></details>
          <details><summary>What time does it run?</summary><div className="mt-2">Typically 14:00–18:00. If a different finish time applies, it's shown on the event page.</div></details>
          <details><summary>How do I get there by train?</summary><div className="mt-2">Birmingham New Street is the nearest major station; short taxi or bus ride.</div></details>
          <details><summary>Is there parking?</summary><div className="mt-2">No official venue guidance. Use nearby public car parks; check local restrictions.</div></details>
          <details><summary>Is it accessible?</summary><div className="mt-2">Accessible with accessible toilets; ask for seating assistance on arrival if needed.</div></details>
          <details><summary>Is there a bar or food?</summary><div className="mt-2">Bar available. Some venues offer food; availability varies by date.</div></details>
          <details><summary>What should I bring?</summary><div className="mt-2">Valid photo ID (Challenge 25). Small bags only; searches may take place. Backpacks discouraged.</div></details>
        </div>
      </section>
    </main>
  );
}