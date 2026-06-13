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
  "250726-2PM-NPTON",
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
