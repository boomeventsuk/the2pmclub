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
    name: ev.title,
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
    description: ev.description,
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
  const title = `${ev.title} | ${formatDate(ev.start)} | THE 2PM CLUB`;
  const description = (ev.description || ev.subtitle || "").slice(0, 160);

  let html = template;

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
  html = html.replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(ev.title)}" />`);

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
