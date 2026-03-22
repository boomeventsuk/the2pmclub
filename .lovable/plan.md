

# Rename "Cities" to "Locations" in Header.tsx

## Summary

Simple text rename -- change "Cities" to "Locations" in three places within `Header.tsx`. The structure, links, dropdown, and styling all stay exactly as they are.

## Changes

**File: `src/components/Header.tsx`**

1. **Line 5**: Rename state variable `citiesOpen` to `locationsOpen` (and its setter)
2. **Line 40**: Desktop dropdown trigger text: `Cities ▾` → `Locations ▾`
3. **Line 113**: Mobile accordion `setCitiesOpen` → `setLocationsOpen`
4. **Line 116**: Mobile accordion label: `Cities` → `Locations`
5. **Line 119**: `citiesOpen` → `locationsOpen` in the conditional render

No other files or structural changes needed -- the nav already has the correct links (Events, dropdown with 6 locations, What to Expect, Group Bookings, FAQs, Book Tickets CTA, social icons). This is purely a label rename.

