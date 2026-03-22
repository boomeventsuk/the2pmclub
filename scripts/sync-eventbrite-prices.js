#!/usr/bin/env node
/**
 * sync-eventbrite-prices.js
 *
 * Pulls live ticket pricing and availability from Eventbrite API
 * and enriches events.json with structured price data.
 *
 * Run: node scripts/sync-eventbrite-prices.js
 * Requires: EVENTBRITE_TOKEN env var (or .env.local file)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EVENTS_PATH = resolve(ROOT, 'public/events.json');
const INTERNAL_PATH = resolve(ROOT, 'scripts/.ticket-data-internal.json');

// Load token from env or .env.local
function loadToken() {
  if (process.env.EVENTBRITE_TOKEN) return process.env.EVENTBRITE_TOKEN;

  const envLocal = resolve(ROOT, '.env.local');
  if (existsSync(envLocal)) {
    const lines = readFileSync(envLocal, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^EVENTBRITE_TOKEN=(.+)$/);
      if (match) return match[1].trim();
    }
  }

  throw new Error('EVENTBRITE_TOKEN not found in environment or .env.local');
}

async function fetchTicketClasses(eventbriteId, token) {
  const url = `https://www.eventbriteapi.com/v3/events/${eventbriteId}/ticket_classes/`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn(`  WARNING: Eventbrite API returned ${res.status} for event ${eventbriteId}`);
    return null;
  }

  const data = await res.json();
  return data.ticket_classes || [];
}

function extractPriceData(ticketClasses, eventDate) {
  if (!ticketClasses || ticketClasses.length === 0) return null;

  // Filter to admission tickets only (ignore donations, etc.)
  const admission = ticketClasses.filter(tc => tc.category === 'admission' && !tc.free);
  if (admission.length === 0) return null;

  // Find the cheapest available ticket (or cheapest overall if none available)
  const available = admission.filter(tc => tc.on_sale_status === 'AVAILABLE');
  const source = available.length > 0 ? available : admission;
  const cheapest = source.reduce((min, tc) =>
    tc.cost.value < min.cost.value ? tc : min, source[0]);

  // ============================================================
  // ATTENDEE-BASED capacity (not ticket count)
  // Group tickets (e.g. "Group of 4") represent multiple attendees.
  // A ticket named "Group of 4" with qty 25 = 100 attendee spots.
  // All percentages and thresholds use attendee counts.
  // ============================================================

  function attendeesPerTicket(tc) {
    const name = (tc.display_name || tc.name || '').toLowerCase();
    // Match "group of 4", "4 tickets", "group (4)", etc.
    const groupMatch = name.match(/(?:group|bundle|pack)\s*(?:of\s*)?(\d+)|(\d+)\s*(?:ticket|person|people)/);
    if (groupMatch) return parseInt(groupMatch[1] || groupMatch[2], 10);
    return 1;
  }

  const tiers = admission.map(tc => {
    const multiplier = attendeesPerTicket(tc);
    return {
      name: tc.display_name || tc.name,
      price: parseFloat(tc.cost.major_value),
      status: tc.on_sale_status,
      ticketCapacity: tc.quantity_total,
      ticketSold: tc.quantity_sold,
      attendeesPerTicket: multiplier,
      attendeeCapacity: (tc.quantity_total || 0) * multiplier,
      attendeeSold: (tc.quantity_sold || 0) * multiplier,
      attendeeRemaining: ((tc.quantity_total || 0) - (tc.quantity_sold || 0)) * multiplier
    };
  });

  const totalAttendeeCapacity = tiers.reduce((sum, t) => sum + t.attendeeCapacity, 0);
  const totalAttendeeSold = tiers.reduce((sum, t) => sum + t.attendeeSold, 0);
  const totalAttendeeRemaining = totalAttendeeCapacity - totalAttendeeSold;
  const percentSold = totalAttendeeCapacity > 0 ? (totalAttendeeSold / totalAttendeeCapacity) * 100 : 0;

  const allSoldOut = admission.every(tc => tc.on_sale_status === 'SOLD_OUT');
  const anyAvailable = admission.some(tc => tc.on_sale_status === 'AVAILABLE');

  // ============================================================
  // Time awareness: is this event "this Saturday"?
  // From the Sunday before the event, it counts as event week.
  // ============================================================

  const now = new Date();
  const eventDay = eventDate ? new Date(eventDate) : null;
  const daysUntil = eventDay ? Math.ceil((eventDay - now) / (1000 * 60 * 60 * 24)) : 999;

  // "Event week" = from the Sunday before the event day
  // If event is Saturday, event week starts the preceding Sunday (6 days before)
  let isEventWeek = false;
  if (eventDay) {
    const eventDayOfWeek = eventDay.getDay(); // 0=Sun, 6=Sat
    const sundayBefore = new Date(eventDay);
    sundayBefore.setDate(eventDay.getDate() - (eventDayOfWeek === 0 ? 0 : eventDayOfWeek));
    sundayBefore.setHours(0, 0, 0, 0);
    isEventWeek = now >= sundayBefore && now <= eventDay;
  }

  // ============================================================
  // JD's urgency curve (v3)
  //
  // Phase 1: "Just announced"      - early days, low sales
  // Phase 2: "Selling fast"        - 15%+ sold, building momentum
  // Phase 3: "75% sold"            - really at 67% (1/3 left)
  // Phase 4: "Final 50 tickets"    - really 70 attendees left
  // Phase 5: "Final 25 tickets"    - really 40 attendees left
  // Phase 6: "Final tickets"       - event week fallback
  // Phase 7: "Join waiting list"   - sold out
  //
  // Numbered callouts (4/5) take priority over event-week (6).
  // All thresholds based on ATTENDEE count, not ticket count.
  // ============================================================

  let statusLabel;
  let schemaAvailability;

  if (allSoldOut || totalAttendeeRemaining === 0) {
    statusLabel = 'Join waiting list';
    schemaAvailability = 'https://schema.org/SoldOut';
  } else if (totalAttendeeRemaining <= 40) {
    // Reality: 40 attendees left. Say: final 25
    statusLabel = 'Final 25 tickets';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (totalAttendeeRemaining <= 70) {
    // Reality: 70 attendees left. Say: final 50
    statusLabel = 'Final 50 tickets';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (isEventWeek) {
    // Event week, plenty of stock: generic urgency
    statusLabel = 'Final tickets';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (percentSold >= 67) {
    // Reality: 1/3 left. Tell them: 75% sold
    statusLabel = '75% sold';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (percentSold >= 15) {
    // Real traction. General urgency.
    statusLabel = 'Selling fast';
    schemaAvailability = 'https://schema.org/InStock';
  } else if (anyAvailable) {
    // Early days, low sales
    statusLabel = 'Just announced';
    schemaAvailability = 'https://schema.org/InStock';
  } else {
    statusLabel = 'Coming soon';
    schemaAvailability = 'https://schema.org/PreOrder';
  }

  // Tier-level status labels (e.g. "Early bird sold out")
  const tierLabels = tiers
    .filter(t => t.status === 'SOLD_OUT')
    .map(t => `${t.name} sold out`);

  return {
    // Public fields (written to events.json)
    public: {
      price: parseFloat(cheapest.cost.major_value),
      priceCurrency: cheapest.cost.currency,
      priceLabel: `From ${cheapest.cost.display}`,
      availability: schemaAvailability,
      statusLabel,
      tierLabels: tierLabels.length > 0 ? tierLabels : undefined
    },
    // Internal fields (written to .ticket-data-internal.json only)
    internal: {
      totalAttendeeCapacity,
      totalAttendeeSold,
      totalAttendeeRemaining,
      percentSold: Math.round(percentSold),
      daysUntil,
      isEventWeek,
      tiers
    }
  };
}

async function main() {
  const token = loadToken();
  console.log('Eventbrite price sync starting...');

  const events = JSON.parse(readFileSync(EVENTS_PATH, 'utf-8'));
  const internalData = {};
  let updated = 0;
  let errors = 0;

  for (const event of events) {
    if (!event.eventbriteId) {
      console.log(`  SKIP: ${event.title} (no eventbriteId)`);
      continue;
    }

    console.log(`  Fetching: ${event.title} (${event.eventbriteId})`);

    try {
      const ticketClasses = await fetchTicketClasses(event.eventbriteId, token);
      const priceData = extractPriceData(ticketClasses, event.start);

      if (priceData) {
        // Public fields only in events.json
        event.price = priceData.public.price;
        event.priceCurrency = priceData.public.priceCurrency;
        event.priceLabel = priceData.public.priceLabel;
        event.availability = priceData.public.availability;
        event.statusLabel = priceData.public.statusLabel;
        if (priceData.public.tierLabels) {
          event.tierLabels = priceData.public.tierLabels;
        } else {
          delete event.tierLabels;
        }
        event.priceLastSync = new Date().toISOString();

        // Clean up any legacy fields that should never be public
        delete event.capacityTotal;
        delete event.ticketsSold;
        delete event.ticketsRemaining;
        delete event.tiers;

        // Internal data stored separately (gitignored)
        internalData[event.eventbriteId] = {
          title: event.title,
          slug: event.slug,
          ...priceData.internal,
          publicLabel: priceData.public.statusLabel,
          syncedAt: new Date().toISOString()
        };

        updated++;
        console.log(`    OK: ${priceData.public.priceLabel} | ${priceData.public.statusLabel} (real: ${priceData.internal.totalAttendeeRemaining} attendees left, ${priceData.internal.percentSold}% sold, ${priceData.internal.daysUntil}d away${priceData.internal.isEventWeek ? ' [EVENT WEEK]' : ''})`);
      } else {
        console.log(`    WARN: No price data extracted`);
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
      errors++;
    }

    // Rate limit: small delay between calls
    await new Promise(r => setTimeout(r, 200));
  }

  // Write public data
  writeFileSync(EVENTS_PATH, JSON.stringify(events, null, 2) + '\n');

  // Write internal data (gitignored, never pushed)
  writeFileSync(INTERNAL_PATH, JSON.stringify(internalData, null, 2) + '\n');

  console.log(`\nDone. Updated ${updated} events, ${errors} errors.`);
  console.log(`Public:   ${EVENTS_PATH}`);
  console.log(`Internal: ${INTERNAL_PATH}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
