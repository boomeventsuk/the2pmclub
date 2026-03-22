

# Update Navigation, Footer, and Routing for Static Pages

## Summary

Add new navigation links to the header (desktop + mobile), restructure the footer with columns, and update Netlify redirects so static HTML pages are served directly instead of being caught by the SPA fallback.

## 1. Netlify `_redirects` -- Route Static Pages Before SPA Fallback

**File: `public/_redirects`**

Add explicit rewrite rules above the catch-all so Netlify serves the static HTML files directly:

```text
https://the2pmclub.co.uk/*   https://www.the2pmclub.co.uk/:splat  301!
/index.html                  /                                   301!
/:path/index.html            /:path/                              301!

# Static pages — serve their own index.html, not the SPA
/what-to-expect/*   /what-to-expect/index.html   200
/group-bookings/*   /group-bookings/index.html   200
/faqs/*             /faqs/index.html             200
/for-ai/*           /for-ai/index.html           200
/hubs/:splat        /hubs/:splat                 200
/blog/what-is-a-daytime-disco/*       /blog/what-is-a-daytime-disco/index.html   200
/blog/hen-do-daytime-disco/*          /blog/hen-do-daytime-disco/index.html      200

# SPA fallback (everything else)
/*                           /index.html                          200
```

## 2. Desktop Navigation -- Header.tsx

**File: `src/components/Header.tsx`**

Replace the current `primary-nav` contents with:

- **Events** -- `<a href="/#tickets">` (scrolls to tickets on homepage)
- **Cities** -- a hover-dropdown `<div>` with 6 city links (Northampton, Bedford, Milton Keynes, Coventry, Luton, Leicester) using plain `<a href>` tags
- **What to Expect** -- `<a href="/what-to-expect/">`
- **Group Bookings** -- `<a href="/group-bookings/">`
- **FAQs** -- `<a href="/faqs/">`

Keep the social icons and **Book Tickets** CTA button (linking to `/#tickets`).

The Cities dropdown uses CSS hover (`:hover`) with absolute positioning -- no new dependencies. Styled to match the existing dark theme (`bg-card`, `border-border`).

All links are regular `<a>` tags, not React Router `<Link>` components.

## 3. Mobile Menu -- Header.tsx

**File: `src/components/Header.tsx`**

Update the mobile menu section:

- **Events** -- links to `/#tickets`
- **Cities** heading with a toggle (using React `useState`) to expand/collapse the 6 city links underneath
- **What to Expect**, **Group Bookings**, **FAQs** -- plain `<a>` links
- Keep social links (Facebook, Email) at bottom

## 4. Footer Restructure -- Footer.tsx

**File: `src/components/Footer.tsx`**

Change from single centered column to a multi-column layout:

- **Column 1**: Logo + email + social icons (existing content)
- **Column 2 "Explore"**: What to Expect, Group Bookings, FAQs, Blog
- **Column 3 "Cities"**: Northampton, Bedford, Milton Keynes, Coventry, Luton, Leicester

Desktop: 3 columns side by side. Mobile: stacked. Copyright stays full-width at bottom. All links are plain `<a>` tags.

## 5. CSS for Dropdown

**File: `index.html`** (where existing nav CSS lives, lines 367-393)

Add styles for the Cities dropdown:

- `.cities-dropdown` -- `position: relative; display: inline-block`
- `.cities-dropdown-menu` -- hidden by default, shown on hover, absolute positioned, dark card background, rounded, shadow
- On mobile: dropdown styles not needed (handled by accordion in mobile menu)

## Files Modified

| File | What Changes |
|------|-------------|
| `public/_redirects` | Add static page rewrite rules above SPA fallback |
| `src/components/Header.tsx` | New nav links, Cities dropdown, updated mobile menu |
| `src/components/Footer.tsx` | Multi-column layout with Explore and Cities columns |
| `index.html` | Add CSS for Cities dropdown hover menu |

