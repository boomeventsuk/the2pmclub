

# Leicester-Specific Description Copy

## What Changes

One file: `src/pages/EventPage.tsx`, lines 1624-1645.

Add a new conditional branch for Leicester (`event.cityCode === 'LEIC'`) inside the default description section (the `else` branch after Christmas and sold-out checks).

## New Leicester Copy

**Heading**: WE'RE BRINGING THE PARTY TO WELFORD ROAD

**Pull quote** (green left border instead of pink): "You know that feeling. Mr. Brightside kicks in and suddenly you're 22 again, screaming every word with your mates. No responsibility. No overthinking. Just pure, ridiculous joy."

**Body paragraphs**:
1. "That feeling is coming to Leicester. We're launching THE 2PM CLUB at the home of Leicester Tigers for the ultimate afternoon party -- and you're invited."
2. "Four hours of the biggest hairbrush anthems and sing-alongs, with night-out energy, confetti moments, and a room full of people who know every word too. The perfect party, at a time that actually works."

## How It Fits

The existing conditional chain is:

```text
isChristmasEvent ? (christmas copy)
: event.status === 'sold-out' ? (sold-out copy)
: (standard copy)          <-- this block changes
```

The standard copy block (lines 1624-1645) becomes:

```text
event.cityCode === 'LEIC' ? (leicester launch copy)
: (standard copy -- unchanged)
```

Everything else on the page stays exactly as-is. The blockquote border colour will use the tigers-green accent (`border-[#1A6D37]`) instead of `border-primary` to match the rest of the Leicester page theme.

## File Modified

| File | What Changes |
|------|-------------|
| `src/pages/EventPage.tsx` | Add Leicester conditional in standard description block (~10 lines added) |
