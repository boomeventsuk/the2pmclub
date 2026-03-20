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

  // Real numbers (internal only, never written to public events.json)
  const totalCapacity = admission.reduce((sum, tc) => sum + (tc.quantity_total || 0), 0);
  const totalSold = admission.reduce((sum, tc) => sum + (tc.quantity_sold || 0), 0);
  const totalRemaining = totalCapacity - totalSold;
  const percentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

  // Per-tier details (internal only)
  const tiers = admission.map(tc => ({
    name: tc.display_name || tc.name,
    price: parseFloat(tc.cost.major_value),
    status: tc.on_sale_status,
    capacity: tc.quantity_total,
    sold: tc.quantity_sold,
    remaining: tc.quantity_total - tc.quantity_sold
  }));

  const allSoldOut = admission.every(tc => tc.on_sale_status === 'SOLD_OUT');
  const anyAvailable = admission.some(tc => tc.on_sale_status === 'AVAILABLE');

  // Time awareness: days until event
  const now = new Date();
  const eventDay = eventDate ? new Date(eventDate) : null;
  const daysUntil = eventDay ? Math.ceil((eventDay - now) / (1000 * 60 * 60 * 24)) : 999;

  // ============================================================
  // JD's urgency curve: always run ahead of reality
  //
  // Real state          ->  Public label
  // 70 remaining        ->  "50 left" territory = "Selling fast"
  // 40% sold            ->  say half sold = "Over half sold"
  // 1/3 left            ->  say quarter left = "Last few tickets"
  // 40 remaining        ->  say 25 left = "Almost gone"
  // 25 remaining        ->  say 10-15 = "Final tickets"
  // 0 remaining         ->  "Sold out"
  //
  // Events this week get an extra urgency boost.
  // ============================================================

  let statusLabel;
  let schemaAvailability;

  if (allSoldOut || totalRemaining === 0) {
    statusLabel = 'Sold out';
    schemaAvailability = 'https://schema.org/SoldOut';
  } else if (totalRemaining <= 25) {
    // Reality: 25 left. Tell them: final tickets
    statusLabel = 'Final tickets';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (totalRemaining <= 40) {
    // Reality: 40 left. Tell them: almost gone
    statusLabel = 'Almost gone';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (percentSold >= 67) {
    // Reality: 1/3 left. Tell them: last few
    statusLabel = 'Last few tickets';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (totalRemaining <= 70) {
    // Reality: 70 left. Tell them: selling fast
    statusLabel = 'Selling fast';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (percentSold >= 40) {
    // Reality: 40% sold. Tell them: over half sold
    statusLabel = 'Over half sold';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (daysUntil <= 7 && percentSold >= 20) {
    // Event this week and at least 20% sold: boost urgency
    statusLabel = 'Selling fast';
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (daysUntil <= 7) {
    // Event this week, any sales: nudge urgency
    statusLabel = 'This week';
    schemaAvailability = 'https://schema.org/InStock';
  } else if (anyAvailable) {
    statusLabel = 'On sale';
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
      totalCapacity,
      totalSold,
      totalRemaining,
      percentSold: Math.round(percentSold),
      daysUntil,
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
        console.log(`    OK: ${priceData.public.priceLabel} | ${priceData.public.statusLabel} (real: ${priceData.internal.totalRemaining} left, ${priceData.internal.percentSold}% sold, ${priceData.internal.daysUntil}d away)`);
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
