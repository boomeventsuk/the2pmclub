

# New Event: 2PM Club Luton - 23rd May 2026

## Summary
Add a new event for THE 2PM CLUB Luton at The Hat Factory on Saturday 23rd May 2026, matching the style and coral theme of the Franklin's Gardens Northampton event.

---

## Event Details

| Field | Value |
|-------|-------|
| **Date** | Saturday 23rd May 2026 |
| **Time** | 2pm - 6pm |
| **Venue** | The Hat Factory, Luton |
| **Slug** | `230526-2PM-LUT` |
| **Eventbrite ID** | `1982497843417` |
| **Theme** | Coral accent (matching Franklin's Gardens) |
| **Status** | `just-announced` |

---

## Changes Required

### File: `public/events.json`

Add new event object with ID 115:

```json
{
  "id": 115,
  "slug": "230526-2PM-LUT",
  "eventType": "2PM",
  "cityCode": "LUT",
  "eventbriteId": "1982497843417",
  "title": "THE 2PM CLUB Daytime Disco Luton",
  "location": "Hat Factory, Luton",
  "start": "2026-05-23T14:00:00+01:00",
  "end": "2026-05-23T18:00:00+01:00",
  "bookUrl": "https://www.eventbrite.co.uk/e/1982497843417?aff=BoomWeb",
  "infoUrl": "https://www.facebook.com/events/TBD",
  "image": "https://boombastic-events.b-cdn.net/230526-2PM-LUT/230526-2PM-LUT-060626_2PM_NPTON%20ANNSQ.jpg",
  "description": "THE 2PM CLUB Luton — 4 hours of iconic 80s, 90s & 00s anthems. All the fun of a proper night out, home by 7-ish.",
  "subtitle": "Your best night out - right in the middle of the afternoon.",
  "fullDescription": "LET YOUR HAIR DOWN. WITHOUT THE NEXT-DAY REGRETS ✨\n\nRemember when going OUT OUT didn't require a week's recovery? When you could sing every word, lose your voice, and still feel human the next day?\n\nWe've found the way to make that happen once more!\n\n4 hours of the biggest hairbrush hits and sing-alongs, with night out energy, confetti moments, and a room full of people who know every word too.",
  "highlights": "🎤 ICONIC ANTHEMS. NONSTOP ENERGY: Wall-to-wall classics from Wham! to Whitney, Bon Jovi to Beyoncé. You WILL do the moves. You WILL lose your voice. You WILL text each other about it for weeks.|🕺 DAYTIME PARTY, NIGHT-OUT VIBES: Same Boombastic team. Club-level production, massive screens, dazzling lights, and confetti explosions - just at people-friendly hours. Dance freely, laugh loudly, and still be home by 7pm.|👯 FINALLY, A PLAN NOBODY BAILS ON: This is the plan that will escape the group chat. Four hours where everyone actually makes it - no babysitter dramas, no late-night worries. Adulting can wait.|😎 ALL THE FUN. STILL BUZZING BY WEDNESDAY: Last time, you walked out saying \"Let's do it again!\" This is the time to do it. This is your plan.|🏆 TRUST THE LEGACY: Created by Boombastic Events - 10+ years of consistent sell-outs across the UK because we know how to create moments that matter.",
  "status": "just-announced",
  "accentColor": "coral"
}
```

---

## What You'll Get

The coral accent colour applies automatically throughout the event page:

- **Book Tickets button** - coral instead of pink
- **Icons** (Calendar, Clock, MapPin) - coral colour
- **Poster glow** - coral shadow effect
- **Mobile sticky CTA** - coral styling

---

## Technical Notes

- Uses BST timezone (`+01:00`) since May is in British Summer Time
- Copy matches Franklin's Gardens style but without the venue-specific "home of Northampton Saints" line
- Same highlights structure as the June Northampton event
- Event will automatically appear on homepage in date order

