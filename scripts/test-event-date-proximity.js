#!/usr/bin/env node
/**
 * test-event-date-proximity.js
 *
 * Fixture-based check for the event page date-proximity banner wording added
 * on 18th September 2026, when the Coventry page the day before the event
 * still said nothing about it being tomorrow.
 *
 * Exercises src/lib/eventDateProximity.ts directly against simulated "now"
 * values, no network, no build and no browser, so the wording can be proved
 * for a real event before it ever reaches a customer. Also asserts the two
 * composition rules the page applies on top of the label: sold out and
 * cancelled events never get one, and a genuine last-tickets event keeps the
 * banner it had before.
 *
 * Run: node scripts/test-event-date-proximity.js
 */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { eventDateProximityLabel } from '../src/lib/eventDateProximity.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const events = JSON.parse(
  readFileSync(path.join(ROOT, 'public', 'events.json'), 'utf8')
);
const bySlug = (slug) => {
  const found = events.find((e) => e.slug === slug);
  if (!found) throw new Error(`Fixture event missing from public/events.json: ${slug}`);
  return found;
};

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
let scenarios = 0;

// Mirrors the composition in EventPageV2: what a visitor actually sees.
const banner = (event, now) => {
  if (event.isCancelled) return null;              // page returns the cancelled state
  const isSoldOut = event.status === 'sold-out';
  const isLastTickets = event.status === 'last-tickets';
  const dateProximityLabel = isSoldOut
    ? null
    : eventDateProximityLabel(event.start, now);
  const scarcityWording =
    event.urgencyLabel && !/just announced|general release/i.test(event.urgencyLabel)
      ? event.urgencyLabel
      : null;
  if (!(!isSoldOut && (isLastTickets || dateProximityLabel))) return null;
  return {
    headline: dateProximityLabel || event.urgencyLabel || 'Last Tickets',
    subline: dateProximityLabel && scarcityWording ? scarcityWording : "Don't miss out!",
    dateProximityLabel,
  };
};

const uk = (iso) => new Date(iso);

const expectLabel = (label, startIso, now, expected) => {
  scenarios += 1;
  const got = eventDateProximityLabel(startIso, uk(now));
  check(
    got === expected,
    `${label}: at ${now} expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`
  );
  console.log(`  ${got === expected ? 'ok  ' : 'FAIL'} ${label} @ ${now} -> ${JSON.stringify(got)}`);
};

// ---------- 1. The real Coventry event, 190926-2PM-COV ----------
// Saturday 19th September 2026, 14:00 +01:00. This is the event that was live
// with no proximity wording on the page the day before.

const cov = bySlug('190926-2PM-COV');
check(cov.start === '2026-09-19T14:00:00+01:00',
  `Coventry fixture start changed, expected 2026-09-19T14:00:00+01:00, got ${cov.start}`);

console.log('190926-2PM-COV (Sat 19th Sept 2026, 14:00 +01:00)');
expectLabel('Coventry', cov.start, '2026-09-18T09:00:00+01:00', 'TOMORROW');
expectLabel('Coventry', cov.start, '2026-09-18T23:59:00+01:00', 'TOMORROW');
expectLabel('Coventry', cov.start, '2026-09-19T07:00:00+01:00', 'TODAY');
expectLabel('Coventry', cov.start, '2026-09-19T20:00:00+01:00', 'TODAY');
expectLabel('Coventry', cov.start, '2026-09-15T12:00:00+01:00', 'THIS SATURDAY');
expectLabel('Coventry', cov.start, '2026-09-13T00:30:00+01:00', 'THIS SATURDAY');
expectLabel('Coventry', cov.start, '2026-09-12T18:00:00+01:00', 'NEXT SATURDAY');
expectLabel('Coventry', cov.start, '2026-09-07T09:00:00+01:00', 'NEXT SATURDAY');
// Sunday 6th Sept opens the week before the event's own week, so it is still
// the last day on which "next Saturday" is literally true.
expectLabel('Coventry', cov.start, '2026-09-06T23:00:00+01:00', 'NEXT SATURDAY');
// Saturday 5th Sept is two whole weeks out: scarcity leads, no date label.
expectLabel('Coventry', cov.start, '2026-09-05T23:00:00+01:00', null);
expectLabel('Coventry', cov.start, '2026-08-20T09:00:00+01:00', null);
// The day after, and beyond: never advertise an event that has been and gone.
expectLabel('Coventry', cov.start, '2026-09-20T09:00:00+01:00', null);
expectLabel('Coventry', cov.start, '2026-10-01T09:00:00+01:00', null);

