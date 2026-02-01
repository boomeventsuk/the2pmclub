
# Urgency Update Plan for Luton and Bedford Events

## Summary
Update the urgency messaging and scarcity wording for two events:
1. **Luton (this Saturday, 7th Feb)** - Change to "LAST 25 TICKETS" + update fullDescription with "this Saturday" wording
2. **Bedford (14th Feb)** - Change to "LAST 50 TICKETS" status with urgent messaging

---

## Changes Required

### 1. Luton Event — `070226-2PM-LUT`

**In `public/events.json`:**

| Field | Current Value | New Value |
|-------|---------------|-----------|
| `urgencyLabel` | `"LAST 50 TICKETS"` | `"LAST 25 TICKETS"` |
| `fullDescription` | Generic wording | Update to include "this Saturday" throughout |

**Updated fullDescription:**
```text
LET YOUR HAIR DOWN. THIS SATURDAY! 🎉

Only 25 tickets left for this Saturday's Daytime Disco in Luton!

Remember when going OUT OUT didn't require a week's recovery? When you could sing every word, lose your voice, and still feel human the next day?

The 2PM Club is the night out that never gets cancelled. No more 47-message group chats. No more "maybe next time." Everyone says yes to this one.

This Saturday. 2pm. The Hat Factory, Luton. Don't miss it!
```

---

### 2. Bedford Event — `140226-2PM-BED`

**In `public/events.json`:**

| Field | Current Value | New Value |
|-------|---------------|-----------|
| `status` | `"selling-fast-amber"` | `"last-tickets"` |
| `urgencyLabel` | `"TICKETS SELLING FAST"` | `"LAST 50 TICKETS"` |
| `fullDescription` | Generic wording | Update with "two weeks to go" urgency |

**Updated fullDescription:**
```text
LET YOUR HAIR DOWN. PROPERLY

Only 50 tickets left — just two weeks to go!

Remember when going OUT OUT didn't require a week's recovery? When you could sing every word, lose your voice, and still feel human the next day?

The 2PM Club is the night out that never gets cancelled. No more 47-message group chats. No more "maybe next time." Everyone says yes to this one.

Valentine's Day Saturday. 2pm. Bedford Esquires. Your mates are already booking!
```

---

## How Urgency Messaging Flows

No code changes are needed — the existing system already handles everything:

```text
events.json (status + urgencyLabel)
        ↓
Homepage Card → Shows urgency strip badge with label
        ↓
Event Page → Shows sticky banner + hero badge with label
        ↓
Mobile Sticky CTA → Shows urgency label for last-tickets status
```

---

## Files to Edit

| File | Changes |
|------|---------|
| `public/events.json` | Update 2 events (Luton: urgencyLabel + fullDescription, Bedford: status + urgencyLabel + fullDescription) |

---

## What Will Change on the Website

### Luton Event Page & Card
- Urgency badge: **"LAST 25 TICKETS"** (was "LAST 50 TICKETS")
- Pink sticky banner with "LAST 25 TICKETS"
- Copy emphasises "this Saturday" throughout

### Bedford Event Page & Card
- Status changes from amber "selling fast" to urgent "last tickets"
- Urgency badge: **"LAST 50 TICKETS"** (was "TICKETS SELLING FAST")
- Gets the pink sticky urgency banner (previously didn't have one)
- Copy emphasises "two weeks to go" urgency

### Coventry & Milton Keynes
- No changes (remain as "selling-fast-amber" status)
