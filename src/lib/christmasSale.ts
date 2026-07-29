const CHRISTMAS_2026_EVENT_CODES = new Set([
  '281126-2PM-LEIC',
  '051226-2PM-NPTON',
  '121226-2PM-NPTON',
  '191226-2PM-COV',
  '191226-2PM-BED',
]);

export const CHRISTMAS_2026_SALE_START = Date.parse('2026-07-31T11:00:00Z');
export const CHRISTMAS_2026_LAUNCH_LABEL_END = Date.parse('2026-08-02T23:00:00Z');

const isChristmasLaunchEvent = (slug?: string) =>
  Boolean(slug && CHRISTMAS_2026_EVENT_CODES.has(slug.toUpperCase()));

export const christmasSalePageLabel = (
  slug: string | undefined,
  fallback?: string,
  isSoldOut = false,
  now = Date.now(),
) => {
  if (isSoldOut || !isChristmasLaunchEvent(slug)) return fallback;
  if (now < CHRISTMAS_2026_SALE_START) return 'Tickets on sale Friday at 12 noon';
  if (now < CHRISTMAS_2026_LAUNCH_LABEL_END) return 'Tickets on sale now';
  return fallback;
};

export const christmasSaleBadgeLabel = (
  slug: string | undefined,
  fallback?: string,
  isSoldOut = false,
  now = Date.now(),
) => {
  if (isSoldOut || !isChristmasLaunchEvent(slug)) return fallback;
  if (now < CHRISTMAS_2026_SALE_START) return 'ON SALE FRI';
  if (now < CHRISTMAS_2026_LAUNCH_LABEL_END) return 'ON SALE NOW';
  return fallback;
};
