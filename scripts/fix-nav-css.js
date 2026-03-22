#!/usr/bin/env node
/**
 * Adds the missing nav/footer layout CSS to all static pages.
 * The nav HTML was injected but the companion CSS was skipped.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const PAGES = [
  'public/faqs/index.html',
  'public/group-bookings/index.html',
  'public/what-to-expect/index.html',
  'public/for-ai/index.html',
  'public/hubs/northampton/index.html',
  'public/hubs/bedford/index.html',
  'public/hubs/coventry/index.html',
  'public/hubs/milton-keynes/index.html',
  'public/hubs/luton/index.html',
  'public/hubs/leicester/index.html',
  'public/blog/what-is-a-daytime-disco/index.html',
  'public/blog/hen-do-daytime-disco/index.html',
  'public/blog/why-daytime-discos-are-popular/index.html',
];

const NAV_LAYOUT_CSS = `
/* ===== Header/Footer layout ===== */
.site-header{background:hsla(var(--background),.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid hsl(var(--border))}
.header-inner{display:flex;align-items:center;gap:16px}
.site-logo img{height:40px;width:auto}
.primary-nav{display:flex;gap:28px;margin-left:auto;align-items:center}
.primary-nav a,.primary-nav button{text-decoration:none;font-size:.95rem;font-family:'Poppins',sans-serif;color:hsl(var(--muted-foreground))}
.primary-nav a:hover,.primary-nav button:hover{color:hsl(var(--primary))}
.header-actions{margin-left:18px}
.header-actions a{display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 16px;border-radius:.375rem;background:hsl(var(--primary));color:hsl(var(--primary-foreground));font-weight:500;font-size:.875rem;text-decoration:none;font-family:'Poppins',sans-serif;transition:background .2s}
.header-actions a:hover{opacity:.9}
.header-icons{display:flex;gap:12px;align-items:center;margin-left:12px}
.header-icons a{display:inline-flex;width:22px;height:22px;opacity:.9}
.header-icons a:hover{opacity:1}
.header-icons svg{width:22px;height:22px;fill:#fff}
.nav-toggle{display:none;background:transparent;border:0;padding:8px;margin-left:8px;font-size:1.5rem;color:#fff;cursor:pointer}

/* Cities dropdown */
.cities-dropdown{position:relative}
.cities-dropdown-menu{display:none;position:absolute;top:calc(100% + 8px);left:-12px;min-width:180px;background:#13131A;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 0;z-index:70;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.cities-dropdown:hover .cities-dropdown-menu{display:block}
.cities-dropdown-item{display:block;padding:8px 16px;color:hsl(215,20.2%,65.1%);text-decoration:none;font-size:.9rem;font-family:'Poppins',sans-serif;transition:all .2s}
.cities-dropdown-item:hover{color:hsl(47,96%,53%);background:rgba(255,255,255,.04)}

/* Mobile menu */
.mobile-menu{display:none;position:absolute;top:100%;left:0;right:0;z-index:60;background:#0B0B0F;border-top:1px solid rgba(255,255,255,.08);padding:12px 16px}
body.nav-open .mobile-menu{display:block}
.mobile-menu a{display:flex;align-items:center;gap:10px;padding:10px 4px;color:#fff;text-decoration:none;font-size:1.1rem;font-family:'Poppins',sans-serif}
.mobile-menu a:hover{color:hsl(47,96%,53%)}
.mobile-cities-list a{font-size:1rem;padding:8px 4px}
.mobile-cities-toggle.open .mobile-cities-list{display:block!important}
.mobile-cities-toggle.open .mobile-cities-arrow{transform:rotate(180deg)}
.mobile-cities-arrow{transition:transform .2s;display:inline-block}

/* Footer grid */
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:2rem;align-items:start}
.footer-link{display:block;text-decoration:none;padding:4px 0;font-size:.9rem;font-family:'Poppins',sans-serif;transition:color .2s}
.footer-link:hover{color:hsl(47,96%,53%)}

/* Responsive */
@media(max-width:900px){
  .primary-nav{display:none!important}
  .header-icons{display:none!important}
  .header-actions{display:none!important}
  .nav-toggle{display:inline-flex!important}
}
@media(max-width:600px){
  .footer-grid{grid-template-columns:1fr;gap:2rem;text-align:center}
  .footer-grid .footer-col:first-child{display:flex;flex-direction:column;align-items:center}
}
`;

let updated = 0;

for (const page of PAGES) {
  const path = resolve(ROOT, page);
  let html;
  try {
    html = readFileSync(path, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${page} (not found)`);
    continue;
  }

  // Remove old incomplete nav CSS if present
  html = html.replace(/\/\* ===== Unified Header\/Footer[\s\S]*?@media\s*\(max-width:600px\)\{[^}]*\{[^}]*\}[^}]*\}\s*\n/g, '');

  // Only add if not already present
  if (html.includes('Header/Footer layout')) {
    console.log(`SKIP: ${page} (already has nav layout CSS)`);
    continue;
  }

  // Insert before the closing </style>
  html = html.replace('</style>', NAV_LAYOUT_CSS + '\n</style>');

  writeFileSync(path, html);
  updated++;
  console.log(`OK: ${page}`);
}

console.log(`\nDone. Updated ${updated} pages.`);
