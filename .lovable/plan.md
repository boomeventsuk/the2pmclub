

# EventPage.tsx Full Rebuild

## Overview

A conversion-first restructure of EventPage.tsx across all four rendering modes. The biggest change is moving the Eventbrite checkout embed directly below the hero in Standard mode, plus adding a brand new Artist List section and a second checkout embed at the bottom.

---

## STANDARD MODE (lines 1216-1835) -- Full Restructure

### New section order (14 sections):

```text
1.  Helmet + JSON-LD + Sold Out / Last Tickets Banner  (NO CHANGE)
2.  Hero                                                 (NO CHANGE)
3.  Eventbrite Embed (MOVED UP from position 9)
4.  Description (NEW hardcoded copy, replaces fullDescription rendering)
5.  Artist List (BRAND NEW section)
6.  Video (NO CHANGE, just repositioned after Artist List)
7.  Highlights (NEW hardcoded cards, keep card layout)
8.  Photo Gallery (NO CHANGE)
9.  Social Proof / Testimonials (heading update only)
10. Second Eventbrite Embed (NEW duplicate at bottom)
11. FAQ (NO CHANGE)
12. Facebook Group CTA (NO CHANGE)
13. Footer (NO CHANGE)
14. Sticky CTAs (NO CHANGE -- scroll targets top embed)
```

### Section 3: Eventbrite Embed (moved up)

- Move the entire checkout block (currently lines 1716-1759) to directly after the hero section (after line 1428)
- Change `height={425}` to `height={700}`
- Heading: "BOOK YOUR TICKETS"
- Subtext: "The most popular day party in the Midlands. Choose your tickets below."
- Keep: pink wrapper, coral accent override, ticket emoji, containerId as `eventbrite-widget-{slug}`, fallback logic
- Keep existing last-tickets conditional heading logic

### Section 4: Description (new hardcoded copy)

Replace the current fullDescription rendering block (lines 1430-1584) with hardcoded content:

- **Heading**: THE NIGHT OUT THAT STARTS AT 2PM (with sparkle emoji)
- **Pull quote blockquote** (pink left border): "You know that feeling. Mr. Brightside kicks in and suddenly you're 22 again, screaming every word with your mates. No responsibility. No overthinking. Just pure, ridiculous joy."
- **Two body paragraphs**:
  - "That feeling still exists. And it starts at 2pm."
  - "Four hours of the biggest hairbrush anthems and sing-alongs, with night-out energy, confetti moments, and a room full of people who know every word too."
- Keep existing sold-out conditional logic (show sold-out copy when status === 'sold-out')
- Keep existing Christmas conditional logic

### Section 5: Artist List (brand new)

- Heading: disco ball emoji + YOUR SOUNDTRACK
- Centre-aligned block of artist names separated by middle dots, ~1.1-1.2rem font
- Artists: SPICE GIRLS, MADONNA, BEYONCE, WHITNEY HOUSTON, KYLIE MINOGUE, OASIS, BON JOVI, TAKE THAT, QUEEN, ROBBIE WILLIAMS, THE KILLERS, ABBA, WHAM!, BLUR, ARCTIC MONKEYS, RIHANNA, CHRISTINA AGUILERA, ROBIN S, N-TRANCE, TLC, CRAIG DAVID, SUGABABES, GIRLS ALOUD, STEPS, FIVE, B*WITCHED, S CLUB 7, BACKSTREET BOYS, FATBOY SLIM
- Subtle different background shade (bg-muted/30 or similar) to stand out
- Subtle glow/accent colour treatment on text (text-primary/80 or coral override)
- Tagline below (smaller, italic): "Zero filler. Maximum sing-along. The songs you've been mouthing along to in Sainsbury's for years."
- Fade-in-on-scroll animation using the existing `useScrollAnimation` hook

### Section 7: Highlights (new hardcoded cards)

- New heading: "WHY EVERYONE SAYS YES TO THIS ONE"
- 5 hardcoded cards replacing the current pipe-delimited highlights rendering:
  1. Microphone emoji -- THE ROOM WHERE EVERYONE KNOWS EVERY WORD -- Wall-to-wall 80s, 90s and 00s perfection...
  2. Dancing emoji -- NIGHT-OUT ENERGY. AFTERNOON TIMING. -- Same Boombastic production...
  3. Friends emoji -- THE ONE PLAN THAT DOESN'T FALL APART -- 2pm Saturday works for everyone...
  4. Cool emoji -- ALL THE FUN. STILL BUZZING BY WEDNESDAY. -- You walked out last time...
  5. Trophy emoji -- TRUST THE TRACK RECORD -- Created by Boombastic Events...
- Keep existing card rendering structure (bg-card border rounded-xl p-5)
- Keep Christmas event hardcoded highlights logic (if isChristmasEvent, show Christmas cards instead)

### Section 9: Social Proof heading

- Change heading text to "WHY YOU LOVE THE 2PM CLUB" (currently "Why You Love The 2PM Club" -- make uppercase for consistency)

### Section 10: Second Eventbrite Embed (new)

- Duplicate EventbriteEmbed component after testimonials, before FAQ
- Height: 700
- containerId: `eventbrite-widget-bottom-{slug}` (different from top)
- Same pink wrapper styling, coral accent override, fallback logic
- Heading: "READY? BOOK YOUR TICKETS"
- Subtext: "Don't miss out -- don't wait for the group chat to decide."
- Pass same eventbriteId, eventSlug, promoCode, eventTitle

### Sticky CTAs

- No changes. scrollToCheckout targets `checkout-section` which is now the TOP embed

---

## RETARGETING MODE (lines 426-679) -- Minor Update

- Line 553: Change `height={400}` to `height={600}`
- Everything else stays exactly as-is

---

## EMAIL MODE (lines 685-979) -- Structural Change

- **Move Eventbrite embed** (currently lines 875-896) to directly after the hero section (after line 815), before the video section
- The new flow becomes: Hero -> Eventbrite Embed -> Video -> Four Reasons -> Share Row -> Sticky CTA
- Change `height={400}` to `height={600}`
- Everything else stays as-is

---

## PRE-SALE MODE (lines 985-1213) -- Minor Update

- Line 1103: Change `height={400}` to `height={600}`
- Everything else stays exactly as-is

---

## Files Modified

| File | What Changes |
|------|-------------|
| `src/pages/EventPage.tsx` | All four rendering modes updated as described above |

No new files. No component extraction. Monolithic structure preserved.

---

## Technical Notes

- The `useScrollAnimation` hook already exists at `src/hooks/useScrollAnimation.tsx` and will be imported for the Artist List fade-in effect
- Two Eventbrite embeds on the same page require different `containerId` values to avoid widget collisions -- handled by using `eventbrite-widget-{slug}` (top) and `eventbrite-widget-bottom-{slug}` (bottom)
- All existing conditional logic preserved: sold-out banners, last-tickets banners, coral accent overrides, Christmas hardcoded content, noindex tags
- All JSON-LD structured data unchanged
- Artist list is hardcoded for now; can be made dynamic via a JSON field in a future update

