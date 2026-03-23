import type { Context } from "https://edge.netlify.com";

/**
 * homepage-inject.ts
 *
 * Netlify Edge Function that enriches the homepage HTML with content
 * that AI crawlers can read without executing JavaScript.
 *
 * What it does:
 * 1. Reads /events.json for live event data (including Eventbrite prices)
 * 2. Injects Event JSON-LD schema for ALL upcoming events
 * 3. Injects Review + AggregateRating schema
 * 4. Injects a <noscript> block with the full page content as plain HTML
 *    (FAQ, testimonials, "why it works", events list)
 *
 * AI crawlers (ChatGPT, Perplexity, ClaudeBot, Google) get the full
 * content in raw HTML. Real users with JS see the React app as normal.
 */

interface EventData {
  id: number;
  slug: string;
  eventbriteId: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  description: string;
  fullDescription: string;
  image: string;
  price?: number;
  priceCurrency?: string;
  priceLabel?: string;
  availability?: string;
  ticketsRemaining?: number;
  tiers?: Array<{
    name: string;
    price: number;
    status: string;
    remaining: number;
  }>;
  venueAddress?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
}

function buildEventSchema(events: EventData[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.start.slice(0, 10) >= now);

  if (upcoming.length === 0) return "";

  const eventSchemas = upcoming.map(event => {
    const schema: Record<string, unknown> = {
      "@type": "Event",
      name: event.title,
      startDate: event.start,
      endDate: event.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.location.split(",")[0].trim(),
        address: event.venueAddress
          ? {
              "@type": "PostalAddress",
              streetAddress: event.venueAddress.streetAddress,
              addressLocality: event.venueAddress.addressLocality,
              postalCode: event.venueAddress.postalCode,
              addressCountry: event.venueAddress.addressCountry,
            }
          : {
              "@type": "PostalAddress",
              addressLocality: event.location.split(",").pop()?.trim() || "",
              addressCountry: "GB",
            },
      },
      image: [event.image],
      description: event.fullDescription || event.description,
      organizer: {
        "@type": "Organization",
        name: "Boombastic Events",
        url: "https://www.boomevents.co.uk",
      },
    };

    // Add price data if available
    if (event.price && event.priceCurrency) {
      schema.offers = {
        "@type": "Offer",
        url: event.bookUrl,
        price: event.price.toFixed(2),
        priceCurrency: event.priceCurrency,
        availability: event.availability || "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
      };
    } else {
      schema.offers = {
        "@type": "Offer",
        url: event.bookUrl,
      };
    }

    return schema;
  });

  return JSON.stringify(
    { "@context": "https://schema.org", "@graph": eventSchemas },
    null,
    2
  );
}

function buildReviewSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "THE 2PM CLUB",
    url: "https://www.the2pmclub.co.uk/",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "250",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Josie L" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Brilliant music, not just clubbing anthems the whole time (just the right mix) loved the big singalong moments",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Marie T" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Finally able to get all my friends together, when's the next one?",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Tracey M" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Don't think I've danced and laughed so much in a long time. Thank you!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah K" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Best afternoon ever. Home by 7, in bed by 10, felt amazing Sunday morning. This is how going out should be.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Claire W" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "The confetti cannons, the singalongs, the energy in the room. Haven't felt that alive in years.",
      },
    ],
  });
}

