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

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EVENTS_PATH = resolve(ROOT, 'public/events.json');

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

function extractPriceData(ticketClasses) {
  if (!ticketClasses || ticketClasses.length === 0) return null;

  // Filter to admission tickets only (ignore donations, etc.)
  const admission = ticketClasses.filter(tc => tc.category === 'admission' && !tc.free);
  if (admission.length === 0) return null;

  // Find the cheapest available ticket (or cheapest overall if none available)
  const available = admission.filter(tc => tc.on_sale_status === 'AVAILABLE');
  const source = available.length > 0 ? available : admission;
  const cheapest = source.reduce((min, tc) =>
    tc.cost.value < min.cost.value ? tc : min, source[0]);

  // Calculate total capacity and sold across all tiers
  const totalCapacity = admission.reduce((sum, tc) => sum + (tc.quantity_total || 0), 0);
  const totalSold = admission.reduce((sum, tc) => sum + (tc.quantity_sold || 0), 0);
  const totalRemaining = totalCapacity - totalSold;

  // Determine availability status for Schema.org
  const allSoldOut = admission.every(tc => tc.on_sale_status === 'SOLD_OUT');
  const anyAvailable = admission.some(tc => tc.on_sale_status === 'AVAILABLE');

  let schemaAvailability;
  if (allSoldOut) {
    schemaAvailability = 'https://schema.org/SoldOut';
  } else if (totalRemaining <= 50) {
    schemaAvailability = 'https://schema.org/LimitedAvailability';
  } else if (anyAvailable) {
    schemaAvailability = 'https://schema.org/InStock';
  } else {
    schemaAvailability = 'https://schema.org/PreOrder';
  }

  // Build ticket tiers summary
  const tiers = admission.map(tc => ({
    name: tc.display_name || tc.name,
    price: parseFloat(tc.cost.major_value),
    status: tc.on_sale_status,
    capacity: tc.quantity_total,
    sold: tc.quantity_sold,
    remaining: tc.quantity_total - tc.quantity_sold
  }));

  // Public-safe status label (no raw numbers exposed)
  let statusLabel;
  if (allSoldOut) {
    statusLabel = 'Sold out';
  } else if (totalRemaining <= 30) {
    statusLabel = 'Selling fast';
  } else if (totalRemaining <= 80) {
    statusLabel = 'Limited availability';
  } else {
    statusLabel = 'On sale';
  }

  return {
    price: parseFloat(cheapest.cost.major_value),
    priceCurrency: cheapest.cost.currency,
    priceLabel: `From ${cheapest.cost.display}`,
    availability: schemaAvailability,
    statusLabel
  };
}

async function main() {
  const token = loadToken();
  console.log('Eventbrite price sync starting...');

  const events = JSON.parse(readFileSync(EVENTS_PATH, 'utf-8'));
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
      const priceData = extractPriceData(ticketClasses);

      if (priceData) {
        event.price = priceData.price;
        event.priceCurrency = priceData.priceCurrency;
        event.priceLabel = priceData.priceLabel;
        event.availability = priceData.availability;
        event.statusLabel = priceData.statusLabel;
        event.priceLastSync = new Date().toISOString();
        // Clean up any legacy fields from previous syncs
        delete event.capacityTotal;
        delete event.ticketsSold;
        delete event.ticketsRemaining;
        delete event.tiers;
        updated++;
        console.log(`    OK: ${priceData.priceLabel} (${priceData.statusLabel})`);
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

  writeFileSync(EVENTS_PATH, JSON.stringify(events, null, 2) + '\n');
  console.log(`\nDone. Updated ${updated} events, ${errors} errors.`);
  console.log(`Written to: ${EVENTS_PATH}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
