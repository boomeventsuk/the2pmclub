#!/usr/bin/env node
/**
 * test-cancellation-sync.js
 *
 * Fixture-based check for the cancellation-detection logic added to
 * scripts/sync-eventbrite-prices.js (JD, 2026-09-18). Exercises
 * applyCancellationState()/syncEventFields() directly against fake Eventbrite
 * responses, no network or token required, so the classification can be
 * proved before it ever touches a real event.
 *
 * Run: node scripts/test-cancellation-sync.js
 */
import { applyCancellationState, syncEventFields } from './sync-eventbrite-prices.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

// ---------- fixtures ----------

// All ticket classes UNAVAILABLE, mirroring the real 3rd October Luton
// defect: extractPriceData() alone would fall through to "Coming soon".
const ALL_UNAVAILABLE_TICKET_CLASSES = [
  {
    display_name: 'General Admission',
    category: 'admission',
    free: false,
    on_sale_status: 'UNAVAILABLE',
    cost: { value: 1000, major_value: '10.00', currency: 'GBP', display: '£10.00' },
    quantity_total: 100,
    quantity_sold: 0,
  },
];

function freshFixtureEvent() {
  return {
    title: 'THE 2PM CLUB Daytime Disco Test City',
    slug: '031026-2PM-TEST',
    eventbriteId: '9999999999999',
    start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days out, not "ended"
    location: 'Test Venue, Test City',
  };
}

// ---------- 1. applyCancellationState() in isolation ----------

{
  const event = freshFixtureEvent();
  const cancelled = applyCancellationState(event, 'canceled');
  check(cancelled === true, 'applyCancellationState: "canceled" status must return true');
  check(event.isCancelled === true, 'applyCancellationState: isCancelled must be set true');
  check(event.statusLabel === 'Cancelled', `applyCancellationState: statusLabel must be exactly "Cancelled", got "${event.statusLabel}"`);
  check(event.availability === 'https://schema.org/Discontinued', `applyCancellationState: availability must be Discontinued, got "${event.availability}"`);
}

{
  const event = freshFixtureEvent();
  const cancelled = applyCancellationState(event, 'deleted');
  check(cancelled === true, 'applyCancellationState: "deleted" status must return true');
  check(event.statusLabel === 'Cancelled', 'applyCancellationState: "deleted" must also force statusLabel "Cancelled"');
}

{
  const event = freshFixtureEvent();
  const cancelled = applyCancellationState(event, 'live');
  check(cancelled === false, 'applyCancellationState: "live" status must not cancel');
  check(event.isCancelled === undefined, 'applyCancellationState: "live" status must not set isCancelled');
  check(event.statusLabel === undefined, 'applyCancellationState: "live" status must not touch statusLabel');
}

// Fetch failure: eventStatus is null. Must never mark cancelled, and must
// leave whatever was already on the event object completely untouched.
{
  const event = freshFixtureEvent();
  event.statusLabel = 'Selling fast';
  event.availability = 'https://schema.org/InStock';
  const cancelled = applyCancellationState(event, null);
  check(cancelled === false, 'applyCancellationState: a failed fetch (null) must never cancel');
  check(event.isCancelled === undefined, 'applyCancellationState: a failed fetch must not set isCancelled');
  check(event.statusLabel === 'Selling fast', 'applyCancellationState: a failed fetch must leave existing statusLabel untouched');
  check(event.availability === 'https://schema.org/InStock', 'applyCancellationState: a failed fetch must leave existing availability untouched');
}

// Sticky: once cancelled, a later run that (somehow) sees a non-cancelled
// status must not un-cancel the event.
{
  const event = freshFixtureEvent();
  event.isCancelled = true;
  event.statusLabel = 'Cancelled';
  event.availability = 'https://schema.org/Discontinued';
  const cancelled = applyCancellationState(event, 'live');
  check(cancelled === true, 'applyCancellationState: sticky - already-cancelled event must stay cancelled even if status now reads "live"');
  check(event.statusLabel === 'Cancelled', 'applyCancellationState: sticky - statusLabel must remain "Cancelled"');
}