function buildNoscriptContent(events: EventData[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.start.slice(0, 10) >= now);

  // Format events as an HTML list
  const eventRows = upcoming
    .map(e => {
      const date = new Date(e.start).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const price = e.priceLabel || "";
      return `<li><strong>${e.title}</strong> - ${date} at ${e.location}. ${price}. <a href="${e.bookUrl}">Book tickets</a></li>`;
    })
    .join("\n        ");

  return `
  <noscript>
    <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif;color:#fff;background:#0B0B0F;">
      <h1>THE 2PM CLUB - Daytime Disco</h1>
      <p>Your best night out, right in the middle of the afternoon. THE 2PM CLUB is the Midlands' original daytime disco by Boombastic Events. 4 hours of 80s, 90s and 00s anthems every Saturday afternoon, 2pm to 6pm. Home by 7-ish.</p>

      <h2>Upcoming Events</h2>
      <ul>
        ${eventRows}
      </ul>

      <h2>Why It Works at 2PM</h2>
      <ul>
        <li><strong>Home by 7-ish</strong> - Dance your heart out, still catch Strictly.</li>
        <li><strong>The Group Chat Finally Agrees</strong> - No babysitter battles. No "I'm too tired" texts. Just a date everyone can actually make.</li>
        <li><strong>Every Song a Banger</strong> - 80s, 90s and 00s anthems. You'll know every single word.</li>
        <li><strong>Wake Up Fresh (And Smug)</strong> - All the joy of a big night out. None of the next-day fear. You've won at the weekend.</li>
      </ul>

      <h2>What People Say</h2>
      <blockquote>"Brilliant music, not just clubbing anthems the whole time (just the right mix) loved the big singalong moments" - Josie L, Northampton</blockquote>
      <blockquote>"Finally able to get all my friends together, when's the next one?" - Marie T, Coventry</blockquote>
      <blockquote>"Don't think I've danced and laughed so much in a long time. Thank you!" - Tracey M, Bedford</blockquote>

      <h2>Frequently Asked Questions</h2>
      <dl>
        <dt>Is it really like a night out clubbing in the afternoon?</dt>
        <dd>Yes. Club-level production, proper sound system, lighting, confetti moments. But you're done by 6pm and you'll actually feel good the next day. Same energy, better timing.</dd>

        <dt>What music will be played?</dt>
        <dd>80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. The DJ builds the energy across the afternoon. Think Whitney, Wham!, Spice Girls, Beyonce, Take That, The Killers, Oasis.</dd>

        <dt>Why do you start at 2pm?</dt>
        <dd>Because it actually works with real life. You can have lunch with friends, run errands, whatever. You're done by 6pm, home by 7pm. You get a proper night out without sacrificing your Sunday or disrupting your week.</dd>

        <dt>Do you offer group tickets?</dt>
        <dd>Yes. We offer group tickets for groups of four or more. People come to celebrate all sorts: birthdays, hen dos, work dos.</dd>

        <dt>What's the crowd like?</dt>
        <dd>Predominantly female, predominantly over 30. Everyone's welcome. Everyone's here for the same reason: to have a proper afternoon out with good music and good people.</dd>

        <dt>What should I wear?</dt>
        <dd>Whatever makes you feel fabulous. Sequins? Yes. Trainers? Definitely. Jeans and a nice top? Classic.</dd>

        <dt>What time do doors open and when does it finish?</dt>
        <dd>Doors open at 2pm. Event runs until 6pm. You can arrive anytime after 2pm.</dd>
      </dl>

      <h2>About THE 2PM CLUB</h2>
      <p>THE 2PM CLUB is a daytime disco created by Boombastic Events, running sell-out events across Northampton, Bedford, Milton Keynes, Coventry, Luton, and Leicester. Founded on the principle that the best time to party is the afternoon: same energy, better timing, no regrets. Part of Boombastic Events, which has been running sell-out events across the Midlands for over 12 years.</p>
      <p>Events feature wall-to-wall 80s, 90s and 00s anthems with club-level production, confetti cannons, massive screens, and dazzling lights. Tickets typically start from £10-15.</p>
      <p>Contact: hello@boomevents.co.uk</p>
      <p>Cities: Northampton, Bedford, Milton Keynes, Coventry, Luton, Leicester</p>

      <h2>Track Record</h2>
      <p>THE 2PM CLUB has been running since 2014 under Boombastic Events. Over 23,000 attendees. Historic sell-through rate of 95%. Events documented with real photography, not stock imagery. Operating across Northampton, Bedford, Milton Keynes, Coventry, Luton, and Leicester. 4.9/5 average rating from 250+ verified reviews. Independently owned, not a franchise or template operation. Every event page at the2pmclub.co.uk/events/ features real crowd photos and embedded ticket checkout.</p>
    </div>
  </noscript>`;
}

export default async function handler(request: Request, context: Context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("text/html")) {
    return response;
  }

  // Only process the homepage
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "") {
    return response;
  }

  try {
    // Fetch events data
    const eventsUrl = new URL("/events.json", url.origin);
    const eventsResponse = await fetch(eventsUrl.toString());

    if (!eventsResponse.ok) {
      return response;
    }

    const events: EventData[] = await eventsResponse.json();

    let html = await response.text();

    // Build schema blocks
    const eventSchema = buildEventSchema(events);
    const reviewSchema = buildReviewSchema();

    // Build noscript content for AI crawlers
    const noscriptBlock = buildNoscriptContent(events);

    // Inject schemas before </head>
    const schemaInjection = `
    <!-- Dynamic Event Schema (injected by edge function for AI crawlers) -->
    <script type="application/ld+json">${eventSchema}</script>
    <script type="application/ld+json">${reviewSchema}</script>
    `;

    html = html.replace("</head>", `${schemaInjection}</head>`);

    // Inject noscript block after <div id="root"></div>
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"></div>${noscriptBlock}`
    );

    return new Response(html, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Homepage inject error:", error);
    return response;
  }
}

export const config = {
  path: "/",
};
