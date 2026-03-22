#!/usr/bin/env node
/**
 * Updates all static HTML pages with the unified nav and footer
 * matching the React app's Header.tsx and Footer.tsx
 */
import { readFileSync, writeFileSync } from 'fs';

const PAGES = [
  'faqs/index.html',
  'group-bookings/index.html',
  'what-to-expect/index.html',
  'for-ai/index.html',
  'hubs/northampton/index.html',
  'hubs/bedford/index.html',
  'hubs/coventry/index.html',
  'hubs/milton-keynes/index.html',
  'hubs/luton/index.html',
  'hubs/leicester/index.html',
  'blog/what-is-a-daytime-disco/index.html',
  'blog/hen-do-daytime-disco/index.html',
  'blog/why-daytime-discos-are-popular/index.html',
];

const NAV_HTML = `<!-- Navigation -->
<header class="site-header fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
  <div class="container mx-auto px-4 py-4 header-inner">
    <a href="/" class="site-logo">
      <img src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/9681c1c5-9af2-40fa-9e7f-0af6361274fc_k2q7ot.png" alt="The 2PM Club logo" style="height:40px;width:auto;">
    </a>
    <nav class="primary-nav">
      <a href="/#tickets" class="font-poppins text-muted-foreground hover:text-primary transition-colors">Events</a>
      <div class="cities-dropdown" style="position:relative">
        <button class="font-poppins text-muted-foreground hover:text-primary transition-colors" style="background:none;border:none;cursor:pointer;font-size:inherit;padding:0">Cities &#9662;</button>
        <div class="cities-dropdown-menu">
          <a href="/hubs/northampton/" class="cities-dropdown-item">Northampton</a>
          <a href="/hubs/bedford/" class="cities-dropdown-item">Bedford</a>
          <a href="/hubs/milton-keynes/" class="cities-dropdown-item">Milton Keynes</a>
          <a href="/hubs/coventry/" class="cities-dropdown-item">Coventry</a>
          <a href="/hubs/luton/" class="cities-dropdown-item">Luton</a>
          <a href="/hubs/leicester/" class="cities-dropdown-item">Leicester</a>
        </div>
      </div>
      <a href="/what-to-expect/" class="font-poppins text-muted-foreground hover:text-primary transition-colors">What to Expect</a>
      <a href="/group-bookings/" class="font-poppins text-muted-foreground hover:text-primary transition-colors">Group Bookings</a>
      <a href="/faqs/" class="font-poppins text-muted-foreground hover:text-primary transition-colors">FAQs</a>
    </nav>
    <div class="header-actions">
      <a href="/#tickets" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" style="text-decoration:none">Book Tickets</a>
    </div>
    <div class="header-icons">
      <a href="https://www.instagram.com/boombastic.eventsuk" aria-label="Instagram" target="_blank" rel="noopener noreferrer nofollow">
        <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
      </a>
      <a href="https://www.facebook.com/boombastic.eventsuk" aria-label="Facebook" target="_blank" rel="noopener noreferrer nofollow">
        <svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h3.1v8h2.4z"/></svg>
      </a>
      <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" aria-label="Email">
        <svg viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM4 7.5l8 5 8-5V6H4v1.5z"/></svg>
      </a>
    </div>
    <button onclick="document.body.classList.toggle('nav-open')" class="nav-toggle" aria-label="Menu">&#9776;</button>
  </div>
  <div id="mobile-menu" class="mobile-menu">
    <a href="/#tickets">Events</a>
    <div class="mobile-cities-toggle">
      <button onclick="this.parentElement.classList.toggle('open')" style="background:none;border:none;color:#fff;font-size:1.1rem;padding:10px 4px;width:100%;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center">Cities <span class="mobile-cities-arrow">&#9662;</span></button>
      <div class="mobile-cities-list" style="display:none;padding-left:16px">
        <a href="/hubs/northampton/">Northampton</a>
        <a href="/hubs/bedford/">Bedford</a>
        <a href="/hubs/milton-keynes/">Milton Keynes</a>
        <a href="/hubs/coventry/">Coventry</a>
        <a href="/hubs/luton/">Luton</a>
        <a href="/hubs/leicester/">Leicester</a>
      </div>
    </div>
    <a href="/what-to-expect/">What to Expect</a>
    <a href="/group-bookings/">Group Bookings</a>
    <a href="/faqs/">FAQs</a>
    <a href="/blog/why-daytime-discos-are-popular/">Blog</a>
    <hr style="border-color:rgba(255,255,255,.08);margin:12px 0">
    <a href="/#tickets" style="color:hsl(47,96%,53%);font-weight:600">Book Tickets</a>
  </div>
</header>`;

