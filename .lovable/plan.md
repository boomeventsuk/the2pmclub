

## Pre-Sale Landing Page: Franklin's Gardens Northampton

### What You're Getting

A special **pre-sale experience** for your group with:
- Hidden from the public homepage (not visible to general visitors)
- Accessible only via direct link: `/events/060626-2PM-NPTON/`
- Fun, exclusive messaging emphasising they're part of an inner circle
- Context about Franklin's Gardens being the home of Northampton Saints
- Reference to the sold-out October event success
- Streamlined layout focused on booking

---

### Pre-Sale Messaging Preview

Your group will see:

> **Welcome to the Pre-Sale!**
>
> You're part of the group. Let's get this party started!
>
> We're back at Franklin's Gardens - the home of Northampton Saints.
> Last time at Cinch Stadium? SOLD OUT. This is your early access.
>
> Saturday 6th June 2026 | 2pm-6pm | Franklin's Gardens, Northampton

---

### Implementation Tasks

#### 1. Update `public/events.json`

Change the Franklin's Gardens event entry:

| Field | Current | New Value |
|-------|---------|-----------|
| `status` | `"just-announced"` | `"pre-sale"` |
| `isHidden` | (not set) | `true` |

This hides the event from the homepage while keeping the page accessible via direct URL.

---

#### 2. Add Pre-Sale Mode to `src/pages/EventPage.tsx`

Create a new rendering branch for `status === 'pre-sale'` (similar to the retargeting mode):

**Pre-Sale Hero Section:**
- Large, fun headline: "Welcome to the Pre-Sale!"
- Subheading: "You're part of the group. Let's get this party started!"
- Venue context: "We're back at Franklin's Gardens - the home of Northampton Saints"
- Social proof: "Last time at Cinch Stadium? SOLD OUT. This is your early access."
- Event poster with coral glow shadow
- Event details (date, time, venue)
- Coral-themed CTA button: "Book Your Tickets"

**Pre-Sale Page Sections:**
1. Hero with exclusive messaging
2. Eventbrite checkout embed (immediate booking)
3. Brief "Why You'll Love It" cards (4 reasons)
4. Share buttons (so they can invite their group)
5. Footer

**What's NOT shown (to keep it focused):**
- Full event description
- Video section
- Photo gallery
- FAQ accordion
- Extended testimonials

---

#### 3. Add Pre-Sale CSS to `src/index.css`

Subtle styling for the pre-sale banner/badge:

```css
/* Pre-sale exclusive badge */
.pre-sale-badge {
  background: linear-gradient(135deg, #E88B73 0%, #F4A582 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

### Technical Summary

| File | Changes |
|------|---------|
| `public/events.json` | Add `isHidden: true`, change status to `"pre-sale"` |
| `src/pages/EventPage.tsx` | Add pre-sale mode rendering with exclusive messaging |
| `src/index.css` | Add `.pre-sale-badge` styling |

---

### Going Public Later

When you're ready to open sales to everyone:

1. Change `status` from `"pre-sale"` to `"just-announced"` 
2. Remove `isHidden: true` (or set to `false`)

The full event page layout with video, gallery, FAQ etc will automatically appear, and the event will show on the homepage.

---

### Pre-Sale URL for Your Group

```
https://www.the2pmclub.co.uk/events/060626-2PM-NPTON/
```