// The banner a visitor sees on the Coventry page on 18th September.
{
  scenarios += 1;
  const seen = banner(cov, uk('2026-09-18T09:00:00+01:00'));
  check(seen !== null, 'Coventry on 18th Sept: urgency banner must render');
  check(seen && seen.headline === 'TOMORROW',
    `Coventry on 18th Sept: headline must be TOMORROW, got ${seen && JSON.stringify(seen.headline)}`);
  check(seen && seen.subline === 'SELLING FAST',
    `Coventry on 18th Sept: subline must carry the scarcity wording, got ${seen && JSON.stringify(seen.subline)}`);
  console.log(`  ok   Coventry banner @ 2026-09-18 -> ${JSON.stringify(seen)}`);
}

// Before the fix the gate was event.status === 'last-tickets' alone. Coventry
// is 'selling-fast-amber', so pin the exact reason the banner was missing.
{
  scenarios += 1;
  check(cov.status !== 'last-tickets',
    'Coventry fixture is expected to be a non-last-tickets status, which is why the old gate never fired');
  console.log(`  ok   Coventry status is "${cov.status}", not last-tickets: old gate could not fire`);
}

// ---------- 2. A far-future event keeps its existing behaviour ----------
// 281126-2PM-LEIC, Saturday 28th November 2026.

const leic = bySlug('281126-2PM-LEIC');
console.log('281126-2PM-LEIC (Sat 28th Nov 2026), far future');
expectLabel('Leicester', leic.start, '2026-09-18T09:00:00+01:00', null);
expectLabel('Leicester', leic.start, '2026-11-10T09:00:00+00:00', null);

{
  scenarios += 1;
  const seen = banner(leic, uk('2026-09-18T09:00:00+01:00'));
  check(seen === null,
    `Leicester on 18th Sept: no date label and not last-tickets, so no banner, got ${JSON.stringify(seen)}`);
  console.log('  ok   Leicester banner @ 2026-09-18 -> null (unchanged)');
}

// ---------- 3. Sold out gets no date label, even on the day ----------

{
  const soldOut = { ...cov, slug: 'FIXTURE-SOLD-OUT', status: 'sold-out' };
  for (const now of ['2026-09-18T09:00:00+01:00', '2026-09-19T09:00:00+01:00', '2026-09-15T09:00:00+01:00']) {
    scenarios += 1;
    const seen = banner(soldOut, uk(now));
    check(seen === null, `Sold out at ${now}: must get no date banner, got ${JSON.stringify(seen)}`);
  }
  console.log('  ok   sold-out event -> no date label on any of the 3 nearby dates');
}

// ---------- 4. Cancelled gets no date label, even on the day ----------

{
  const cancelled = {
    ...cov,
    slug: 'FIXTURE-CANCELLED',
    isCancelled: true,
    statusLabel: 'Cancelled',
    availability: 'https://schema.org/Discontinued',
  };
  delete cancelled.urgencyLabel;
  for (const now of ['2026-09-18T09:00:00+01:00', '2026-09-19T09:00:00+01:00', '2026-09-15T09:00:00+01:00']) {
    scenarios += 1;
    const seen = banner(cancelled, uk(now));
    check(seen === null, `Cancelled at ${now}: must get no date banner, got ${JSON.stringify(seen)}`);
  }
  console.log('  ok   cancelled event -> no date label on any of the 3 nearby dates');
}

// ---------- 5. A genuine last-tickets event is unchanged ----------

