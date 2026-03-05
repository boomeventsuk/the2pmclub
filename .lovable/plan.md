

# Urgency Updates for Milton Keynes and Coventry

## Summary

Update the event data for MK (last 25 tickets) and Coventry (last 75 tickets) to trigger the existing high-urgency "last-tickets" treatment across homepage cards and event landing pages.

## Changes

### File: `public/events.json`

**Milton Keynes** (slug `140326-2PM-MK`, line 78-79):
- Change `status` from `"last-tickets"` to `"last-tickets"` (already correct)
- Change `urgencyLabel` from `"LAST 50 TICKETS"` to `"FINAL 25 TICKETS"`

**Coventry** (slug `070326-2PM-COV`, line 118-119):
- Change `status` from `"selling-fast-amber"` to `"last-tickets"`
- Change `urgencyLabel` from `"TICKETS SELLING FAST"` to `"LAST 75 TICKETS"`

These two data changes automatically activate:
- Red pulsing urgency strip on homepage event cards
- Full-width pink sticky "LAST XX TICKETS" banner on event pages (all variants: standard, email, retargeting)
- Pink sticky mobile CTA with ticket count
- Urgency badge in the hero details card

### Files modified

| File | What changes |
|------|-------------|
| `public/events.json` | MK: urgencyLabel to "FINAL 25 TICKETS"; Coventry: status to "last-tickets", urgencyLabel to "LAST 75 TICKETS" |

