import type { Context } from "https://edge.netlify.com";

/**
 * tickets-utm.ts
 *
 * The /tickets/<slug>/ fallback is a 302 in _redirects with a fixed
 * ?aff=BoomWeb destination, so incoming utm_* tags were dropped on the way to
 * Eventbrite. When (and only when) the request carries utm_* parameters, this
 * builds the same Eventbrite destination with aff=BoomWeb plus those tags.
 * Requests without utm_* fall straight through to the _redirects rule, so the
 * existing behaviour is unchanged for them. No cookies, no storage, no logging.
 */

type FeedItem = { slug?: string; eventbriteId?: string | number };

const UTM = /^utm_[a-z_]{1,30}$/i;

export function ticketRedirect(requestUrl: string, feed: FeedItem[]): string | null {
  const url = new URL(requestUrl);
  const match = url.pathname.match(/^\/tickets\/([a-z0-9-]+)\/?$/i);
  if (!match) return null;
  const tags = [...url.searchParams.entries()].filter(([k, v]) => UTM.test(k) && v.length <= 200);
  if (!tags.length) return null;
  const slug = match[1].toLowerCase();
  const item = feed.find((e) => String(e.slug || "").toLowerCase() === slug);
  const id = String(item?.eventbriteId || "");
  if (!/^\d+$/.test(id)) return null;
  const dest = new URL(`https://www.eventbrite.co.uk/e/${id}`);
  dest.searchParams.set("aff", "BoomWeb");
  for (const [k, v] of tags) dest.searchParams.set(k.toLowerCase(), v);
  return dest.toString();
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  if (![...url.searchParams.keys()].some((k) => UTM.test(k))) return context.next();
  try {
    const res = await fetch(new URL("/upcoming-events.json", url.origin).toString());
    if (!res.ok) return context.next();
    const location = ticketRedirect(request.url, await res.json());
    if (!location) return context.next();
    return new Response(null, { status: 302, headers: { location, "cache-control": "no-store" } });
  } catch (_) {
    return context.next();
  }
}

export const config = {
  path: "/tickets/*",
};
