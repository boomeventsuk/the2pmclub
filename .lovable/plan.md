

# Tigers Partner Landing Page (`?tigers` variant)

## Summary

Create a new query-string variant for the Leicester event page, accessed via `/events/020526-2PM-LEIC/?tigers`. This is a conversion-first page designed for traffic arriving from the Leicester Tigers website -- it skips the promo content and goes straight to booking, very similar to the existing `?email` variant.

## URL

```
https://www.the2pmclub.co.uk/events/020526-2PM-LEIC/?tigers
```

## What It Looks Like

Same structure as the `?email` variant:

1. **Header** (standard site nav)
2. **Hero** -- poster + compact details card with Tigers-green styling
3. **Eventbrite Checkout Widget** -- immediately after hero (height 600-700), so visitors can book straight away
4. **Brief "Why" section** -- 4 short reasons (same as email variant)
5. **Share row** -- WhatsApp / Messenger / Copy Link
6. **Sticky mobile CTA** -- green-themed "Book Now" anchored to checkout widget

Key differences from the email variant:
- Headline copy tailored for Tigers fans: "WELCOME FROM LEICESTER TIGERS" or similar
- Tigers-green accent on buttons, borders, sticky CTA (reuses existing `.btn-tigers-green` classes)
- `noindex` meta tag (partner traffic, not for Google)
- No video section (keep it short and conversion-focused)

## Changes Required

### File: `src/pages/EventPage.tsx`

1. **Read the query param** (alongside existing `isRetargeting` and `isEmailLanding`):
   ```ts
   const isTigersLanding = searchParams.has('tigers');
   ```

2. **Add a new rendering block** between the email and standard blocks (~80 lines). The layout mirrors the email variant but with:
   - Tigers-specific headline ("WELCOME FROM LEICESTER TIGERS")
   - Sub-headline: "Your exclusive link to the ultimate afternoon party at Welford Road"
   - Tigers-green accent on poster shadow, icons, and CTA buttons
   - Eventbrite embed directly after hero
   - 4 compact reasons section
   - Share row
   - Green-themed sticky mobile CTA

3. **No routing changes needed** -- it uses the same `/events/:slug/` route, just a different query parameter.

### No other files change

The event data, CSS classes (`.btn-tigers-green`, `.icon-tigers-green`, `.shadow-tigers-green`), and routing are all already in place.

## Files Modified

| File | What Changes |
|------|-------------|
| `src/pages/EventPage.tsx` | Add `isTigersLanding` check and new rendering block (~80 lines) |

