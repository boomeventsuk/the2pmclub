

## Convert Franklin's Gardens to Standard Event Page

### Summary

Remove the pre-sale mode from the Franklin's Gardens Northampton event (6th June 2026) and restore it to the full standard event page layout with video, gallery, FAQ, and all sections.

The coral/tropical colour scheme will be preserved on buttons and icons.

---

### What Changes

| Current (Pre-Sale) | After (Standard) |
|---|---|
| Hidden from homepage | Visible on homepage |
| Streamlined layout (no video/gallery/FAQ) | Full layout with all sections |
| "Welcome to the Pre-Sale!" messaging | Standard "THE 2PM CLUB" branding |
| Pre-sale badge | No special badge |
| noindex meta tag | Fully indexed by search engines |

---

### Implementation

#### Update `public/events.json`

For the Franklin's Gardens event (id: 114), make two changes:

| Field | Current Value | New Value |
|-------|---------------|-----------|
| `status` | `"pre-sale"` | `"just-announced"` |
| `isHidden` | `true` | Remove this field entirely |

The `accentColor: "coral"` field stays in place, so the event page will still have:
- Coral gradient "Book Tickets" button
- Coral-tinted Calendar, Clock, and MapPin icons
- Coral glow shadow on the event poster

---

### What the Page Will Include

Once converted to standard mode, the page will display:

1. Hero with poster + details card (coral accents)
2. Intro description section
3. "Why Daytime Discos Are a Game Changer" section
4. Video section (standard 2PM video)
5. Photo gallery
6. "Why You Love The 2PM Club" testimonials
7. FAQ accordion
8. Eventbrite checkout embed
9. Share buttons
10. Footer

All with the Franklin's Gardens content you already have (venue info, Northampton Saints reference, sold-out history in the description).

---

### Files to Update

| File | Change |
|------|--------|
| `public/events.json` | Change status from `"pre-sale"` to `"just-announced"`, remove `isHidden` |

No code changes required - the standard mode already supports coral accents.

---

### Technical Notes

- Event will appear on homepage sorted by date (June 2026)
- Page URL stays the same: `/events/060626-2PM-NPTON/`
- All tracking and OG tags work automatically
- Fully indexed by search engines (no noindex tag)

