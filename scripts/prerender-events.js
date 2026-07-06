#!/usr/bin/env node
/**
 * prerender-events.js
 * Post-build: writes a static HTML shell per upcoming event at
 * dist/events/{slug}/index.html so crawlers and link unfurlers get unique
 * title, meta description, canonical, OG tags and full Event JSON-LD without
 * executing JS. The shell is dist/index.html with the head swapped, so the
 * SPA hydrates on top of it (Netlify serves static files before the
 * /events/* rewrite).
 *
 * Reads public/events.json (live-synced; never hand-edit event facts).
 * Run: node scripts/prerender-events.js   (wired into npm run build as postbuild)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.the2pmclub.co.uk";
const DIST = path.join(ROOT, "dist");

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const events = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public", "events.json"), "utf8")
);
const EIGHTIES_EVENT_SLUGS = new Set([
  "031026-2PM-NPTON",
  "120926-2PM-BED",
  "190926-2PM-COV",
  "260926-2PM-MK",
  "031026-2PM-LUT",
]);
const EIGHTIES_MUSIC_FAQ = "80s anthems. Wall-to-wall songs you know every word to. Think Whitney, Wham!, Madonna, Bon Jovi, Queen, Cyndi Lauper and A-ha.";

const today = new Date();
today.setHours(0, 0, 0, 0);
const upcoming = events.filter((e) => new Date(e.start) >= today);

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] || "th";
}

// "Sat 13th Jun 2026" per house date rule
function formatDate(iso) {
  const d = new Date(iso);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${d.getDate()}${ordinal(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Emoji ranges + ZWJ/variation selectors. Feed copy (description/highlights)
// carries emoji; the pre-JS shell is plain text so strip them defensively.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu;
function plain(s) {
  return String(s || "").replace(EMOJI_RE, "").replace(/\s{2,}/g, " ").trim();
}

// Bunny CDN delivery, mirroring src/pages/EventPageV2.tsx: a sharp WebP poster
// plus a tiny blurred layer painted behind it so the hero is NEVER a black box
// while the sharp image streams in (esp. mobile 4G). Only b-cdn.net URLs get params.
function cdnParam(url, params) {
  return url && url.includes("b-cdn.net")
    ? `${url}${url.includes("?") ? "&" : "?"}${params}`
    : url;
}
const heroPosterWebp = (url) => cdnParam(url, "width=800&quality=72&format=webp");
const heroPosterBlur = (url) => cdnParam(url, "width=24&quality=30");

// "From £10.00" -> "From £10" (keeps non-zero pence, e.g. "From £12.50")
function cleanPrice(label) {
  return label ? String(label).replace(/\.00\b/, "") : "";
}

// events.json carries "Venue, City" in location; the React page splits the same way.
function parseLocation(location) {
  const parts = String(location || "").split(", ");
  return { venue: parts[0] || location || "", city: parts[parts.length - 1] || "" };
}

// Visible above-fold hero injected inside <div id="root"> so slow connections
// see the artwork and event facts instead of a blank dark screen while the
// ~135KB JS bundle + events.json load. main.tsx uses createRoot().render(),
// which REPLACES the container's children on mount, so this static content is
// wiped and swapped for the React hero with no duplicate H1 and no flash. Kept
// visually close to the EventPageV2 hero (artwork left, facts card right) so
// the swap is seamless. Inline styles only: no dependency on app CSS classes.
function shellHeroHtml(ev) {
  const { venue, city } = parseLocation(ev.location);
  const eighties = isEightiesEdition(ev);
  const soldOut = ev.status === "sold-out";
  const price = cleanPrice(ev.priceLabel);
  const badge = !soldOut && ev.statusLabel ? plain(ev.statusLabel) : "";
  const group = ev.groupTicket && ev.groupTicket.label ? plain(ev.groupTicket.label) : "";
  const subline = plain(ev.heroSubtitle || ev.subtitle || "");
  const line2 = eighties ? "80s Edition Daytime Disco" : "Daytime Disco";
  const img = esc(ev.image || "");

  const fontStack = "Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
  const factRow = (text) =>
    `<p style="margin:0;color:rgba(255,255,255,0.82);font-size:1rem;line-height:1.4;">${text}</p>`;

  return [
    `<div style="min-height:100vh;background:#0B0B0F;color:#fff;font-family:${fontStack};">`,
    `<div style="max-width:1024px;margin:0 auto;padding:96px 20px 48px;display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start;">`,

    // Artwork: blur-up layer + sharp WebP poster
    `<div style="position:relative;flex:1 1 320px;max-width:440px;width:100%;aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:#000;">`,
    img ? `<img src="${heroPosterBlur(img)}" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.1);filter:blur(20px);">` : "",
    img ? `<img src="${heroPosterWebp(img)}" alt="${esc(displayTitle(ev))} event poster" width="800" height="800" fetchpriority="high" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">` : "",
    `</div>`,

    // Facts card
    `<div style="flex:1 1 320px;min-width:280px;">`,
    badge
      ? `<p style="display:inline-block;background:rgba(255,60,172,0.15);border:1px solid rgba(255,60,172,0.35);border-radius:999px;padding:7px 16px;margin:0 0 14px;color:#FF3CAC;font-weight:700;font-size:0.8rem;letter-spacing:0.04em;text-transform:uppercase;">${esc(badge)}</p>`
      : "",
    `<h1 style="margin:0;font-weight:700;text-transform:uppercase;line-height:1.1;letter-spacing:-0.01em;font-size:clamp(1.75rem,6vw,3rem);">THE 2PM CLUB<br><span style="color:rgba(255,255,255,0.9);">${esc(line2)}</span><br><span style="color:#FF3CAC;">${esc(city)}</span></h1>`,
    subline ? `<p style="margin:14px 0 0;color:rgba(255,255,255,0.85);font-size:1.1rem;font-weight:500;line-height:1.4;">${esc(subline)}</p>` : "",
    `<div style="margin:20px 0 0;padding:18px 0 0;border-top:1px solid rgba(255,255,255,0.14);display:flex;flex-direction:column;gap:8px;">`,
    factRow(esc(formatDate(ev.start))),
    factRow(`${esc(venue)}, ${esc(city)}`),
    price ? factRow(`<span style="font-weight:600;">Tickets ${esc(price.replace(/^From\s+/i, "from "))}</span>`) : "",
    group ? factRow(esc(group)) : "",
    `</div>`,
    `<a href="#checkout-section" style="display:inline-block;margin-top:24px;background:#FF3CAC;color:#fff;font-weight:700;padding:14px 34px;border-radius:999px;text-decoration:none;font-size:1.05rem;">${soldOut ? "Join Waiting List" : "Book Tickets"}</a>`,
    `</div>`,

    `</div>`,
    `</div>`,
  ].filter(Boolean).join("");
}

function isEightiesEdition(ev) {
  if (ev.slug && EIGHTIES_EVENT_SLUGS.has(ev.slug.toUpperCase())) return true;

  const searchable = [
    ev.eventType,
    ev.title,
    ev.slug,
    ev.statusLabel,
    ev.subtitle,
    ev.description,
    ev.image,
  ].filter(Boolean).join(" ");
  return /80s edition|2pm80s|2pm-80s|goes full-on 80s|your best 80s night out/i.test(searchable);
}

function displayTitle(ev) {
  if (!isEightiesEdition(ev)) return ev.title;
  const city = (ev.location || "").split(", ").pop() || ev.cityCode || "";
  return `THE 2PM CLUB 80s Edition ${city}`.trim();
}

function displayDescription(ev) {
  if (!isEightiesEdition(ev)) return (ev.description || ev.subtitle || "").slice(0, 160);
  return "Your best 80s night out. In the middle of the afternoon.";
}

function eventShellCopy(html, ev) {
  if (!isEightiesEdition(ev)) return html;

  return html
    .replace(
      `"description":"THE 2PM CLUB is the Midlands' original daytime disco. 4 hours of 80s, 90s and 00s anthems, every Saturday afternoon, 2pm to 6pm. Home by 7.",`,
      `"description":"THE 2PM CLUB is the Midlands' original daytime disco by Boombastic Events. Daytime dancefloor energy from 2pm to 6pm. Home by 7.",`
    )
    .replace(
      `"80s 90s 00s music events"`,
      `"80s music events"`
    )
    .replace(
      `<meta name="keywords" content="daytime disco, over 25s events, afternoon party, 80s 90s 00s music, Midlands events, wake up fresh, daytime clubbing, adult entertainment">`,
      `<meta name="keywords" content="daytime disco, over 25s events, afternoon party, 80s music, Midlands events, wake up fresh, daytime clubbing, adult entertainment">`
    )
    .replace(
      `"text":"80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. The DJ builds the energy across the afternoon. Think Whitney, Wham!, Spice Girls, Beyonce, Take That, The Killers, Oasis."`,
      `"text":"${EIGHTIES_MUSIC_FAQ}"`
    );
}

// The live 2PM site globally 301-redirects URLs to lowercase, so every
// emitted URL must be lowercase or the canonical self-redirects.
function slugPath(slug) {
  return slug.toLowerCase();
}

function jsonLdFor(ev) {
  const eventUrl = `${SITE}/events/${slugPath(ev.slug)}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: displayTitle(ev),
    startDate: ev.start,
    endDate: ev.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: ev.image,
    url: eventUrl,
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
      url: eventUrl,
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
    description: displayDescription(ev),
  };
}

function mustReplace(html, from, to, slug) {
  if (!html.includes(from)) {
    throw new Error(`Template anchor missing for ${slug}: ${from.slice(0, 70)}`);
  }
  return html.split(from).join(to);
}

let written = 0;
for (const ev of upcoming) {
  const eventUrl = `${SITE}/events/${slugPath(ev.slug)}/`;
  const title = `${displayTitle(ev)} | ${formatDate(ev.start)} | THE 2PM CLUB`;
  const description = displayDescription(ev);

  let html = template;
  html = eventShellCopy(html, ev);

  // Unique title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);

  // Canonical + og:url
  html = mustReplace(html, '<link rel="canonical" href="https://www.the2pmclub.co.uk/">', `<link rel="canonical" href="${eventUrl}">`, ev.slug);
  html = mustReplace(html, '<meta property="og:url" content="https://www.the2pmclub.co.uk/" />', `<meta property="og:url" content="${eventUrl}" />`, ev.slug);

  // Meta description
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);

  // OG / Twitter image -> event artwork (square)
  html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${esc(ev.image)}$2`);
  html = html.replace(/(<meta property="og:image:secure_url"\s+content=")[^"]*(" \/>)/, `$1${esc(ev.image)}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${esc(ev.image)}$2`);
  html = html.replace(/<meta property="og:image:width" content="[^"]*" \/>/, '<meta property="og:image:width" content="1080" />');
  html = html.replace(/<meta property="og:image:height" content="[^"]*" \/>/, '<meta property="og:image:height" content="1080" />');
  html = html.replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(displayTitle(ev))}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${esc(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${esc(description)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${esc(description)}" />`);

  // Per-event OG title/description + Event JSON-LD before </head>
  const extra = [
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLdFor(ev), null, 2)}\n</script>`,
  ].join("\n");
  html = html.replace("</head>", `${extra}\n</head>`);

  // Visible above-fold hero inside #root (replaced cleanly on hydration) so
  // ad clickers on slow mobile connections see the event immediately instead
  // of a blank dark page while the JS bundle and events.json load.
  html = mustReplace(html, '<div id="root"></div>', `<div id="root">${shellHeroHtml(ev)}</div>`, ev.slug);

  const dir = path.join(DIST, "events", slugPath(ev.slug));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  written++;
}

console.log(`prerender-events: wrote ${written} event shells to dist/events/`);

/* ---------- index shells: /events/ and /blog/ ---------- */
// Both URLs are in the sitemap but previously served the homepage head
// (homepage title + canonical = soft duplicate signals) with no crawlable
// content. Each gets a real prerendered shell: unique title, canonical,
// meta description and visible content inside #root. The SPA mounts over
// #root on hydration, so the static content is only the pre-JS view.

