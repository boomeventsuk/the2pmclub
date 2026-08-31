#!/usr/bin/env node
/**
 * generate-static.js
 * Build-time generator for static surfaces that must track live event data.
 * Reads public/events.json (live-synced from Eventbrite by other agents; never
 * hand-edit event facts) and injects current data into:
 *   1. public/hubs/{city}/index.html  - event cards + Event JSON-LD + CTA
 *   2. public/sitemap.xml             - static pages, hubs, blog, upcoming events
 *
 * Idempotent: output is wrapped in HTML marker comments; reruns replace the
 * marked regions. First run replaces the legacy hand-edited blocks.
 *
 * Run: node scripts/generate-static.js   (wired into npm run build)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  customerStatusLabel,
  formatUkEventDate,
  formatUkEventTimeRange,
  groupTicketAvailability,
  ticketPriceWithFee,
} from "./site-event-facts.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.the2pmclub.co.uk";

const HUBS = [
  { dir: "northampton", city: "Northampton", cityCode: "NPTON" },
  { dir: "bedford", city: "Bedford", cityCode: "BED" },
  { dir: "coventry", city: "Coventry", cityCode: "COV" },
  { dir: "milton-keynes", city: "Milton Keynes", cityCode: "MK" },
  { dir: "luton", city: "Luton", cityCode: "LUT" },
  { dir: "leicester", city: "Leicester", cityCode: "LEIC" },
];

const events = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public", "events.json"), "utf8")
);

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcoming = events
  .filter((e) => new Date(e.start) >= today)
  .sort((a, b) => new Date(a.start) - new Date(b.start));

/* ---------- helpers ---------- */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// The live site 301-redirects URLs to lowercase, so every emitted URL must be
// lowercase or sitemap/JSON-LD URLs redirect away from the canonical.
function eventUrl(ev) {
  return `${SITE}/events/${ev.slug.toLowerCase()}/`;
}

// Curated current-event surface for agents. The source feed also carries old
// campaign prose and historical records; neither belongs in an upcoming-only
// factual endpoint. Keep the live fact fields and presentation decisions only.
function upcomingAgentRecord(ev) {
  return {
    id: ev.id,
    slug: ev.slug,
    eventType: ev.eventType,
    cityCode: ev.cityCode,
    eventbriteId: ev.eventbriteId,
    title: ev.title,
    location: ev.location,
    venueAddress: ev.venueAddress,
    start: ev.start,
    end: ev.end,
    displayDate: formatUkEventDate(ev.start),
    displayTime: formatUkEventTimeRange(ev.start, ev.end),
    canonicalUrl: eventUrl(ev),
    bookUrl: eventUrl(ev),
    image: ev.image,
    description: ev.description || ev.subtitle || "",
    status: ev.status,
    statusLabel: customerStatusLabel(ev),
    availability: ev.availability,
    price: ev.price,
    priceCurrency: ev.priceCurrency || "GBP",
    priceLabel: ticketPriceWithFee(ev.priceLabel),
    groupTicket: ev.groupTicket?.label
      ? { ...ev.groupTicket, label: groupTicketAvailability(ev.groupTicket.label) }
      : undefined,
  };
}

/* ---------- hub event card ---------- */

function badgeFor(ev) {
  // Honest urgency: only render a badge when the synced status label is
  // present and specific. Never invent status.
  if (ev.status === "sold-out") return "Sold out";
  const label = customerStatusLabel(ev);
  if (label && label.trim()) return esc(label.trim());
  return null;
}

