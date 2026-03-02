

# Add FOMO to Milton Keynes (14th March) Event

## What Changes

Single file: `public/events.json` -- update the Milton Keynes event (ID 111, slug `140326-2PM-MK`).

Two field changes:
1. `"status"` from `"selling-fast-amber"` to `"last-tickets"`
2. `"urgencyLabel"` from `"TICKETS SELLING FAST"` to `"LAST 50 TICKETS"`

## What This Triggers Automatically

The `last-tickets` status already drives aggressive FOMO treatment across the entire event page (standard, retargeting, and email variants):

- **Massive sticky pink banner** at the top: "LAST 50 TICKETS" in bold uppercase
- **Hero badge** with the urgency label inside a pink bordered box
- **Mobile sticky CTA** turns solid pink with white "LAST 50 TICKETS" text and a white "Book Now" button
- **Headline override** replaces the standard title with the urgency label front and centre

No code changes needed -- the UI logic already handles everything based on these two fields.

## File Modified

| File | Change |
|------|--------|
| `public/events.json` | Update MK event: `status` to `last-tickets`, `urgencyLabel` to `LAST 50 TICKETS` |