const FOOTER_HTML = `<!-- Footer -->
<footer class="bg-card border-t border-border" style="padding:3rem 0;margin-top:4rem">
  <div class="container mx-auto px-4">
    <div class="footer-grid">
      <div class="footer-col">
        <img src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/57926c83-5a73-43e4-b501-9f9c758534fd_fs7hwi.png" alt="Boombastic Events" style="height:48px;width:auto;margin-bottom:16px" loading="lazy">
        <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" class="text-muted-foreground" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-bottom:16px">
          <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM4 7.5l8 5 8-5V6H4v1.5z"/></svg>
          hello@boomevents.co.uk
        </a>
        <div style="display:flex;gap:16px">
          <a href="https://www.facebook.com/boombastic.eventsuk" class="text-muted-foreground" aria-label="Facebook" target="_blank" rel="noopener noreferrer nofollow" style="text-decoration:none">
            <svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:currentColor"><path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h3.1v8h2.4z"/></svg>
          </a>
          <a href="https://www.instagram.com/boombastic.eventsuk" class="text-muted-foreground" aria-label="Instagram" target="_blank" rel="noopener noreferrer nofollow" style="text-decoration:none">
            <svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4 style="font-family:'Bebas Neue',cursive;font-size:1.3rem;letter-spacing:1px;margin-bottom:12px;color:hsl(47,96%,53%)">Explore</h4>
        <a href="/what-to-expect/" class="text-muted-foreground footer-link">What to Expect</a>
        <a href="/group-bookings/" class="text-muted-foreground footer-link">Group Bookings</a>
        <a href="/faqs/" class="text-muted-foreground footer-link">FAQs</a>
        <a href="/blog/why-daytime-discos-are-popular/" class="text-muted-foreground footer-link">Blog</a>
      </div>
      <div class="footer-col">
        <h4 style="font-family:'Bebas Neue',cursive;font-size:1.3rem;letter-spacing:1px;margin-bottom:12px;color:hsl(47,96%,53%)">Cities</h4>
        <a href="/hubs/northampton/" class="text-muted-foreground footer-link">Northampton</a>
        <a href="/hubs/bedford/" class="text-muted-foreground footer-link">Bedford</a>
        <a href="/hubs/milton-keynes/" class="text-muted-foreground footer-link">Milton Keynes</a>
        <a href="/hubs/coventry/" class="text-muted-foreground footer-link">Coventry</a>
        <a href="/hubs/luton/" class="text-muted-foreground footer-link">Luton</a>
        <a href="/hubs/leicester/" class="text-muted-foreground footer-link">Leicester</a>
      </div>
    </div>
    <div style="border-top:1px solid hsl(217.2,32.6%,17.5%);margin-top:2rem;padding-top:1.5rem;text-align:center">
      <p class="text-muted-foreground" style="font-size:0.875rem">&copy; 2026 Boombastic Events Ltd. All rights reserved.</p>
    </div>
  </div>
</footer>`;

