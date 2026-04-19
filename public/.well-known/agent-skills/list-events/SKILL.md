# List Events - THE 2PM CLUB

Fetch upcoming daytime disco events from THE 2PM CLUB, a series of afternoon club nights running across the Midlands (Northampton, Milton Keynes, Coventry, Bedford, Luton, Leicester).

## Endpoint

```
GET https://www.the2pmclub.co.uk/events.json
```

Returns a JSON array of all events. No authentication required.

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
| bookUrl | string | Ticket booking URL (always on the2pmclub.co.uk) |
| image | string | Event image URL |
| description | string | Short description |
| price | number | Ticket price in GBP |
| priceCurrency | string | Always "GBP" |
| priceLabel | string | Human-readable price (e.g. "from £12.50") |
| availability | string | schema.org availability URL |
| ticketsRemaining | number | Remaining ticket count |
| venueAddress | object | Full postal address |

## Filter by City

To get events for a specific city, filter the array on the `location` field:

```javascript
const events = await fetch('https://www.the2pmclub.co.uk/events.json').then(r => r.json());
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
    "id": 1,
    "slug": "northampton-jun-2026",
    "title": "THE 2PM CLUB - Northampton",
    "location": "Roadmender, Northampton",
    "start": "2026-06-14T14:00:00",
    "end": "2026-06-14T18:00:00",
    "bookUrl": "https://www.the2pmclub.co.uk/events/northampton-jun-2026",
    "price": 12.50,
    "priceCurrency": "GBP",
    "priceLabel": "from £12.50",
    "availability": "https://schema.org/InStock"
  }
]
```

## About THE 2PM CLUB

Daytime disco events, 2pm to 6pm every Saturday. 80s, 90s and 00s anthems. Run by Boombastic Events across 6 Midlands cities since 2014. Over 23,000 attendees. Contact: hello@boomevents.co.uk