// ---------- 2. syncEventFields() end to end, the real defect scenario ----------
// All ticket classes UNAVAILABLE (would compute "Coming soon" alone) AND the
// event resource says canceled. Must end up isCancelled/Cancelled/Discontinued,
// never "Coming soon".

{
  const event = freshFixtureEvent();
  const { priceData, cancelled } = syncEventFields(event, ALL_UNAVAILABLE_TICKET_CLASSES, 'canceled');
  check(cancelled === true, 'syncEventFields: all-unavailable + canceled status must classify as cancelled');
  check(event.isCancelled === true, 'syncEventFields: isCancelled must be true');
  check(event.statusLabel === 'Cancelled', `syncEventFields: statusLabel must be "Cancelled", got "${event.statusLabel}" (this is the exact defect: it must NOT be "Coming soon")`);
  check(event.availability === 'https://schema.org/Discontinued', `syncEventFields: availability must be Discontinued, got "${event.availability}"`);
  check(event.tierLabels === undefined, 'syncEventFields: cancelled event must not carry tierLabels');
  check(event.groupTicket === undefined, 'syncEventFields: cancelled event must not carry groupTicket');
  check(event.urgencyLabel === undefined, 'syncEventFields: cancelled event must not carry urgencyLabel');
  check(priceData !== null, 'syncEventFields: priceData should still be extracted from the ticket classes for the price fields');
}

// Sanity: the SAME all-unavailable ticket classes, WITHOUT a cancellation,
// reproduce the original (pre-fix) "Coming soon" computed label - proves the
// fixture is a faithful reproduction of the original defect's ticket data.
{
  const event = freshFixtureEvent();
  const { cancelled } = syncEventFields(event, ALL_UNAVAILABLE_TICKET_CLASSES, 'live');
  check(cancelled === false, 'syncEventFields: "live" status on all-unavailable tickets must not cancel');
  check(event.statusLabel === 'Coming soon', `syncEventFields: uncancelled all-unavailable event should compute "Coming soon" (reproduces the original defect's baseline), got "${event.statusLabel}"`);
}

// Fetch-failure case: event-status fetch failed (null), ticket classes fetch
// succeeded normally (some available). Must sync price/status normally and
// never mark cancelled purely because the status fetch failed.
{
  const event = freshFixtureEvent();
  const availableTicketClasses = [
    {
      display_name: 'General Admission',
      category: 'admission',
      free: false,
      on_sale_status: 'AVAILABLE',
      cost: { value: 1000, major_value: '10.00', currency: 'GBP', display: '£10.00' },
      quantity_total: 100,
      quantity_sold: 5,
    },
  ];
  const { cancelled } = syncEventFields(event, availableTicketClasses, null);
  check(cancelled === false, 'syncEventFields: a failed status fetch must never mark cancelled');
  check(event.isCancelled === undefined, 'syncEventFields: a failed status fetch must not set isCancelled');
  check(event.statusLabel === 'Just announced', `syncEventFields: normal computed label must still apply when only the status fetch failed, got "${event.statusLabel}"`);
}

// Already-cancelled event on a later run: ticket classes now show fully
// SOLD_OUT (Eventbrite sometimes reflects this after cancellation) and the
// status fetch fails this time. Sticky field must survive untouched.
{
  const event = freshFixtureEvent();
  event.isCancelled = true;
  event.statusLabel = 'Cancelled';
  event.availability = 'https://schema.org/Discontinued';
  const { cancelled } = syncEventFields(event, ALL_UNAVAILABLE_TICKET_CLASSES, null);
  check(cancelled === true, 'syncEventFields: sticky isCancelled must survive a later run with a failed status fetch');
  check(event.statusLabel === 'Cancelled', 'syncEventFields: sticky statusLabel must survive a later run');
  check(event.availability === 'https://schema.org/Discontinued', 'syncEventFields: sticky availability must survive a later run');
}

// ---------- report ----------

if (failures.length) {
  console.error(`CHECK-CANCELLATION-SYNC FAIL`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('CHECK-CANCELLATION-SYNC PASS: 9 fixture scenarios');
