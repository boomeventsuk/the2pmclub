#!/usr/bin/env node
/**
 * Removes duplicate header/nav from all static pages.
 * The rebuild-design.js script inserted the new header but didn't
 * fully remove the old one. This script strips the old header block.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

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

let fixed = 0;

for (const page of PAGES) {
  const fullPath = resolve(ROOT, page);
  let html;
  try {
    html = readFileSync(fullPath, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${page} (not found)`);
    continue;
  }

  // Count headers
  const headerCount = (html.match(/<header/g) || []).length;
  if (headerCount <= 1) {
    console.log(`OK: ${page} (single header)`);
    continue;
  }

  // Strategy: keep the FIRST header block (new one from rebuild-design.js)
  // and remove the SECOND header block (old one)

  // Find the end of the first header block (includes spacer div)
  const firstHeaderEnd = html.indexOf('<!-- spacer for fixed header -->');
  if (firstHeaderEnd === -1) {
    console.log(`WARN: ${page} (no spacer comment found, skipping)`);
    continue;
  }
  const spacerEnd = html.indexOf('\n', firstHeaderEnd) + 1;

  // Find where the old header starts (it's the content between spacer and main content)
  // The old header typically starts with a <div class="container... header-inner">
  // and ends just before <!-- Main Content --> or <main
  const mainContentMarkers = ['<!-- Main Content -->', '<main'];
  let mainStart = -1;
  for (const marker of mainContentMarkers) {
    const pos = html.indexOf(marker, spacerEnd);
    if (pos > -1 && (mainStart === -1 || pos < mainStart)) {
      mainStart = pos;
    }
  }

  if (mainStart === -1) {
    // Try finding the first content div after the old header
    const firstCard = html.indexOf('<div class="card"', spacerEnd);
    const firstGlass = html.indexOf('<div class="glass-card"', spacerEnd);
    mainStart = Math.min(
      firstCard > -1 ? firstCard : 99999,
      firstGlass > -1 ? firstGlass : 99999
    );
    if (mainStart === 99999) {
      console.log(`WARN: ${page} (can't find main content start, skipping)`);
      continue;
    }
  }

  // The old header block is everything between spacerEnd and mainStart
  const oldHeaderBlock = html.slice(spacerEnd, mainStart);

  // Verify it contains header-like content
  if (oldHeaderBlock.includes('header-inner') || oldHeaderBlock.includes('<nav') || oldHeaderBlock.includes('</header>')) {
    html = html.slice(0, spacerEnd) + '\n' + html.slice(mainStart);
    writeFileSync(fullPath, html);
    fixed++;
    console.log(`FIXED: ${page} (removed ${oldHeaderBlock.length} chars of old header)`);
  } else {
    console.log(`OK: ${page} (no old header found between spacer and main)`);
  }
}

// Also fix the double footer if present
for (const page of PAGES) {
  const fullPath = resolve(ROOT, page);
  let html;
  try {
    html = readFileSync(fullPath, 'utf-8');
  } catch (e) { continue; }

  const footerCount = (html.match(/<footer/g) || []).length;
  if (footerCount <= 1) continue;

  // Keep the LAST footer (the new one from rebuild-design.js)
  // Remove any earlier footer blocks
  const firstFooter = html.indexOf('<footer');
  const lastFooter = html.lastIndexOf('<footer');

  if (firstFooter !== lastFooter) {
    const firstFooterEnd = html.indexOf('</footer>', firstFooter) + '</footer>'.length;
    html = html.slice(0, firstFooter) + html.slice(firstFooterEnd);
    writeFileSync(fullPath, html);
    console.log(`FIXED: ${page} (removed duplicate footer)`);
    fixed++;
  }
}

console.log(`\nDone. Fixed ${fixed} pages.`);