{
  const lastTickets = {
    slug: 'FIXTURE-LAST-TICKETS',
    start: '2027-06-12T14:00:00+01:00', // far future, so no date label interferes
    status: 'last-tickets',
    urgencyLabel: 'Last few tickets',
  };
  scenarios += 1;
  const seen = banner(lastTickets, uk('2026-09-18T09:00:00+01:00'));
  check(seen !== null, 'last-tickets: banner must still render with no date label');
  check(seen && seen.headline === 'Last few tickets',
    `last-tickets: headline must be the existing urgencyLabel, got ${seen && JSON.stringify(seen.headline)}`);
  check(seen && seen.subline === "Don't miss out!",
    `last-tickets: subline must be the existing generic line, got ${seen && JSON.stringify(seen.subline)}`);
  console.log(`  ok   last-tickets far future -> ${JSON.stringify(seen)} (identical to pre-change)`);

  // With no urgencyLabel at all it must still fall back exactly as before.
  scenarios += 1;
  const bare = banner({ ...lastTickets, urgencyLabel: undefined }, uk('2026-09-18T09:00:00+01:00'));
  check(bare && bare.headline === 'Last Tickets' && bare.subline === "Don't miss out!",
    `last-tickets with no urgencyLabel: must fall back to "Last Tickets" / "Don't miss out!", got ${JSON.stringify(bare)}`);
  console.log(`  ok   last-tickets, no urgencyLabel -> ${JSON.stringify(bare)} (identical to pre-change)`);

  // Both apply: date leads, scarcity moves to the second line.
  scenarios += 1;
  const both = banner({ ...lastTickets, start: cov.start }, uk('2026-09-18T09:00:00+01:00'));
  check(both && both.headline === 'TOMORROW' && both.subline === 'Last few tickets',
    `date + last-tickets: expected TOMORROW / Last few tickets, got ${JSON.stringify(both)}`);
  console.log(`  ok   date + last-tickets -> ${JSON.stringify(both)}`);
}

// ---------- 6. The weekday comes from the date, never hard-coded ----------

{
  const cases = [
    // Wed 16th Sept seen from Mon 14th Sept: same Sunday-anchored week.
    ['2026-09-16T19:00:00+01:00', '2026-09-14T09:00:00+01:00', 'THIS WEDNESDAY'],
    // Same event seen from Fri 11th Sept: the week before, so "next".
    ['2026-09-16T19:00:00+01:00', '2026-09-11T09:00:00+01:00', 'NEXT WEDNESDAY'],
    ['2026-09-25T19:00:00+01:00', '2026-09-21T09:00:00+01:00', 'THIS FRIDAY'],
    ['2026-09-25T19:00:00+01:00', '2026-09-19T09:00:00+01:00', 'NEXT FRIDAY'],
    // Sat 19th to Sun 20th: TOMORROW wins even across a week boundary.
    ['2026-09-20T14:00:00+01:00', '2026-09-19T09:00:00+01:00', 'TOMORROW'],
    // Christmas Day 2026 is a Friday, in GMT rather than BST.
    ['2026-12-25T14:00:00+00:00', '2026-12-21T09:00:00+00:00', 'THIS FRIDAY'],
  ];
  for (const [start, now, expected] of cases) {
    expectLabel('weekday-from-date', start, now, expected);
  }
}

// ---------- 7. Garbage in, silence out ----------

{
  for (const bad of ['', null, undefined, 'not-a-date']) {
    scenarios += 1;
    const got = eventDateProximityLabel(bad, uk('2026-09-18T09:00:00+01:00'));
    check(got === null, `invalid start ${JSON.stringify(bad)}: must return null, got ${JSON.stringify(got)}`);
  }
  console.log('  ok   empty / null / undefined / unparseable start -> null');
}

// ---------- report ----------

if (failures.length) {
  console.error('CHECK-EVENT-DATE-PROXIMITY FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`CHECK-EVENT-DATE-PROXIMITY PASS: ${scenarios} scenarios`);
