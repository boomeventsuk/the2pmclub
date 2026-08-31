const UK_EVENT_TIME_ZONE = "Europe/London";

const ordinal = (day) => {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  return ["th", "st", "nd", "rd"][day % 10] || "th";
};

const ukParts = (iso) => Object.fromEntries(
  new Intl.DateTimeFormat("en-GB", {
    timeZone: UK_EVENT_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso)).map(({ type, value }) => [type, value])
);

export function formatUkEventDate(iso) {
  const p = ukParts(iso);
  const day = Number(p.day);
  return `${p.weekday} ${day}${ordinal(day)} ${p.month} ${p.year}`;
}

export function formatUkEventTime(iso) {
  const p = ukParts(iso);
  const hour = Number(p.hour);
  const hour12 = hour > 12 ? hour - 12 : hour === 0 || hour === 24 ? 12 : hour;
  const minutes = p.minute === "00" ? "" : `:${p.minute}`;
  return `${hour12}${minutes}${hour >= 12 && hour !== 24 ? "pm" : "am"}`;
}

export function formatUkEventTimeRange(start, end) {
  return `${formatUkEventTime(start)} to ${formatUkEventTime(end)}`;
}

export function customerStatusLabel(event) {
  if (event.status !== "sold-out" && event.slug.toUpperCase() === "031026-2PM-NPTON") {
    return "Final 25 tickets";
  }
  return event.statusLabel;
}

export function ticketPriceWithFee(label) {
  if (!label) return "";
  const clean = String(label).replace(/\.00\b/, "");
  return /booking fee/i.test(clean) ? clean : `${clean} + booking fee`;
}

export function groupTicketAvailability(label) {
  return label ? `${label}. Limited availability.` : "";
}