function indexShell({ urlPath, title, description, bodyHtml }) {
  const pageUrl = `${SITE}${urlPath}`;
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = mustReplace(html, '<link rel="canonical" href="https://www.the2pmclub.co.uk/">', `<link rel="canonical" href="${pageUrl}">`, urlPath);
  html = mustReplace(html, '<meta property="og:url" content="https://www.the2pmclub.co.uk/" />', `<meta property="og:url" content="${pageUrl}" />`, urlPath);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(description)}">`);
  html = mustReplace(html, '<div id="root"></div>', `<div id="root">${bodyHtml}</div>`, urlPath);
  return html;
}

/* /events/ index: upcoming events from events.json with site links */
const eventItems = upcoming
  .slice()
  .sort((a, b) => new Date(a.start) - new Date(b.start))
  .map((ev) => {
    const soldOut = ev.status === "sold-out";
    const extra = soldOut
      ? "Sold out: join the waitlist"
      : ev.priceLabel || "";
    return `<li style="margin:0 0 16px;padding:0 0 16px;border-bottom:1px solid rgba(255,255,255,.12)">
        <a href="/events/${slugPath(ev.slug)}/" style="color:inherit;font-weight:600;text-decoration:underline">${esc(ev.title)}</a><br>
        <span>${esc(formatDate(ev.start))}, ${esc(ev.location)}${extra ? `. ${esc(extra)}` : ""}</span>
      </li>`;
  })
  .join("\n      ");

