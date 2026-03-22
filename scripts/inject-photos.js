#!/usr/bin/env node
/**
 * Injects real event photos from Bunny.net CDN into all static pages.
 * Adds hero banners, photo grids, and inline images.
 * Uses Bunny.net query params for WebP conversion and resizing.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

// Bunny.net optimisation suffix: resize to 1200px wide, 80% quality
const OPT = '?width=1200&quality=80';
const OPT_THUMB = '?width=600&quality=75';

// Best photos per venue (curated from Notion photo library)
const PHOTOS = {
  northampton: {
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-confetti-cannon-disco-ball-green-lights.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-overhead-dancers-green-lighting.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-five-friends-drinks-microphone-pink-lights.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-four-friends-posing-2pm-inflatables.jpeg',
    ]
  },
  bedford: {
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-wide-venue-packed-dancefloor-2pm-branding.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-packed-dancefloor-arms-up-glow-sticks.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-woman-curly-hair-hand-raised-crowd.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-mixed-group-friends-hugging-celebrating.jpeg',
    ]
  },
  coventry: {
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-full-venue-2pm-stage-branding-lights.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-woman-gold-dress-arms-wide-dancing-crowd.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-crowd-confetti-cannon-arms-raised-stage.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-crowd-arms-raised-drinks-confetti-disco-ball.jpeg',
    ]
  },
  'milton-keynes': {
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-wide-crowd-green-sparkly-pink-wig-2pm-branding.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-full-venue-dj-screen-2pm-branding-crowd-arms-raised.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-blonde-woman-leopard-top-inflatable-mic-laughing.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-full-venue-packed-dancefloor-dj-stage-coloured-lights.jpeg',
    ]
  },
  luton: {
    // No Luton photos yet, use best general shots
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-full-venue-dj-screen-2pm-branding-crowd-arms-raised.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-crowd-confetti-cannon-arms-raised-stage.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-packed-dancefloor-arms-up-glow-sticks.jpeg',
    ]
  },
  leicester: {
    // No Leicester photos yet, use best general shots
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-full-venue-2pm-stage-branding-lights.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-confetti-cannon-disco-ball-green-lights.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-blonde-woman-leopard-top-inflatable-mic-laughing.jpeg',
    ]
  },
  general: {
    hero: 'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-full-venue-dj-screen-2pm-branding-crowd-arms-raised.jpeg',
    supporting: [
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-woman-gold-dress-arms-wide-dancing-crowd.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-overhead-dancers-green-lighting.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140226-2PM-BED-mixed-group-friends-hugging-celebrating.jpeg',
      'https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/140326-2PM-MK-wide-crowd-green-sparkly-pink-wig-2pm-branding.jpeg',
    ]
  }
};

// Hero banner HTML
function heroHTML(url, alt) {
  return `
<!-- Hero Photo -->
<div style="margin-bottom:2rem;border-radius:.75rem;overflow:hidden;max-height:400px">
  <img src="${url}${OPT}" alt="${alt}" style="width:100%;height:400px;object-fit:cover;display:block" loading="eager">
</div>`;
}

// Photo grid HTML (2 or 3 images)
function photoGridHTML(urls, city) {
  const cols = urls.length >= 3 ? 3 : 2;
  const imgs = urls.slice(0, cols).map((u, i) =>
    `<div style="border-radius:.5rem;overflow:hidden"><img src="${u}${OPT_THUMB}" alt="THE 2PM CLUB event${city ? ' in ' + city : ''}" style="width:100%;height:220px;object-fit:cover;display:block" loading="lazy"></div>`
  ).join('\n    ');
  return `
<!-- Event Photos -->
<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:1rem;margin:2rem 0">
    ${imgs}
</div>`;
}

// CSS for photo elements
const PHOTO_CSS = `
/* Photo elements */
@media(max-width:600px){
  div[style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr!important}
  div[style*="grid-template-columns:repeat(2"]{grid-template-columns:1fr!important}
  div[style*="max-height:400px"] img{height:250px!important}
}
`;

// Process each page
const pages = {
  'public/hubs/northampton/index.html': 'northampton',
  'public/hubs/bedford/index.html': 'bedford',
  'public/hubs/coventry/index.html': 'coventry',
  'public/hubs/milton-keynes/index.html': 'milton-keynes',
  'public/hubs/luton/index.html': 'luton',
  'public/hubs/leicester/index.html': 'leicester',
  'public/what-to-expect/index.html': 'general',
  'public/group-bookings/index.html': 'general',
  'public/faqs/index.html': 'general',
};

let updated = 0;

for (const [page, photoKey] of Object.entries(pages)) {
  const path = resolve(ROOT, page);
  let html;
  try {
    html = readFileSync(path, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${page} (not found)`);
    continue;
  }

  // Skip if already has event photos
  if (html.includes('<!-- Hero Photo -->')) {
    console.log(`SKIP: ${page} (already has photos)`);
    continue;
  }

  const photos = PHOTOS[photoKey];
  if (!photos) {
    console.log(`SKIP: ${page} (no photos for ${photoKey})`);
    continue;
  }

  const cityName = photoKey === 'general' ? '' :
    photoKey.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  // Add photo CSS
  if (!html.includes('Photo elements')) {
    html = html.replace('</style>', PHOTO_CSS + '</style>');
  }

  // Insert hero after the first card (hero card)
  // Find the end of the first bg-card div (hero section)
  const heroCardEnd = html.indexOf('</div>', html.indexOf('bg-card rounded-2xl'));
  if (heroCardEnd > -1) {
    const insertPoint = html.indexOf('</div>', heroCardEnd + 6); // after the margin wrapper
    if (insertPoint > -1) {
      // Find the next card section
      const nextCard = html.indexOf('<div class="bg-card', heroCardEnd + 6);
      if (nextCard > -1) {
        const heroBlock = heroHTML(photos.hero, `THE 2PM CLUB daytime disco${cityName ? ' in ' + cityName : ''}`);
        html = html.slice(0, nextCard) + heroBlock + '\n\n' + html.slice(nextCard);
      }
    }
  }

  // Insert photo grid before the footer
  if (photos.supporting.length > 0) {
    const footerPos = html.indexOf('<!-- Footer -->');
    if (footerPos > -1) {
      const gridBlock = `
<!-- Real event photos -->
<div class="container mx-auto max-w-4xl px-4" style="margin-bottom:2rem">
  <h3 style="font-family:'Bebas Neue',cursive;font-size:1.5rem;text-align:center;margin-bottom:1rem;color:hsl(var(--foreground))">REAL PHOTOS. REAL EVENTS. REAL PEOPLE.</h3>
  ${photoGridHTML(photos.supporting, cityName)}
</div>
`;
      html = html.slice(0, footerPos) + gridBlock + '\n' + html.slice(footerPos);
    }
  }

  writeFileSync(path, html);
  updated++;
  console.log(`OK: ${page} (${photoKey})`);
}

console.log(`\nDone. Updated ${updated} pages with event photos.`);
