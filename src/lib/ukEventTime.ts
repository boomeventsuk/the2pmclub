const UK_EVENT_TIME_ZONE = 'Europe/London';

const ordinal = (day: number): string => {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][day % 10] || 'th';
};

const ukParts = (iso: string) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_EVENT_TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso));
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

export const formatUkEventDate = (iso: string): string => {
  const p = ukParts(iso);
  const day = Number(p.day);
  return `${p.weekday} ${day}${ordinal(day)} ${p.month} ${p.year}`;
};

export const formatUkEventShortDate = (iso: string): string => {
  const p = ukParts(iso);
  const day = Number(p.day);
  return `${p.weekday.toUpperCase()} ${day}${ordinal(day).toUpperCase()} ${p.month.toUpperCase()}`;
};

export const formatUkEventDateWithoutYear = (iso: string): string => {
  const p = ukParts(iso);
  const day = Number(p.day);
  return `${p.weekday} ${day}${ordinal(day)} ${p.month}`;
};

export const formatUkEventTime = (iso: string): string => {
  const p = ukParts(iso);
  const hour = Number(p.hour);
  const hour12 = hour > 12 ? hour - 12 : hour === 0 || hour === 24 ? 12 : hour;
  const minutes = p.minute === '00' ? '' : `:${p.minute}`;
  return `${hour12}${minutes}${hour >= 12 && hour !== 24 ? 'pm' : 'am'}`;
};

export const formatUkEventTimeRange = (start: string, end: string): string =>
  `${formatUkEventTime(start)} to ${formatUkEventTime(end)}`;