const eventsIndexBody = `<main id="main-content" style="max-width:760px;margin:0 auto;padding:48px 20px 64px;font-family:Poppins,Inter,system-ui,sans-serif">
    <h1 style="font-size:2rem;line-height:1.2;margin:0 0 10px">Upcoming Daytime Disco Events</h1>
    <p style="margin:0 0 28px">All upcoming THE 2PM CLUB dates across the Midlands. Iconic 80s, 90s and 00s anthems, 2pm to 6pm, home by 7. Book via the event pages below.</p>
    <ul style="list-style:none;margin:0;padding:0">
      ${eventItems}
    </ul>
    <p style="margin:28px 0 0"><a href="/" style="color:inherit;text-decoration:underline">THE 2PM CLUB home</a></p>
  </main>`;

fs.writeFileSync(
  path.join(DIST, "events", "index.html"),
  indexShell({
    urlPath: "/events/",
    title: "Upcoming Daytime Disco Events | THE 2PM CLUB",
    description:
      "All upcoming THE 2PM CLUB daytime disco events across the Midlands. Book your tickets for Northampton, Bedford, Milton Keynes, Coventry, Luton and Leicester.",
    bodyHtml: eventsIndexBody,
  })
);
console.log(`prerender-events: wrote events index shell (${upcoming.length} events)`);

