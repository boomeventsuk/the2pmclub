

# Update Tigers Partner Landing Page

## Summary

Rework the `?tigers` variant to align with the email variant structure (including video section), update the headline/copy to match standard 2PM Club branding with urgency, and remove the "Welcome from Leicester Tigers" messaging.

## Changes -- `src/pages/EventPage.tsx` (lines 1026-1222)

### 1. Headline and copy updates
- Replace "WELCOME FROM LEICESTER TIGERS" with urgency-focused copy: **"TICKETS SELLING FAST"** as a prominent badge
- Change the main heading to: **"THE 2PM CLUB Daytime Disco"** with subtitle **"Iconic 80s, 90s & 00s anthems"**
- Keep the venue/date/time details as-is

### 2. Add video section (like email variant)
- Insert the video section between the Eventbrite embed and the Four Reasons section
- Same video URL and poster as the email variant
- Caption: "This is what you're walking into."

### 3. Add urgency badge in hero details card
- Add a styled urgency badge at the top of the details card: green-themed "TICKETS SELLING FAST" banner (similar to the `last-tickets` treatment in the email variant but using tigers-green styling)

### 4. Update sticky mobile CTA
- Change the sticky bar text from just "Leicester -- date" to include "TICKETS SELLING FAST" urgency text

### Files modified

| File | What changes |
|------|-------------|
| `src/pages/EventPage.tsx` | Update Tigers variant block (~lines 1048-1219): new headline, urgency badge, add video section, update sticky CTA copy |

