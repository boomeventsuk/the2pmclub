# ✅ COMPLETED: Franklin's Gardens Northampton — 6th June 2026

**Implemented on:** 28 Jan 2026

## Event Details

| Field | Value |
|-------|-------|
| **Slug** | `060626-2PM-NPTON` |
| **Venue** | Cinch Stadium, Franklin's Gardens, Northampton |
| **Date** | Saturday 6th June 2026 |
| **Time** | 14:00–18:00 |
| **Eventbrite ID** | `1981781356385` |
| **Image** | `https://boombastic-events.b-cdn.net/060626_2PM_NPTON/280226_2PM_NPTON_060626_2PM_NPTON%20ANNSQ.jpg` |
| **Accent Theme** | Coral (matching poster) |

---

## Changes Made

### 1. Added Event to `public/events.json`
- New event entry with id 114, slug `060626-2PM-NPTON`
- Full Eventbrite copy included in `fullDescription` and `highlights`
- `accentColor: "coral"` for custom styling
- `status: "just-announced"`

### 2. Added Coral Button Styling to `src/index.css`
- `.btn-coral` - gradient coral button (#E88B73 → #F4A582)
- `.icon-coral` - coral icon tint
- `.shadow-coral` - coral glow shadow for poster

### 3. Updated `src/pages/EventPage.tsx`
- Added `accentColor` field to EventJson and EventData interfaces
- Updated `parseLocation()` with venue-specific postcode logic (Franklin's Gardens → NN5 5BU)
- Conditional coral styling on hero button, icons, and poster shadow
- Changed sold-out logic from `cityCode === 'NPTON'` to `status === 'sold-out'` (allows multiple events per city with different statuses)

---

## Event Page URL

`/events/060626-2PM-NPTON/`

---

## Technical Notes

- Event auto-appears on homepage sorted by date
- OG tags work via Netlify Edge Function
- All tracking (dataLayer, Meta Pixel) works automatically
- Coral theme only applies to this specific event via accentColor