function eventCard(ev) {
  const city = (ev.location || "").split(", ").pop() || "";
  const soldOut = ev.status === "sold-out";
  const badge = badgeFor(ev);
  const tierLine =
    Array.isArray(ev.tierLabels) && ev.tierLabels.length
      ? `\n          <p class="event-tier-line" style="margin:6px 0 0;font-size:13px;opacity:.8">${ev.tierLabels.map(esc).join(". ")}.</p>`
      : "";
  const groupLine = ev.groupTicket?.label && !soldOut
    ? `\n          <p class="event-tier-line" style="margin:6px 0 0;font-size:13px;opacity:.8">${esc(groupTicketAvailability(ev.groupTicket.label))}</p>`
    : "";
  const priceItem =
    ev.priceLabel && !soldOut
      ? `\n            <div class="event-meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 9a3 3 0 0 0 0 6v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 0 0-6V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>
              <span>${esc(ticketPriceWithFee(ev.priceLabel))}</span>
            </div>`
      : "";
  const cta = soldOut
    ? `<a href="/events/${ev.slug.toLowerCase()}/" class="btn-primary event-card-btn" style="opacity:.7">Sold out: join the waitlist</a>`
    : `<a href="/events/${ev.slug.toLowerCase()}/" class="btn-primary event-card-btn">Book Now</a>`;

  return `      <article class="event-card">
        <div class="event-card-image">
          <img src="${esc(ev.image)}?width=600&quality=75" alt="${esc(ev.title)}" loading="lazy">${badge ? `\n          <span class="event-badge">${badge}</span>` : ""}
        </div>
        <div class="event-card-content">
          <h3 class="event-card-title">${esc(ev.title)}</h3>
          <div class="event-card-meta">
            <div class="event-meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <time datetime="${esc(ev.start)}">${formatUkEventDate(ev.start)}</time>
            </div>
            <div class="event-meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${esc(ev.location)}</span>
            </div>
            <div class="event-meta-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <time datetime="${esc(ev.start)}/${esc(ev.end)}">${formatUkEventTimeRange(ev.start, ev.end)}</time>
            </div>${priceItem}
          </div>${groupLine}${tierLine}
        </div>
        ${cta}
      </article>`;
}

function waitlistBlock(city) {
  return `      <p class="leading-relaxed mb-4">No ${city} date on sale right now. The next one is coming: join the list and you hear first, before the group chat wakes up.</p>
      <form name="city-waitlist" method="POST" action="/thanks.html" data-netlify="true" style="display:flex;flex-wrap:wrap;gap:10px;max-width:480px">
        <input type="hidden" name="form-name" value="city-waitlist">
        <input type="hidden" name="city" value="${city}">
        <input type="email" name="email" required placeholder="Enter your email address" style="flex:1;min-width:220px;padding:12px 16px;border-radius:9999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:inherit">
        <button type="submit" class="btn-primary" style="border:0;cursor:pointer">Join the list</button>
      </form>`;
}

function jsonLdFor(cityEvents) {
  const blocks = cityEvents.map((ev) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl(ev)}#event`,
    name: ev.title,
    startDate: ev.start,
    endDate: ev.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: ev.image,
    location: {
      "@type": "Place",
      name: (ev.location || "").split(", ").slice(0, -1).join(", ") || ev.location,
      address: ev.venueAddress
        ? { "@type": "PostalAddress", ...ev.venueAddress }
        : undefined,
    },
    offers: {
      "@type": "Offer",
      price: ev.price != null ? ev.price.toFixed(2) : undefined,
      priceCurrency: ev.priceCurrency || "GBP",
      availability:
        ev.status === "sold-out"
          ? "https://schema.org/SoldOut"
          : ev.availability || "https://schema.org/InStock",
      url: eventUrl(ev),
    },
    organizer: {
      "@type": "Organization",
      name: "THE 2PM CLUB",
      url: SITE,
      sameAs: [
        "https://www.facebook.com/boombastic.eventsuk",
        "https://www.instagram.com/boombastic.eventsuk",
      ],
    },
    description: ev.description || ev.subtitle || ev.title,
  }));
  const payload = blocks.length === 1 ? blocks[0] : blocks;
  return `<script type="application/ld+json">\n${JSON.stringify(payload, null, 2)}\n</script>`;
}

/* ---------- hub page injection ---------- */

