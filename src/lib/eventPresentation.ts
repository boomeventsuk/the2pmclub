const STATUS_LABEL_OVERRIDES: Record<string, string> = {
  '031026-2PM-NPTON': 'Final 25 tickets',
};

export const customerStatusLabel = (
  slug: string,
  sourceLabel?: string,
  soldOut = false,
): string | undefined => {
  if (soldOut) return sourceLabel;
  return STATUS_LABEL_OVERRIDES[slug.toUpperCase()] || sourceLabel;
};

export const ticketPriceWithFee = (label?: string): string => {
  if (!label) return '';
  const clean = label.replace(/\.00\b/, '');
  return /booking fee/i.test(clean) ? clean : `${clean} + booking fee`;
};

export const groupTicketAvailability = (label?: string): string =>
  label ? `${label}. Limited availability.` : '';
