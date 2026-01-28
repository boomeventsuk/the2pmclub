

## New Event Page: Franklin's Gardens Northampton — 6th June 2026

### Event Details Confirmed from Poster

| Field | Value |
|-------|-------|
| **Slug** | `060626-2PM-NPTON` |
| **Venue** | Cinch Stadium, Franklin's Gardens, Northampton |
| **Date** | Saturday 6th June 2026 |
| **Time** | 14:00–18:00 (2PM-6PM as per poster) |
| **Eventbrite ID** | `1981781356385` |
| **Image** | `https://boombastic-events.b-cdn.net/060626_2PM_NPTON/280226_2PM_NPTON_060626_2PM_NPTON%20ANNSQ.jpg` |
| **Accent Theme** | Coral/Tropical (matching poster) |

---

### Implementation Tasks

#### 1. Add Event to `public/events.json`

Add a new event entry with the full Eventbrite copy provided:

```json
{
  "id": 114,
  "slug": "060626-2PM-NPTON",
  "eventType": "2PM",
  "cityCode": "NPTON",
  "eventbriteId": "1981781356385",
  "title": "THE 2PM CLUB Daytime Disco Northampton",
  "location": "Cinch Stadium, Franklin's Gardens, Northampton",
  "start": "2026-06-06T14:00:00+01:00",
  "end": "2026-06-06T18:00:00+01:00",
  "bookUrl": "https://www.eventbrite.co.uk/e/1981781356385?aff=BoomWeb",
  "infoUrl": "https://www.facebook.com/events/TBD",
  "image": "...",
  "description": "THE 2PM CLUB returns to Franklin's Gardens...",
  "subtitle": "Your best night out - right in the middle of the afternoon.",
  "fullDescription": "...",
  "highlights": "...",
  "status": "just-announced",
  "accentColor": "coral"
}
```

---

#### 2. Add Coral/Tropical Button Styling to `src/index.css`

Create a new button class that matches the poster's coral/salmon colour scheme:

```css
/* Franklin's Gardens coral/tropical accent */
.btn-coral {
  background: linear-gradient(135deg, #E88B73 0%, #F4A582 50%, #E88B73 100%);
  border: 2px solid #F4A582;
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.btn-coral:hover {
  background: linear-gradient(135deg, #D97B63 0%, #E88B73 50%, #D97B63 100%);
  border-color: #E88B73;
}

/* Coral icon tint for event page elements */
.icon-coral {
  color: #F4A582;
}
```

---

#### 3. Update `src/pages/EventPage.tsx`

**Add support for `accentColor` in the event interface:**
```typescript
interface EventJson {
  // ... existing fields
  accentColor?: string; // 'coral' | 'green' | etc.
}
```

**Pass `accentColor` through to EventData and apply conditionally:**
- When `event.accentColor === 'coral'`, apply `btn-coral` class to Book Tickets button
- Apply `icon-coral` class to Calendar, MapPin, Clock icons
- Keep all other styling consistent with standard events

**Add venue-specific postcode for Franklin's Gardens:**
```typescript
const postcodes: Record<string, string> = {
  'Coventry': 'CV1 1GX',
  'Milton Keynes': 'MK9 3PU', 
  'Northampton': 'NN1 5BD',
  'Birmingham': 'B1 1AA',
  'Luton': 'LU1 2AA',
  'Bedford': 'MK40 2TH'
};
```

Note: Since Northampton now has two venues (Picturedrome and Franklin's Gardens), I'll handle postcode by parsing the venue name. Franklin's Gardens postcode is **NN5 5BU**.

---

#### 4. Page Layout

The event page will use the **exact same layout** as all other events:

- Hero with poster + details card
- Intro description section
- Video section (standard 2PM video)
- Photo gallery
- Testimonials
- FAQ accordion
- Eventbrite embed checkout

Only the **button colour** and **icon accents** will reflect the coral/tropical theme from the poster.

---

### Files to Update

| File | Changes |
|------|---------|
| `public/events.json` | Add new event entry with all details + `accentColor: "coral"` |
| `src/index.css` | Add `.btn-coral` and `.icon-coral` styling |
| `src/pages/EventPage.tsx` | Add `accentColor` support, conditional button/icon styling, venue postcode logic |

---

### Technical Notes

- The event will automatically appear on the homepage sorted by date (after existing events)
- The event page will be accessible at `/events/060626-2PM-NPTON/`
- OG tags will work automatically via the Netlify Edge Function
- All tracking (dataLayer, Meta Pixel) will work automatically
- The coral theme is venue-specific, keeping your brand flexible while matching event artwork

