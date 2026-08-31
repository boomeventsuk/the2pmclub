# List Events - THE 2PM CLUB

Fetch upcoming daytime disco events from THE 2PM CLUB, a series of afternoon club nights running across the Midlands (Northampton, Milton Keynes, Coventry, Bedford, Luton, Leicester).

## Endpoint

```
GET https://www.the2pmclub.co.uk/upcoming-events.json
```

Returns a JSON array of current upcoming events. No authentication required.

## Response Fields

Each event object includes:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique event ID |
| slug | string | URL slug (e.g. "northampton-jun-2026") |
| title | string | Full event title |
| location | string | Venue name and city |
| start | string | ISO 8601 start datetime |
| end | string | ISO 8601 end datetime |
| displayDate | string | Human-readable UK event date |
| displayTime | string | UK wall-clock time range on the event date |
| canonicalUrl | string | Canonical THE 2PM CLUB event URL |
| bookUrl | string | Ticket booking URL (always on the2pmclub.co.uk) |
| image | string | Event image URL |
| description | string | Short description |
| price | number | Ticket price in GBP |
| priceCurrency | string | Always "GBP" |
| priceLabel | string | Human-readable base price plus booking-fee wording |
| availability | string | schema.org availability URL |
| venueAddress | object | Full postal address |

## Filter by City

To get events for a specific city, filter the array on the `location` field:

```javascript
const events = await fetch('https://www.the2pmclub.co.uk/upcoming-events.json').then(r => r.json());
const northampton = events.filter(e => e.location.toLowerCase().includes('northampton'));
```

Supported cities: Northampton, Milton Keynes, Coventry, Bedford, Luton, Leicester.

## Filter Upcoming Only

```javascript
const now = new Date().toISOString().slice(0, 10);
const upcoming = events.filter(e => e.start.slice(0, 10) >= now);
```

## Example Response

```json
[
  {
    "id": 3463381954,
    "slug": "031026-2PM-NPTON",
    "title": "THE 2PM CLUB Northampton: 80s Edition Daytime Disco",
    "location": "The Picturedrome, Northampton",
    "start": "2026-10-03T14:00:00+01:00",
    "end": "2026-10-03T18:00:00+01:00",
    "displayTime": "2pm to 6pm",
    "bookUrl": "https://www.the2pmclub.co.uk/events/031026-2pm-npton/",
    "price": 13.50,
    "priceCurrency": "GBP",
    "priceLabel": "From £13.50 + booking fee",
    "availability": "https://schema.org/InStock"
  }
]
```

## About THE 2PM CLUB

Daytime disco events across six cities. Events start at 2pm UK time and normally finish at 6pm; the event record shows any venue-agreed exception. THE 2PM CLUB has run daytime discos since 2024, backed by ten years of events experience from Boombastic Events. Contact: hello@boomevents.co.uk
