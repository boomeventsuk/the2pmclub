

# New Event: 2PM Club Leicester - 2nd May 2026

## Summary
Add a new event for THE 2PM CLUB Leicester at Mattioli Woods Welford Road Stadium on Saturday 2nd May 2026, with a Leicester Tigers green accent colour scheme.

---

## Event Details

| Field | Value |
|-------|-------|
| Date | Saturday 2nd May 2026 |
| Time | 2pm - 6pm |
| Venue | Mattioli Woods Welford Road Stadium, Leicester |
| Slug | `020526-2PM-LEIC` |
| Eventbrite ID | `1983866397800` |
| Theme | Leicester Tigers green accent |
| Status | `just-announced` |

---

## Changes Required

### 1. File: `src/index.css`

Add a new set of accent classes (mirroring the coral pattern) for Leicester Tigers green. Using `#1A6D37` as the primary green (Leicester Tigers heritage green) with a lighter tint `#2E8B57` for hover and icon states:

```css
/* Leicester Tigers green accent */
.btn-tigers-green {
  background: linear-gradient(135deg, #1A6D37 0%, #2E8B57 50%, #1A6D37 100%) !important;
  border: 2px solid #2E8B57 !important;
  color: white !important;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.btn-tigers-green:hover {
  background: linear-gradient(135deg, #155C2E 0%, #1A6D37 50%, #155C2E 100%) !important;
  border-color: #1A6D37 !important;
}

.icon-tigers-green {
  color: #2E8B57 !important;
}

.shadow-tigers-green {
  box-shadow: 0 25px 50px -12px rgba(26, 109, 55, 0.25) !important;
}
```

### 2. File: `src/pages/EventPage.tsx`

Add support for the new `tigers-green` accent colour value alongside the existing `coral` checks. Every place that currently checks `accentColor === 'coral'` needs an additional check for `tigers-green`:

- Poster shadow: add `shadow-tigers-green` class
- Icons (Calendar, Clock, MapPin): add `icon-tigers-green` class
- Book Tickets button: add `btn-tigers-green` class
- Eventbrite wrapper background: use green-tinted equivalent `bg-[#1A6D37]/10 border border-[#1A6D37]/30`
- Artist list section: apply green glow variant
- Sticky CTAs: apply green button variant

The cleanest approach is to refactor the repeated `=== 'coral'` checks into a helper that returns the correct class names for any accent colour, but per the existing pattern we will add parallel conditionals for now.

### 3. File: `public/events.json`

Add new event object with ID 117:

```json
{
  "id": 117,
  "slug": "020526-2PM-LEIC",
  "eventType": "2PM",
  "cityCode": "LEIC",
  "eventbriteId": "1983866397800",
  "title": "THE 2PM CLUB Daytime Disco Leicester",
  "location": "Mattioli Woods Welford Road Stadium, Leicester",
  "start": "2026-05-02T14:00:00+01:00",
  "end": "2026-05-02T18:00:00+01:00",
  "bookUrl": "https://www.eventbrite.co.uk/e/1983866397800?aff=BoomWeb",
  "infoUrl": "https://www.facebook.com/events/TBD",
  "image": "https://boombastic-events.b-cdn.net/020526-2PM-LEIC/020526-2PM-LEIC%20no%20badge.jpg",
  "description": "THE 2PM CLUB Leicester — 4 hours of iconic 80s, 90s & 00s anthems at Welford Road. All the fun of a proper night out, home by 7-ish.",
  "subtitle": "Your best night out - right in the middle of the afternoon.",
  "fullDescription": "LET YOUR HAIR DOWN. WITHOUT THE NEXT-DAY REGRETS ...\n\nRemember when going OUT OUT didn't require a week's recovery? When you could sing every word, lose your voice, and still feel human the next day?\n\nWe've found the way to make that happen once more!\n\n4 hours of the biggest hairbrush hits and sing-alongs, with night out energy, confetti moments, and a room full of people who know every word too.",
  "highlights": "...(standard 5 highlights)...",
  "status": "just-announced",
  "accentColor": "tigers-green"
}
```

---

## Technical Notes

- Uses BST timezone (`+01:00`) since May is British Summer Time
- New city code `LEIC` for Leicester (first event in this city)
- The `accentColor: "tigers-green"` value drives all the conditional styling automatically
- Placeholder copy will be replaced once you provide the Eventbrite copy
- Leicester postcode will need adding to the `postcodes` map in `src/utils/eventUtils.ts` (e.g., `'Leicester': 'LE1 6TP'` for Welford Road)

---

## Files Modified

| File | What Changes |
|------|-------------|
| `public/events.json` | New event entry (ID 117) |
| `src/index.css` | New `.btn-tigers-green`, `.icon-tigers-green`, `.shadow-tigers-green` classes |
| `src/pages/EventPage.tsx` | Add `tigers-green` accent colour conditionals alongside existing `coral` checks |
| `src/utils/eventUtils.ts` | Add Leicester postcode to lookup map |