/* /blog/ index: the five static posts (mirrors src/pages/blog/BlogIndex.tsx) */
const blogPosts = [
  { slug: "what-is-a-daytime-disco", title: "What Is a Daytime Disco?", excerpt: "Everything you need to know about daytime discos: what they are, who goes, and why they sell out." },
  { slug: "hen-do-daytime-disco", title: "Hen Do Daytime Disco: The Afternoon Alternative", excerpt: "Why a daytime disco hen party is the plan everyone actually says yes to." },
  { slug: "hen-party-ideas-northampton", title: "Hen Party Ideas in Northampton", excerpt: "The best hen party ideas in Northampton, from afternoon discos to cocktail classes." },
  { slug: "birthday-party-ideas-northampton-adults", title: "Birthday Party Ideas for Adults in Northampton", excerpt: "Grown-up birthday ideas that actually work: daytime discos, group experiences, and more." },
  { slug: "why-daytime-discos-are-popular", title: "Why Daytime Discos Are So Popular", excerpt: "The rise of the afternoon party: why daytime events sell out while evening ones struggle." },
];

const blogItems = blogPosts
  .map(
    (p) => `<li style="margin:0 0 16px;padding:0 0 16px;border-bottom:1px solid rgba(255,255,255,.12)">
        <a href="/blog/${p.slug}/" style="color:inherit;font-weight:600;text-decoration:underline">${esc(p.title)}</a><br>
        <span>${esc(p.excerpt)}</span>
      </li>`
  )
  .join("\n      ");

const blogIndexBody = `<main id="main-content" style="max-width:760px;margin:0 auto;padding:48px 20px 64px;font-family:Poppins,Inter,system-ui,sans-serif">
    <h1 style="font-size:2rem;line-height:1.2;margin:0 0 10px">THE 2PM CLUB Blog</h1>
    <p style="margin:0 0 28px">Stories, science, and the soundtrack to your Saturday.</p>
    <ul style="list-style:none;margin:0;padding:0">
      ${blogItems}
    </ul>
    <p style="margin:28px 0 0"><a href="/" style="color:inherit;text-decoration:underline">THE 2PM CLUB home</a></p>
  </main>`;

fs.mkdirSync(path.join(DIST, "blog"), { recursive: true });
fs.writeFileSync(
  path.join(DIST, "blog", "index.html"),
  indexShell({
    urlPath: "/blog/",
    title: "Blog | THE 2PM CLUB",
    description:
      "Stories, science, and the soundtrack to your Saturday. Discover why afternoon parties work, the music we love, and the culture of daytime disco.",
    bodyHtml: blogIndexBody,
  })
);
console.log(`prerender-events: wrote blog index shell (${blogPosts.length} posts)`);
