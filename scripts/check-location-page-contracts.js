#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { customerStatusLabel, formatUkEventTimeRange, ticketPriceWithFee } from './site-event-facts.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const events = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'upcoming-events.json'), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const event of events) {
  const time = formatUkEventTimeRange(event.start, event.end);
  check(time.startsWith('2pm to '), `${event.slug}: visible UK start is not 2pm (${time})`);
  const expectedEnd = ['051226-2PM-NPTON', '121226-2PM-NPTON'].includes(event.slug)
    ? '5:30pm'
    : '6pm';
  check(time.endsWith(expectedEnd), `${event.slug}: visible UK end is not ${expectedEnd} (${time})`);

  const dir = path.join(DIST, 'events', event.slug.toLowerCase());
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const json = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const canonical = `https://www.the2pmclub.co.uk/events/${event.slug.toLowerCase()}/`;
  check(html.includes(time), `${event.slug}: prerendered shell lacks ${time}`);
  check(html.includes(`hreflang="en-GB" href="${canonical}"`), `${event.slug}: hreflang is not self-referential`);
  check(json.displayTime === time, `${event.slug}: JSON endpoint time differs from visible time`);
  check(json.priceLabel === ticketPriceWithFee(event.priceLabel), `${event.slug}: JSON endpoint price wording differs`);
}

const hubHtml = fs.readdirSync(path.join(DIST, 'hubs'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => fs.readFileSync(path.join(DIST, 'hubs', entry.name, 'index.html'), 'utf8'))
  .join('\n');
check(!hubHtml.includes('M17 5H9.5'), 'dollar-style price icon remains on a location card');
check(!/Franklin'?s Gardens/i.test(hubHtml), 'Franklin\'s Gardens remains on Northampton page');
check(!/Consistent sell-outs|2-3x over|Three dates|Riverside car park|free parking directly outside|ample free parking right outside/i.test(hubHtml), 'known unsupported or stale location copy remains');
check(hubHtml.includes('From £13.50 + booking fee'), 'Northampton base price does not include booking-fee wording');
check(hubHtml.includes('Final 25 tickets'), 'Northampton Final 25 tickets decision is missing');
check(customerStatusLabel(events.find((event) => event.slug === '031026-2PM-NPTON')) === 'Final 25 tickets', 'Northampton status override is not stable');
check(events.every((event) => !('fullDescription' in event) && !('highlights' in event)), 'upcoming agent feed exposes stale campaign prose');
check(events.every((event) => event.displayTime === formatUkEventTimeRange(event.start, event.end)), 'upcoming agent feed display time is not UK-stable');
check(events.every((event) => /\+ booking fee$/i.test(event.priceLabel || '')), 'upcoming agent feed omits booking-fee wording');

const css = fs.readFileSync(path.join(DIST, 'shared-styles.css'), 'utf8');
check(css.includes('.faq-button'), 'location FAQ buttons are not styled');

const trustStrip = fs.readFileSync(path.join(ROOT, 'src', 'components', 'TrustStrip.tsx'), 'utf8');
check(!/Selling out across the Midlands/i.test(trustStrip), 'unsupported global sell-out trust claim remains');
check(/Daytime discos since 2024/i.test(trustStrip), 'approved daytime disco history is missing');

const llms = fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8');
check(llms.includes('upcoming-events.json'), 'agent guidance does not point to the upcoming-only feed');
check(!/sell out regularly|consistently sell out/i.test(llms), 'unsupported sell-out claim remains in agent guidance');

if (failures.length) {
  console.error(`CHECK-2PM-LOCATION-PAGES FAIL (${process.env.TZ || 'default'})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`CHECK-2PM-LOCATION-PAGES PASS (${process.env.TZ || 'default'}): ${events.length} events, 6 hubs`);