const M = {
  ldStart: "<!-- 2PM-GEN:EVENT-JSONLD:START -->",
  ldEnd: "<!-- 2PM-GEN:EVENT-JSONLD:END -->",
  cardsStart: "<!-- 2PM-GEN:EVENT-CARDS:START -->",
  cardsEnd: "<!-- 2PM-GEN:EVENT-CARDS:END -->",
  ctaStart: "<!-- 2PM-GEN:CTA:START -->",
  ctaEnd: "<!-- 2PM-GEN:CTA:END -->",
};

function replaceBetween(html, start, end, inner, label, file) {
  const s = html.indexOf(start);
  const e = html.indexOf(end);
  if (s === -1 || e === -1) {
    throw new Error(`Marker ${label} missing in ${file}`);
  }
  return html.slice(0, s + start.length) + "\n" + inner + "\n" + html.slice(e);
}

// The hub hero is a ~210KB 1200w JPEG with no srcset, so phones fetch the full
// desktop image. Add srcset (768w/1200w) + sizes so mobiles pull the 768w file.
// Idempotent: only rewrites the eager 400px-tall hero <img> when it has no
// srcset yet. Uses Bunny "?width=&quality=" params on the same base URL.
const HERO_IMG_RE =
  /<img\s+src="(https:\/\/boombastic-events\.b-cdn\.net\/[^"]+?)\?width=1200&quality=80"\s+alt="([^"]*)"\s+style="width:100%;height:400px;object-fit:cover;display:block"\s+loading="eager">/;

function injectHeroSrcset(html, file) {
  if (!HERO_IMG_RE.test(html)) {
    // Already has srcset (rerun) or the hero markup changed. If neither the
    // rewritten form nor the original is present, that is a real drift to flag.
    if (!/srcset="[^"]*hero[^"]*"/.test(html) && !html.includes("height:400px;object-fit:cover")) {
      throw new Error(`Hub hero <img> not found in ${file}`);
    }
    return html;
  }
  return html.replace(HERO_IMG_RE, (_m, base, alt) => {
    const at = (w) => `${base}?width=${w}&quality=80`;
    return (
      `<img src="${at(1200)}" ` +
      `srcset="${at(768)} 768w, ${at(1200)} 1200w" sizes="100vw" ` +
      `alt="${alt}" style="width:100%;height:400px;object-fit:cover;display:block" loading="eager">`
    );
  });
}

function generateHub(hub) {
  const file = path.join(ROOT, "public", "hubs", hub.dir, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const cityEvents = upcoming.filter((e) => e.cityCode === hub.cityCode);
  const hasEvents = cityEvents.length > 0;

  /* --- one-time migration from legacy hand-edited blocks to markers --- */
  if (!html.includes(M.ldStart)) {
    // Event JSON-LD block sits after a "Structured Data: Event(s)" comment.
    html = html.replace(
      /<!-- Structured Data: Events? -->\n<script type="application\/ld\+json">\n[\s\S]*?\n<\/script>/,
      `${M.ldStart}\n${M.ldEnd}`
    );
    if (!html.includes(M.ldStart)) throw new Error(`Could not migrate JSON-LD block in ${file}`);
  }
  if (!html.includes(M.cardsStart)) {
    // Cards live between the "Upcoming Events in X" h2 and the section's closing div.
    const re = new RegExp(
      `(<h2 class="text-2xl mb-4">Upcoming Events in ${hub.city}</h2>)\\n[\\s\\S]*?\\n(    </div>\\n\\n    <!-- Track Record -->)`
    );
    if (!re.test(html)) throw new Error(`Could not locate Upcoming Events section in ${file}`);
    html = html.replace(re, `$1\n${M.cardsStart}\n${M.cardsEnd}\n$2`);
  }
  if (!html.includes(M.ctaStart)) {
    const re = /(<div class="text-center mt-12 mb-8">)\n[\s\S]*?\n(  <\/div>\n\n  <!-- Social Share -->)/;
    if (!re.test(html)) throw new Error(`Could not locate CTA block in ${file}`);
    html = html.replace(re, `$1\n${M.ctaStart}\n${M.ctaEnd}\n$2`);
  }

  /* --- inject current content --- */
  const ld = hasEvents ? jsonLdFor(cityEvents) : "";
  html = replaceBetween(html, M.ldStart, M.ldEnd, ld ? `<!-- Structured Data: Events (generated) -->\n${ld}` : "<!-- No upcoming events: no Event JSON-LD emitted -->", "JSONLD", file);

  const cards = hasEvents
    ? cityEvents.map(eventCard).join("\n\n")
    : waitlistBlock(hub.city);
  html = replaceBetween(html, M.cardsStart, M.cardsEnd, cards, "CARDS", file);

  const firstBookable = cityEvents.find((ev) => ev.status !== "sold-out");
  const cta = firstBookable
    ? `    <a href="/events/${firstBookable.slug.toLowerCase()}/" class="btn-primary btn-large">\n      Book Your ${hub.city} Tickets\n    </a>`
    : hasEvents
      ? `    <a href="/events/${cityEvents[0].slug.toLowerCase()}/" class="btn-primary btn-large">\n      Join The ${hub.city} Waiting List\n    </a>`
    : `    <a href="/#tickets" class="btn-primary btn-large">\n      See All Upcoming Events\n    </a>`;
  html = replaceBetween(html, M.ctaStart, M.ctaEnd, cta, "CTA", file);

  // Responsive hub hero (srcset/sizes) so phones fetch 768w not 1200w.
  html = injectHeroSrcset(html, file);

  fs.writeFileSync(file, html);
  console.log(`hub ${hub.dir}: ${hasEvents ? cityEvents.length + " event(s)" : "waitlist state"}`);
}

/* ---------- sitemap ---------- */

function generateSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const url = (loc, changefreq, priority) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const staticPages = [
    [`${SITE}/`, "daily", "1.0"],
    [`${SITE}/events.json`, "hourly", "0.7"],
    ...HUBS.map((h) => [`${SITE}/hubs/${h.dir}/`, "weekly", "0.8"]),
    [`${SITE}/what-to-expect/`, "monthly", "0.7"],
    [`${SITE}/group-bookings/`, "monthly", "0.7"],
    [`${SITE}/faqs/`, "monthly", "0.6"],
    [`${SITE}/events/`, "daily", "0.8"],
    [`${SITE}/for-ai/`, "monthly", "0.3"],
    [`${SITE}/privacy/`, "yearly", "0.3"],
    [`${SITE}/terms/`, "yearly", "0.3"],
  ];

  const eventPages = upcoming.map((ev, i) => [eventUrl(ev), "weekly", i === 0 ? "0.9" : "0.8"]);

  const blogPages = [
    [`${SITE}/blog/`, "monthly", "0.7"],
    [`${SITE}/blog/what-is-a-daytime-disco/`, "monthly", "0.8"],
    [`${SITE}/blog/hen-do-daytime-disco/`, "monthly", "0.7"],
    [`${SITE}/blog/hen-party-ideas-northampton/`, "monthly", "0.8"],
    [`${SITE}/blog/birthday-party-ideas-northampton-adults/`, "monthly", "0.8"],
    [`${SITE}/blog/why-daytime-discos-are-popular/`, "monthly", "0.7"],
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticPages, ...eventPages, ...blogPages].map((p) => url(...p)).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), xml);
  console.log(`sitemap: ${staticPages.length + eventPages.length + blogPages.length} urls, ${upcoming.length} upcoming events`);
}

/* ---------- run ---------- */

HUBS.forEach(generateHub);
fs.writeFileSync(
  path.join(ROOT, "public", "upcoming-events.json"),
  `${JSON.stringify(upcoming.map(upcomingAgentRecord), null, 2)}\n`
);
generateSitemap();
console.log("generate-static: done");
