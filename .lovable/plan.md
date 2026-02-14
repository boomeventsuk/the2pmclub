

# New Event: 2PM Club Bedford - 13th June 2026

## Summary
Add a new event for THE 2PM CLUB Bedford at Bedford Esquires on Saturday 13th June 2026.

---

## Event Details

| Field | Value |
|-------|-------|
| Date | Saturday 13th June 2026 |
| Time | 2pm - 6pm |
| Venue | Bedford Esquires, Bedford |
| Slug | `130626-2PM-BED` |
| Eventbrite ID | `1983156002990` |
| Theme | Coral accent (matching other summer events) |
| Status | `just-announced` |

---

## Change Required

### File: `public/events.json`

Add new event object with ID 116 at the end of the array:

```json
{
  "id": 116,
  "slug": "130626-2PM-BED",
  "eventType": "2PM",
  "cityCode": "BED",
  "eventbriteId": "1983156002990",
  "title": "THE 2PM CLUB Daytime Disco Bedford",
  "location": "Bedford Esquires, Bedford",
  "start": "2026-06-13T14:00:00+01:00",
  "end": "2026-06-13T18:00:00+01:00",
  "bookUrl": "https://www.eventbrite.co.uk/e/1983156002990?aff=BoomWeb",
  "infoUrl": "https://www.facebook.com/events/TBD",
  "image": "https://boombastic-events.b-cdn.net/130626-2PM-BED/130626-2PM-BED%20ANNSQ.jpg",
  "description": "THE 2PM CLUB Bedford — 4 hours of iconic 80s, 90s & 00s anthems. All the fun of a proper night out, home by 7-ish.",
  "subtitle": "Your best night out - right in the middle of the afternoon.",
  "fullDescription": "LET YOUR HAIR DOWN. WITHOUT THE NEXT-DAY REGRETS ...\n\nRemember when going OUT OUT didn't require a week's recovery? When you could sing every word, lose your voice, and still feel human the next day?\n\nWe've found the way to make that happen once more!\n\n4 hours of the biggest hairbrush hits and sing-alongs, with night out energy, confetti moments, and a room full of people who know every word too.",
  "highlights": "...(same 5 highlights as Luton/Northampton summer events)...",
  "status": "just-announced",
  "accentColor": "coral"
}
```

---

## Technical Notes

- Uses BST timezone (+01:00) since June is British Summer Time
- Coral accent colour matches the other summer 2026 events (Luton May, Northampton June)
- Copy mirrors the Franklin's Gardens / Hat Factory style
- The event page, homepage listing, tracking, and OG tags all work automatically from this single JSON entry

