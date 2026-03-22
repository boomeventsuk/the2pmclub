

# Create Shared CSS and Reference HTML Snippets

## Summary

Create three files that centralise the design system for all static HTML pages, eliminating duplicated inline `<style>` blocks.

## Files to Create

### 1. `public/shared-styles.css`

Extract and consolidate all styles currently duplicated across static pages (sourced from `public/faqs/index.html` lines 9-370 and `index.html` lines 368-449). Contents:

- **Google Fonts import** (Poppins + Inter)
- **CSS custom properties** (`:root` block with all design tokens)
- **Reset/base** (`box-sizing`, `body` styles)
- **Typography** (`h1`, `h2`, `h3`, `p`, `li`, `a` styles with resolved values)
- **Layout** (`.container` class)
- **Components**: `.glass-card`, `.card`, `.btn-primary`, `.btn-large`
- **Text utilities**: `.text-muted`, `.text-primary`, `.text-secondary`
- **Header**: `.site-header`, `.header-inner`, `.primary-nav`, `.header-actions`, `.header-icons`, `.nav-toggle`, `.locations-dropdown` (hover + `.open` class), `.locations-trigger`, `.locations-dropdown-menu`, `.locations-dropdown-item`
- **Mobile menu**: `.mobile-menu`, `body.nav-open` toggle, mobile-specific link/button styles, `.locations-sub`
- **Footer**: `.site-footer`, `.footer-grid` (3-col with mobile stack), `.footer-heading`, `.footer-link`, `.footer-copyright`, `.footer-socials`
- **FAQ accordion**: `.faq-item`, `.faq-question` (with `+`/`-` pseudo-element), `.faq-answer` (max-height transition), `.faq-item.open` states
- **Photo grid**: `.photo-grid-3`, `.photo-grid-2` responsive rules
- **Share icons**: `.share-icons`, `.icon-btn`
- **Header spacer**: `.header-spacer` (height matching fixed header)
- **Responsive breakpoints**: 900px (mobile nav), 768px (footer stack), 600px (photo grids)

All values resolved to plain CSS -- no Tailwind, no `@apply`.

### 2. `public/shared-header.html`

Reference HTML snippet showing the exact header structure:
- `<header class="site-header">` with `.header-inner` wrapper
- Logo linking to `/`
- `<nav class="primary-nav">` with: Events (`/#tickets`), Locations dropdown (6 hub links), What to Expect, Group Bookings, FAQs
- `.header-actions` with Book Tickets CTA
- `.header-icons` with Instagram, Facebook, Email SVGs
- `.nav-toggle` hamburger button
- `#mobile-menu` with accordion Locations section
- Inline `<script>` for hamburger toggle + locations accordion (vanilla JS)
- `<div class="header-spacer"></div>` after header

### 3. `public/shared-footer.html`

Reference HTML snippet showing the footer structure:
- `<footer class="site-footer">`
- `.footer-grid` with 3 columns:
  - **Col 1**: Boombastic logo, email link, Facebook + Instagram SVG icons
  - **Col 2 "Explore"**: What to Expect, Group Bookings, FAQs, Blog
  - **Col 3 "Locations"**: 6 hub links
- `.footer-copyright` with dynamic year via inline `<script>`

## Usage

Static pages replace their inline `<style>` block with:
```html
<link rel="stylesheet" href="/shared-styles.css">
```
And copy the header/footer HTML from the reference files.

## Files Modified

| File | Action |
|------|--------|
| `public/shared-styles.css` | Create -- complete design system CSS |
| `public/shared-header.html` | Create -- header HTML reference snippet |
| `public/shared-footer.html` | Create -- footer HTML reference snippet |