const NAV_CSS = `
/* ===== Unified Header/Footer (matches React app) ===== */
.site-header{position:fixed;top:0;left:0;right:0;z-index:50}
.header-inner{display:flex;align-items:center;gap:16px}
.site-logo img{height:40px;width:auto}
.primary-nav{display:flex;gap:28px;margin-left:auto;align-items:center}
.primary-nav a,.primary-nav button{text-decoration:none;font-size:.95rem}
.header-actions{margin-left:18px}
.header-actions a{text-decoration:none;font-weight:500}
.header-icons{display:flex;gap:12px;align-items:center;margin-left:12px}
.header-icons a{display:inline-flex;width:22px;height:22px;opacity:.9}
.header-icons a:hover{opacity:1}
.header-icons svg{width:22px;height:22px;fill:#fff}
.nav-toggle{display:none;background:transparent;border:0;padding:8px;margin-left:8px;font-size:1.5rem;color:#fff;cursor:pointer}
.mobile-menu{display:none;position:absolute;top:100%;left:0;right:0;z-index:60;background:#0B0B0F;border-top:1px solid rgba(255,255,255,.08);padding:12px 16px}
body.nav-open .mobile-menu{display:block}
.mobile-menu a{display:flex;align-items:center;gap:10px;padding:10px 4px;color:#fff;text-decoration:none;font-size:1.1rem}
.mobile-menu a:hover{color:hsl(47,96%,53%)}
.mobile-cities-list a{font-size:1rem;padding:8px 4px}
.mobile-cities-toggle.open .mobile-cities-list{display:block!important}
.mobile-cities-toggle.open .mobile-cities-arrow{transform:rotate(180deg)}
.mobile-cities-arrow{transition:transform .2s}

/* Cities dropdown */
.cities-dropdown-menu{display:none;position:absolute;top:100%;left:-12px;min-width:180px;background:#13131A;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 0;margin-top:8px;z-index:70;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.cities-dropdown:hover .cities-dropdown-menu{display:block}
.cities-dropdown-item{display:block;padding:8px 16px;color:hsl(215,20.2%,65.1%);text-decoration:none;font-size:.9rem;transition:all .2s}
.cities-dropdown-item:hover{color:hsl(47,96%,53%);background:rgba(255,255,255,.04)}

/* Footer grid */
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:2rem;align-items:start}
.footer-link{display:block;text-decoration:none;padding:4px 0;font-size:.9rem;transition:color .2s}
.footer-link:hover{color:hsl(47,96%,53%)}

@media (max-width:900px){
  .primary-nav{display:none}
  .header-icons{display:none}
  .header-actions{display:none}
  .nav-toggle{display:inline-flex}
}
@media (max-width:600px){
  .footer-grid{grid-template-columns:1fr;gap:2rem;text-align:center}
  .footer-col:first-child{display:flex;flex-direction:column;align-items:center}
  .footer-col div[style*="display:flex"]{justify-content:center}
}
`;

let updated = 0;

for (const page of PAGES) {
  const path = `/tmp/the2pmclub/${page}`;
  let html;
  try {
    html = readFileSync(path, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${page} (file not found)`);
    continue;
  }

  // Replace nav: match <nav ...>...</nav> or <header ...>...</header> (including <!-- Navigation --> comment)
  // First try <header> tag
  let navReplaced = false;
  if (html.includes('<header')) {
    html = html.replace(/<!--\s*Navigation\s*-->[\s\S]*?<\/header>/i, NAV_HTML);
    navReplaced = true;
  }
  if (!navReplaced && html.includes('<nav')) {
    html = html.replace(/<!--\s*Navigation\s*-->[\s\S]*?<\/nav>/i, NAV_HTML);
    if (!html.includes('header-inner')) {
      // Fallback: replace just the nav tag
      html = html.replace(/<nav[\s\S]*?<\/nav>/i, NAV_HTML);
    }
    navReplaced = true;
  }

  // Replace footer
  html = html.replace(/<!--\s*Footer\s*-->[\s\S]*?<\/footer>/i, FOOTER_HTML);
  // Also try without comment
  if (!html.includes('footer-grid')) {
    html = html.replace(/<footer[\s\S]*?<\/footer>/i, FOOTER_HTML);
  }

  // Add nav/footer CSS before </style> if not already present
  if (!html.includes('cities-dropdown-menu')) {
    html = html.replace('</style>', NAV_CSS + '\n</style>');
  }

  writeFileSync(path, html);
  updated++;
  console.log(`OK: ${page}`);
}

console.log(`\nDone. Updated ${updated} pages.`);
