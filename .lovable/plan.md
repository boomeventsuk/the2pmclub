

# Fix Layout Inconsistencies Across Static Pages

## The Core Problem

All 13 static HTML pages use **Tailwind CSS utility classes** (`text-4xl`, `mb-4`, `space-y-8`, `rounded-xl`, `shadow-lg`, `p-8`, `border-l-4`, `leading-relaxed`, `bg-gradient-to-r`, etc.) throughout their content. But these pages only load `shared-styles.css`, which has **no Tailwind**. The React homepage works because Vite processes Tailwind at build time. The static pages get none of that -- so spacing, font sizes, borders, shadows, padding, and gradients are all broken on the live site.

This is why the static pages look unprofessional compared to the homepage and ticket pages.

## What Needs to Change

### 1. Add Tailwind utility classes to `shared-styles.css`

Add resolved CSS for every utility class used across the static pages. Based on scanning all 13 files, the classes needed are:

**Typography**: `text-4xl`, `text-3xl`, `text-2xl`, `text-xl`, `text-lg`, `text-sm`, `text-base`, `font-medium`, `font-semibold`, `font-bold`, `italic`, `not-italic`, `underline`, `leading-relaxed`

**Spacing**: `mb-1` through `mb-8`, `mt-2`, `mt-4`, `mt-8`, `mt-12`, `p-4`, `p-6`, `p-8`, `px-4`, `py-2`, `py-3`, `py-12`, `pt-24`, `pl-4`, `pl-6`, `pb-2`, `space-y-3`, `space-y-4`, `space-y-5`, `space-y-8`, `gap-3`, `gap-10`

**Layout**: `flex`, `flex-wrap`, `inline-flex`, `inline-block`, `block`, `items-center`, `justify-center`, `justify-between`, `text-center`, `text-left`, `w-full`, `max-w-4xl`, `mx-auto`

**Visual**: `rounded-xl`, `rounded-md`, `rounded-full`, `shadow-lg`, `border-l-4`, `border-primary`, `border-secondary`, `border-accent`, `bg-gradient-to-r`, `from-primary`, `to-secondary`

**Colour**: `text-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-primary`, `border-secondary`, `border-accent`, `bg-primary`, `hover:bg-primary`, `hover:text-primary`, `hover:text-primary-foreground`

**Responsive**: `md:text-5xl`, `md:text-3xl`

### 2. Fix dropdown class name mismatch in `Header.tsx`

`Header.tsx` uses `cities-dropdown`, `cities-dropdown-trigger`, `cities-dropdown-menu`, `cities-dropdown-item`. The CSS in `index.html` matches these. But `shared-styles.css` defines `locations-dropdown` variants.

Rename the 4 class references in `Header.tsx` to `locations-dropdown`, `locations-trigger`, `locations-dropdown-menu`, `locations-dropdown-item`.

### 3. Update `index.html` inline CSS

Rename the `.cities-dropdown*` selectors (lines 395-410) to `.locations-dropdown*` to match.

### 4. Rename "Cities" to "Locations" in `Footer.tsx`

Line 63: `<h3>Cities</h3>` becomes `<h3>Locations</h3>`.

## Files Modified

| File | Change |
|------|--------|
| `public/shared-styles.css` | Add ~80 Tailwind utility classes as resolved CSS |
| `src/components/Header.tsx` | Rename 4 `cities-*` class references to `locations-*` |
| `src/components/Footer.tsx` | "Cities" to "Locations" |
| `index.html` | Rename `.cities-dropdown*` CSS selectors to `.locations-*` |

## Result

Every static page will render with correct spacing, typography, cards, borders, gradients, and shadows -- matching the quality of the React homepage and ticket pages. The Locations dropdown will work consistently everywhere.

