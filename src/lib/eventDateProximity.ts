/**
 * Relative date wording for the event page urgency banner.
 *
 * THE 2PM CLUB sells Saturday afternoons, so in the run-up to an event the
 * most persuasive thing a ticket page can say is how close it is. Every label
 * here is derived from the event's own start date and never hard-coded to a
 * weekday, so an event moved to a Friday says "THIS FRIDAY" on its own.
 *
 * Deliberately pure and time-injectable so the wording can be proved against
 * simulated dates, and deliberately NOT persisted anywhere. The Eventbrite
 * sync writes public/events.json on a cron and the static event shells are
 * rebuilt only on deploy, so any stored relative label outlives the day it was
 * true for. A page that says TOMORROW the day after the event is far worse
 * than a page that says nothing, so the wording is recomputed from the
 * immutable `start` on every render instead.
 *
 * All arithmetic runs in Europe/London civil days. These are UK events and the
 * page already prints UK dates, so "TOMORROW" must mean tomorrow in Britain
 * whatever the visitor's own clock is set to.
 */

const UK_TIME_ZONE = 'Europe/London';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const WEEKDAY_NAMES = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

// Whole days since the epoch, counted in UK civil days. Going through
// Date.UTC on the UK calendar parts keeps the arithmetic immune to British
// Summer Time: an event at 14:00+01:00 and a visitor at 23:30 GMT both land on
// the day a person in Britain would name.
const ukDayNumber = (date: Date): number => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(part('year'), part('month') - 1, part('day')) / MS_PER_DAY;
};

const weekdayName = (dayNumber: number): string =>
  WEEKDAY_NAMES[new Date(dayNumber * MS_PER_DAY).getUTCDay()];

// Sunday-anchored index of the week a day falls in, so "from the Sunday before
// the event onwards" and "the following week" are both integer comparisons.
const weekStartDayNumber = (dayNumber: number): number =>
  dayNumber - new Date(dayNumber * MS_PER_DAY).getUTCDay();

/**
 * Banner headline wording for how close an event is, or null when proximity
 * should not lead and the existing scarcity wording should be left alone.
 *
 * TODAY, TOMORROW, THIS SATURDAY (any day from the Sunday that begins the
 * event's own week), NEXT SATURDAY (the week after the visitor's current
 * week), then nothing further out than that. A past date returns null so a
 * stale bookmark or a cached page can never advertise an event that has been
 * and gone.
 *
 * Cancelled and sold-out events are the caller's responsibility: this function
 * only knows about dates.
 */
export const eventDateProximityLabel = (
  startIso: string,
  now: Date = new Date(),
): string | null => {
  if (!startIso) return null;
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;

  const eventDay = ukDayNumber(start);
  const today = ukDayNumber(now);
  const daysUntil = eventDay - today;

  if (daysUntil < 0) return null;
  if (daysUntil === 0) return 'TODAY';
  if (daysUntil === 1) return 'TOMORROW';

  const weeksAway = (weekStartDayNumber(eventDay) - weekStartDayNumber(today)) / 7;
  if (weeksAway === 0) return `THIS ${weekdayName(eventDay)}`;
  if (weeksAway === 1) return `NEXT ${weekdayName(eventDay)}`;
  return null;
};
