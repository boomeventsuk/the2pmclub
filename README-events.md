# How to Add a New 2PM Club Event

## Event Slug Format

All 2PM Club events use the standardized slug format:
```
DDMMYY-2PM-CITYCODE
```

### City Codes
- `NPTON` = Northampton
- `MK` = Milton Keynes
- `BED` = Bedford
- `LUT` = Luton
- `COV` = Coventry

### Examples
- `201225-2PM-BED` → 20 Dec 2025, 2PM Club Bedford
- `071225-2PM-NPTON` → 7 Dec 2025, 2PM Club Northampton
- `070226-2PM-LUT` → 7 Feb 2026, 2PM Club Luton

---

## Adding a New Event

### 1. Update `public/events.json`

Add a new event object with the following fields:

```json
{
  "id": 114,
  "slug": "150326-2PM-BED",
  "eventType": "2PM",
  "cityCode": "BED",
  "eventbriteId": "EVENTBRITE_ID_HERE",
  "promoCode": "OPTIONAL_PROMO_CODE",
  "title": "THE 2PM CLUB Bedford — 80s 90s 00s Daytime Disco",
  "location": "Bedford Esquires, Bedford",
  "start": "2026-03-15T14:00:00+00:00",
  "end": "2026-03-15T18:00:00+00:00",
  "bookUrl": "https://www.eventbrite.co.uk/e/...",
  "infoUrl": "https://www.facebook.com/events/...",
  "image": "https://res.cloudinary.com/dteowuv7o/image/upload/v.../poster.jpg",
  "description": "Short description for meta",
  "subtitle": "Event subtitle/tagline",
  "fullDescription": "Full event description...",
  "highlights": "Highlight 1|Highlight 2|Highlight 3"
}
```

**Required fields:**
- `slug` - Must follow DDMMYY-2PM-CITYCODE format
- `eventType` - Always "2PM"
- `cityCode` - Must match one of the city codes above
- `eventbriteId` - From Eventbrite event URL
- `title`, `location`, `start`, `end`, `bookUrl`, `image`

**Optional fields:**
- `promoCode` - Eventbrite promo code for automatic discounts
- `subtitle`, `fullDescription`, `highlights` - Enhanced event page content

### 2. Update `src/components/Tickets.tsx`

Add the same event to the hardcoded events array around line 24:

```typescript
{
  slug: "150326-2PM-BED",
  eventType: "2PM",
  cityCode: "BED",
  eventbriteId: "EVENTBRITE_ID_HERE",
  title: "THE 2PM CLUB BEDFORD - 80s 90s 00s Daytime Disco",
  date: "Sat 15 Mar 2026",
  venue: "Bedford Esquires",
  city: "Bedford",
  time: "14:00–18:00",
  poster: "https://res.cloudinary.com/dteowuv7o/image/upload/v.../poster.jpg",
  bookUrl: "https://www.eventbrite.co.uk/e/...",
  infoUrl: "https://www.facebook.com/events/...",
  urgencyText: "JUST ANNOUNCED",
  urgencyColor: "green"
}
```

---

## That's It!

Once you've updated both files, the event will:
- ✅ Appear on the homepage ticket list
- ✅ Have its own event page at `/events/DDMMYY-2PM-CITYCODE/`
- ✅ Track all user interactions in Google Analytics & Meta Pixel
- ✅ Push standardized `event_slug` and `event_type` to dataLayer

**No GTM changes needed.** All tracking is automatic via the slug format.

---

## DataLayer Events Tracked

Every event automatically tracks:
- `home_eventcard_click` - Homepage card clicked
- `eventpage_view` - Event page loaded
- `eventpage_book_click` - Book Tickets button clicked
- `eb_ticket_selected` - Ticket selected in Eventbrite widget
- `eb_checkout_started` - Checkout process started
- `eb_checkout_interaction` - User interacted with checkout
- `purchase` - Order completed (with transaction value & order ID)

All events include:
- `event_slug` - The standardized slug
- `event_type` - Always "2PM"
- `event_title` - Event title

---

## Troubleshooting

### Event not appearing on homepage
- Check `src/components/Tickets.tsx` has the event
- Verify `slug` matches in both files
- Clear browser cache

### Event page shows "Event Not Found"
- Check `public/events.json` has the event
- Verify `slug` is uppercase in JSON file
- URL slugs are case-insensitive but data keys must be uppercase

### Tracking not working
- Check browser console for errors
- Verify `event_slug` is present in dataLayer pushes
- Check GTM preview mode to see if events are firing
