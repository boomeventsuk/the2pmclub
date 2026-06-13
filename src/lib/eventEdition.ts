export interface EventEditionInput {
  title?: string;
  slug?: string;
  statusLabel?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  eventType?: string;
  isEightiesEdition?: boolean;
}

const EIGHTIES_PATTERN = /80s edition|2pm80s|2pm-80s|goes full-on 80s|your best 80s night out/i;
const EIGHTIES_EVENT_SLUGS = new Set([
  "250726-2PM-NPTON",
  "120926-2PM-BED",
  "190926-2PM-COV",
  "260926-2PM-MK",
  "031026-2PM-LUT",
]);

export const isEightiesEditionEvent = (event?: EventEditionInput | null): boolean => {
  if (!event) return false;
  if (event.isEightiesEdition) return true;
  if (event.slug && EIGHTIES_EVENT_SLUGS.has(event.slug.toUpperCase())) return true;

  const searchable = [
    event.eventType,
    event.title,
    event.slug,
    event.statusLabel,
    event.subtitle,
    event.description,
    event.image,
  ].filter(Boolean).join(" ");

  return EIGHTIES_PATTERN.test(searchable);
};

export const EIGHTIES_EVENT_SUBLINE = "Your best 80s night out. In the middle of the afternoon.";
export const EIGHTIES_MUSIC_LINE = "Iconic 80s anthems.";
export const EIGHTIES_MUSIC_FAQ = "80s anthems. Wall-to-wall songs you know every word to. Think Whitney, Wham!, Madonna, Bon Jovi, Queen, Cyndi Lauper and A-ha.";
export const EIGHTIES_WHY_BODY = "Wall-to-wall 80s. Confetti, lights, and the moment the whole room sings together.";
export const EIGHTIES_SOUNDTRACK_LINE = "Madonna. Wham!. Whitney. Queen. Bon Jovi. Cyndi Lauper. A-ha. Every chorus you still know by heart.";
export const EVENT_COPY_REVISION = "2026-06-13-80s-event-pages-v2";

export const GENERIC_EVENT_SUBLINE = "Your best night out. In the middle of the afternoon.";
export const GENERIC_MUSIC_LINE = "Iconic 80s, 90s and 00s anthems.";
export const GENERIC_MUSIC_FAQ = "80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. Whitney, Wham!, Spice Girls, Beyonce, Take That, The Killers, Oasis.";
export const GENERIC_WHY_BODY = "Wall-to-wall 80s, 90s and 00s. Confetti, lights, and the moment the whole room sings together.";
export const GENERIC_SOUNDTRACK_LINE = "Spice Girls. Oasis. Whitney. ABBA. Bon Jovi. Take That. Beyonce. Every chorus you still know by heart.";

export const musicLineForEvent = (event?: EventEditionInput | null) =>
  isEightiesEditionEvent(event) ? EIGHTIES_MUSIC_LINE : GENERIC_MUSIC_LINE;

export const eventSublineForEvent = (event?: EventEditionInput | null) =>
  isEightiesEditionEvent(event) ? EIGHTIES_EVENT_SUBLINE : GENERIC_EVENT_SUBLINE;

export const musicFaqForEvent = (event?: EventEditionInput | null) =>
  isEightiesEditionEvent(event) ? EIGHTIES_MUSIC_FAQ : GENERIC_MUSIC_FAQ;

export const whyBodyForEvent = (event?: EventEditionInput | null) =>
  isEightiesEditionEvent(event) ? EIGHTIES_WHY_BODY : GENERIC_WHY_BODY;

export const soundtrackLineForEvent = (event?: EventEditionInput | null) =>
  isEightiesEditionEvent(event) ? EIGHTIES_SOUNDTRACK_LINE : GENERIC_SOUNDTRACK_LINE;
