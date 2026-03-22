#!/usr/bin/env node
/**
 * Rebuilds all static pages with the correct cerise pink design system.
 * Replaces old gold/navy CSS variables, header, and footer.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

// All static pages to update
const PAGES = [
  'public/hubs/northampton/index.html',
  'public/hubs/bedford/index.html',
  'public/hubs/coventry/index.html',
  'public/hubs/milton-keynes/index.html',
  'public/hubs/luton/index.html',
  'public/hubs/leicester/index.html',
  'public/what-to-expect/index.html',
  'public/group-bookings/index.html',
  'public/faqs/index.html',
  'public/for-ai/index.html',
  'public/blog/what-is-a-daytime-disco/index.html',
  'public/blog/hen-do-daytime-disco/index.html',
  'public/blog/why-daytime-discos-are-popular/index.html',
];

// ============================================
// CORRECT CSS DESIGN TOKENS (from Lovable)
// ============================================
const DESIGN_TOKENS = `
/* ============================================
   THE 2PM CLUB -- Design System Tokens
   Resolved from Tailwind config + index.css
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --background: 242 12% 4%;
  --foreground: 0 0% 100%;
  --card: 240 12% 8%;
  --card-foreground: 0 0% 100%;
  --primary: 328 100% 54%;
  --primary-foreground: 0 0% 100%;
  --secondary: 207 100% 60%;
  --secondary-foreground: 0 0% 100%;
  --muted: 240 12% 15%;
  --muted-foreground: 0 0% 70%;
  --accent: 328 100% 54%;
  --accent-foreground: 0 0% 100%;
  --border: 240 12% 20%;
  --input: 240 12% 20%;
  --ring: 207 100% 60%;
  --popover: 240 12% 12%;
  --popover-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --radius: 0.75rem;
}

*, *::before, *::after { box-sizing: border-box; border-color: hsl(var(--border)); }

body {
  margin: 0;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1 { font-family: 'Poppins', sans-serif; font-size: 2.25rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; color: #FFFFFF; margin: 0 0 1rem; }
h2 { font-family: 'Poppins', sans-serif; font-size: 1.875rem; font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; color: #FFFFFF; margin: 0 0 0.75rem; }
h3 { font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; color: #FFFFFF; margin: 0 0 0.5rem; }
p, li { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.6; color: #FFFFFF; }
a { color: hsl(var(--primary)); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

/* Card styles */
.glass-card {
  background: hsl(240 12% 8% / 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid hsl(240 12% 20% / 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px hsl(0 0% 0% / 0.3);
  padding: 2rem;
  margin-bottom: 1.5rem;
}
.card {
  background: hsl(240 12% 8%);
  border: 1px solid hsl(240 12% 20%);
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px hsl(0 0% 0% / 0.3);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

/* Primary CTA Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  min-height: 2.75rem;
  background-color: hsl(328 100% 54%);
  color: #FFFFFF;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  border: none;
  border-radius: calc(0.75rem - 2px);
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.btn-primary:hover { background-color: hsl(328 100% 54% / 0.9); text-decoration: none; }

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  border-radius: 9999px;
  min-height: 3.25rem;
}

/* Text colours */
.text-muted { color: hsl(0 0% 70%); }
.text-primary { color: hsl(328 100% 54%); }
.text-secondary { color: hsl(207 100% 60%); }

/* Photo elements */
@media(max-width:600px){
  .photo-grid-3{grid-template-columns:1fr!important}
  .photo-grid-2{grid-template-columns:1fr!important}
  .hero-photo img{height:250px!important}
}

/* ============================================
   HEADER
   ============================================ */
.site-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background: hsl(242 12% 4% / 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid hsl(240 12% 20%);
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}
.site-logo img { height: 40px; width: auto; }
.primary-nav {
  display: flex;
  gap: 28px;
  margin-left: auto;
  align-items: center;
}
.primary-nav a, .locations-trigger {
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: hsl(0 0% 70%);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
}
.primary-nav a:hover, .locations-trigger:hover { color: hsl(328 100% 54%); text-decoration: none; }
.header-actions { display: flex; gap: 12px; align-items: center; margin-left: 18px; }
.header-icons { display: flex; gap: 12px; align-items: center; }
.header-icons a { display: inline-flex; width: 22px; height: 22px; opacity: 0.9; }
.header-icons a:hover { opacity: 1; }
.header-icons svg { width: 22px; height: 22px; fill: #fff; }
.nav-toggle {
  display: none;
  background: transparent;
  border: 0;
  padding: 8px;
  margin-left: 8px;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

/* Locations dropdown */
.locations-dropdown { position: relative; display: inline-flex; align-items: center; }
.locations-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  padding: 8px 0;
  margin-top: 8px;
  background: #13131A;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 100;
}
.locations-dropdown:hover .locations-dropdown-menu { display: block; }
.locations-dropdown-item {
  display: block;
  padding: 8px 16px;
  color: rgba(255,255,255,0.7);
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}
.locations-dropdown-item:hover { color: #fff; background: rgba(255,255,255,0.06); text-decoration: none; }

/* Mobile */
.mobile-menu { display: none; }
@media (max-width: 900px) {
  .primary-nav { display: none; }
  .header-icons { display: none; }
  .nav-toggle { display: inline-flex; }
  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 60;
    background: #0B0B0F;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 12px 16px;
  }
  body.nav-open .mobile-menu { display: block; }
  .mobile-menu a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 4px;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: hsl(328 100% 54%); }
  .mobile-menu button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 4px;
    background: none;
    border: none;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
    cursor: pointer;
  }
  .locations-sub a { padding-left: 16px; color: hsl(0 0% 70%); font-size: 1rem; }
}

/* ============================================
   FOOTER
   ============================================ */
.site-footer {
  background: hsl(240 12% 8%);
  border-top: 1px solid hsl(240 12% 20%);
  padding: 3rem 0;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}
@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; text-align: center; } }
.footer-heading { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 600; color: #FFFFFF; margin-bottom: 1rem; }
.footer-link {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: hsl(0 0% 70%);
  text-decoration: none;
  padding: 0.375rem 0;
  transition: color 0.2s;
}
.footer-link:hover { color: hsl(328 100% 54%); }
.footer-copyright {
  max-width: 1400px;
  margin: 3rem auto 0;
  padding: 2rem 2rem 0;
  border-top: 1px solid hsl(240 12% 20%);
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: hsl(0 0% 70%);
}
`;

// ============================================
// HEADER HTML
// ============================================
const HEADER_HTML = `<!-- Header -->
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="site-logo">
      <img src="https://boombastic-events.b-cdn.net/2PM%20CLUB/2pm-logo-full-white.png" alt="THE 2PM CLUB" height="40">
    </a>
    <nav class="primary-nav">
      <a href="/#tickets">Events</a>
      <div class="locations-dropdown">
        <button class="locations-trigger">Locations &#9662;</button>
        <div class="locations-dropdown-menu">
          <a href="/hubs/northampton/" class="locations-dropdown-item">Northampton</a>
          <a href="/hubs/bedford/" class="locations-dropdown-item">Bedford</a>
          <a href="/hubs/milton-keynes/" class="locations-dropdown-item">Milton Keynes</a>
          <a href="/hubs/coventry/" class="locations-dropdown-item">Coventry</a>
          <a href="/hubs/luton/" class="locations-dropdown-item">Luton</a>
          <a href="/hubs/leicester/" class="locations-dropdown-item">Leicester</a>
        </div>
      </div>
      <a href="/what-to-expect/">What to Expect</a>
      <a href="/group-bookings/">Group Bookings</a>
      <a href="/faqs/">FAQs</a>
    </nav>
    <div class="header-actions">
      <div class="header-icons">
        <a href="https://www.facebook.com/the2pmclub" target="_blank" rel="noopener" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="mailto:hello@boomevents.co.uk" aria-label="Email us">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
      </div>
      <a href="/#tickets" class="btn-primary" style="font-size:0.8125rem;padding:0.375rem 0.75rem">Book Tickets</a>
    </div>
    <button class="nav-toggle" onclick="document.body.classList.toggle('nav-open')" aria-label="Menu">&#9776;</button>
    <div class="mobile-menu">
      <a href="/#tickets">Events</a>
      <div>
        <button onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block'">Locations <span>&#9662;</span></button>
        <div class="locations-sub" style="display:none">
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
    </div>
  </div>
</header>
<div style="height:72px"></div><!-- spacer for fixed header -->`;

// ============================================
// FOOTER HTML
// ============================================
const FOOTER_HTML = `<!-- Footer -->
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <p class="footer-heading">THE 2PM CLUB</p>
      <p style="font-size:0.875rem;color:hsl(0 0% 70%);margin:0 0 1rem">Night-out energy, home by 7.</p>
      <p style="font-size:0.875rem;margin:0"><a href="mailto:hello@boomevents.co.uk" class="footer-link" style="display:inline">hello@boomevents.co.uk</a></p>
    </div>
    <div>
      <p class="footer-heading">Explore</p>
      <a href="/what-to-expect/" class="footer-link">What to Expect</a>
      <a href="/group-bookings/" class="footer-link">Group Bookings</a>
      <a href="/faqs/" class="footer-link">FAQs</a>
      <a href="/blog/why-daytime-discos-are-popular/" class="footer-link">Blog</a>
    </div>
    <div>
      <p class="footer-heading">Locations</p>
      <a href="/hubs/northampton/" class="footer-link">Northampton</a>
      <a href="/hubs/bedford/" class="footer-link">Bedford</a>
      <a href="/hubs/milton-keynes/" class="footer-link">Milton Keynes</a>
      <a href="/hubs/coventry/" class="footer-link">Coventry</a>
      <a href="/hubs/luton/" class="footer-link">Luton</a>
      <a href="/hubs/leicester/" class="footer-link">Leicester</a>
    </div>
  </div>
  <p class="footer-copyright">&copy; 2026 Boombastic Events Ltd. All rights reserved.</p>
</footer>`;


function processPage(pagePath) {
  const fullPath = resolve(ROOT, pagePath);
  let html;
  try {
    html = readFileSync(fullPath, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${pagePath} (not found)`);
    return false;
  }

  // 1. Replace everything between <style> and </style> with new design tokens
  // Keep any page-specific styles that aren't in the root block
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    // Extract any page-specific CSS that isn't part of the design system
    const existingCSS = styleMatch[1];

    // Keep accordion/toggle styles if present
    let pageSpecificCSS = '';
    const accordionMatch = existingCSS.match(/(\/\* FAQ accordion[\s\S]*?)(?=\/\*|$)/);
    if (accordionMatch) pageSpecificCSS += accordionMatch[1];
    const toggleMatch = existingCSS.match(/(\.faq-toggle[\s\S]*?)(?=\/\*|$)/);
    if (toggleMatch && !pageSpecificCSS.includes('faq-toggle')) pageSpecificCSS += toggleMatch[1];
    // Keep share button styles
    const shareMatch = existingCSS.match(/(\.share-buttons[\s\S]*?)(?=\/\*|$)/);
    if (shareMatch) pageSpecificCSS += shareMatch[1];

    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/, `<style>${DESIGN_TOKENS}\n${pageSpecificCSS}</style>`);
  }

  // 2. Replace old header (everything from first <nav or <header to the spacer div)
  // Look for existing header patterns
  const headerPatterns = [
    /<!-- Header -->[\s\S]*?<!-- spacer[^>]*>[\s\S]*?<\/div>/i,
    /<!-- Nav -->[\s\S]*?<div style="height:\d+px"><\/div>/i,
    /<nav[\s\S]*?<\/nav>\s*<div style="height:\d+px"><\/div>/i,
    /<header[\s\S]*?<\/header>\s*<div style="height:\d+px"><\/div>/i,
  ];

  let headerReplaced = false;
  for (const pattern of headerPatterns) {
    if (pattern.test(html)) {
      html = html.replace(pattern, HEADER_HTML);
      headerReplaced = true;
      break;
    }
  }

  if (!headerReplaced) {
    // Try broader pattern: anything that looks like a nav at the top of body
    const bodyMatch = html.match(/(<body[^>]*>)/i);
    if (bodyMatch) {
      // Find where the main content starts (first <main or first .container after nav)
      const afterBody = html.indexOf(bodyMatch[0]) + bodyMatch[0].length;
      const mainStart = html.indexOf('<main', afterBody);
      const firstContainer = html.indexOf('class="container', afterBody);
      const contentStart = Math.min(
        mainStart > -1 ? mainStart : 99999,
        firstContainer > -1 ? firstContainer : 99999
      );

      if (contentStart < 99999) {
        // Find the start of the element containing the container
        let elemStart = contentStart;
        while (elemStart > afterBody && html[elemStart] !== '<') elemStart--;

        // Replace everything between <body> and the content start
        const before = html.slice(afterBody, elemStart).trim();
        if (before.length > 0) {
          html = html.slice(0, afterBody) + '\n' + HEADER_HTML + '\n' + html.slice(elemStart);
          headerReplaced = true;
        }
      }
    }
  }

  // 3. Replace old footer
  const footerPatterns = [
    /<!-- Footer -->[\s\S]*?<\/footer>/i,
    /<footer[\s\S]*?<\/footer>/i,
  ];

  let footerReplaced = false;
  for (const pattern of footerPatterns) {
    if (pattern.test(html)) {
      html = html.replace(pattern, FOOTER_HTML);
      footerReplaced = true;
      break;
    }
  }

  // 4. Replace old class names with new ones
  // Old: bg-card rounded-2xl -> new: card or glass-card
  html = html.replace(/class="bg-card rounded-2xl[^"]*"/g, 'class="card"');

  // Old button styles -> new btn-primary
  html = html.replace(/class="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full text-xl font-bold[^"]*"/g, 'class="btn-primary btn-large"');
  html = html.replace(/class="inline-block bg-gradient-to-r from-primary to-secondary text-secondary-foreground px-8 py-4 rounded-full text-xl font-bold[^"]*"/g, 'class="btn-primary btn-large"');

  // 5. Fix any old Bebas Neue references to Poppins
  html = html.replace(/font-family:\s*['"]?Bebas Neue['"]?\s*,\s*cursive/g, "font-family:'Poppins',sans-serif");
  html = html.replace(/font-family:\s*'Bebas Neue'\s*,\s*cursive/g, "font-family:'Poppins',sans-serif");

  // 6. Fix old gold colour references
  html = html.replace(/hsl\(47[\s,]+96%[\s,]+53%\)/g, 'hsl(328 100% 54%)');   // old gold -> cerise
  html = html.replace(/hsl\(47,\s*96%,\s*53%\)/g, 'hsl(328, 100%, 54%)');
  html = html.replace(/#F0C640/gi, '#FF1493');                                    // old gold hex -> cerise hex
  html = html.replace(/hsl\(222\.2[\s,]+84%[\s,]+4\.9%\)/g, 'hsl(242 12% 4%)'); // old navy -> new bg

  // 7. Add padding-top to main content area for fixed header
  // (header spacer is already in HEADER_HTML)

  writeFileSync(fullPath, html);
  return true;
}

let updated = 0;
for (const page of PAGES) {
  if (processPage(page)) {
    updated++;
    console.log(`OK: ${page}`);
  }
}

console.log(`\nDone. Updated ${updated} pages with correct design tokens.`);
