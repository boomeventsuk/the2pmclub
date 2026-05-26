import { getConsentStatus, isConsentGranted } from './cookieConsent';

declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (...args: any[]) => void;
  }
}

export interface EventTrackingContext {
  eventbriteId?: string;
  city?: string;
  venue?: string;
  date?: string;
  startIso?: string;
  status?: string;
  price?: number;
  source?: string;
  eventType?: string;
  brand?: string;
}

const TRACKING_SESSION_KEY = 'boom_tracking_session_id';
const trackedOnce = new Set<string>();

// Debug mode helper
const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('eb_debug') === '1' || localStorage.getItem('eb_debug') === '1';
};

const debugLog = (...args: any[]) => {
  if (isDebugMode()) {
    console.log('[EB Debug]', ...args);
  }
};

const compact = (payload: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
};

const cleanIdPart = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
};

const getRandomPart = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const createEventId = (eventName: string, slug: string, stableId?: string): string => {
  return cleanIdPart(`${eventName}_${slug}_${stableId || getRandomPart()}`);
};

const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const getTrackingSessionId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const existing = sessionStorage.getItem(TRACKING_SESSION_KEY);
    if (existing) return existing;
    const next = `sess_${getRandomPart()}`;
    sessionStorage.setItem(TRACKING_SESSION_KEY, next);
    return next;
  } catch {
    return undefined;
  }
};

const getBrowserTrackingContext = (): Record<string, any> => {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const fbclid = url.searchParams.get('fbclid') || undefined;
  const fbc = getCookieValue('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  return compact({
    tracking_session_id: getTrackingSessionId(),
    event_source_url: window.location.href,
    page_path: window.location.pathname + window.location.search,
    meta_browser_id: getCookieValue('_fbp'),
    meta_click_id: fbc,
    fbclid,
    utm_source: url.searchParams.get('utm_source') || undefined,
    utm_medium: url.searchParams.get('utm_medium') || undefined,
    utm_campaign: url.searchParams.get('utm_campaign') || undefined,
    utm_content: url.searchParams.get('utm_content') || undefined,
    utm_term: url.searchParams.get('utm_term') || undefined
  });
};

const buildEventContext = (
  slug: string,
  title: string,
  context: EventTrackingContext = {}
): Record<string, any> => {
  return compact({
    event_slug: slug,
    event_type: context.eventType || '2PM',
    event_title: title,
    eventbrite_id: context.eventbriteId,
    event_city: context.city,
    event_venue: context.venue,
    event_date: context.date,
    event_start: context.startIso,
    event_status: context.status,
    event_price: context.price,
    event_brand: context.brand || 'THE 2PM CLUB',
    interaction_source: context.source,
    ...getBrowserTrackingContext()
  });
};

const buildMetaParams = (
  slug: string,
  title: string,
  context: EventTrackingContext = {},
  extra: Record<string, any> = {}
): Record<string, any> => {
  return compact({
    content_name: title,
    content_type: 'event',
    content_ids: [slug],
    contents: [
      compact({
        id: slug,
        quantity: 1,
        item_price: context.price
      })
    ],
    eventbrite_id: context.eventbriteId,
    city: context.city,
    venue: context.venue,
    event_date: context.date || context.startIso,
    brand: context.brand || 'THE 2PM CLUB',
    ...extra
  });
};

const sendServerEvent = (
  eventName: string,
  eventId: string,
  metaParams: Record<string, any>,
  eventContext: Record<string, any>,
  extra: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;
  if (!isConsentGranted()) {
    debugLog('Server tracking blocked (no consent):', eventName, eventContext);
    return;
  }

  const payload = compact({
    event_name: eventName,
    event_id: eventId,
    consent_status: getConsentStatus(),
    ...eventContext,
    content_name: metaParams.content_name,
    content_type: metaParams.content_type,
    content_ids: metaParams.content_ids,
    contents: metaParams.contents,
    eventbrite_id: metaParams.eventbrite_id || eventContext.eventbrite_id,
    currency: metaParams.currency,
    value: metaParams.value,
    ...extra
  });
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/.netlify/functions/meta-event', blob)) return;
    }
    fetch('/.netlify/functions/meta-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true
    }).catch((error) => debugLog('Server tracking failed:', error));
  } catch (error) {
    debugLog('Server tracking failed:', error);
  }
};

const normaliseTitleAndContext = (
  titleOrContext?: string | EventTrackingContext,
  context?: EventTrackingContext
): { title: string; context: EventTrackingContext } => {
  if (typeof titleOrContext === 'object') {
    return { title: '', context: titleOrContext };
  }
  return { title: titleOrContext || '', context: context || {} };
};

const shouldTrackOnce = (eventName: string, slug: string): boolean => {
  const key = `${eventName}:${slug}`;
  if (trackedOnce.has(key)) {
    debugLog('Meta Pixel event skipped as duplicate:', key);
    return false;
  }
  trackedOnce.add(key);
  return true;
};

// Helper to track Meta Pixel events - only fires if consent granted (for browsing events)
const trackFbEvent = (eventName: string, params?: Record<string, any>, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq && isConsentGranted()) {
    if (eventId) {
      window.fbq('track', eventName, params, { eventID: eventId });
    } else {
      window.fbq('track', eventName, params);
    }
    console.log(`[Meta Pixel] ${eventName}`, params);
    debugLog('Meta Pixel fired:', eventName, params, eventId);
  } else {
    debugLog('Meta Pixel blocked (no consent):', eventName, params);
  }
};

// Conversion tracking calls fbq directly; Meta's consent state still controls transmission.
const trackFbConversion = (eventName: string, params?: Record<string, any>, eventId?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('track', eventName, params, { eventID: eventId });
    } else {
      window.fbq('track', eventName, params);
    }
    console.log(`[Meta Pixel Conversion] ${eventName}`, params);
    debugLog('Meta Pixel conversion fired:', eventName, params, eventId);
  }
};

export const pushToDataLayer = (event: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  debugLog('DataLayer push:', event);
};

// Generic SPA page_view - fired on every route change. Respects consent.
export const trackPageView = (path: string, title: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined
  });

  trackFbEvent('PageView');
};

// ViewContent - respects consent (browsing behaviour)
export const trackEventPageView = (slug: string, title: string, context: EventTrackingContext = {}) => {
  if (!shouldTrackOnce('ViewContent', slug)) return;
  const eventId = createEventId('ViewContent', slug);
  const eventContext = buildEventContext(slug, title, context);
  const metaParams = buildMetaParams(slug, title, context);
  pushToDataLayer({
    event: 'eventpage_view',
    event_id: eventId,
    ...eventContext
  });
  
  trackFbEvent('ViewContent', metaParams, eventId);
  sendServerEvent('ViewContent', eventId, metaParams, eventContext);
};

// InitiateCheckout - user has shown clear ticket-buying intent.
export const trackBookClick = (
  slug: string,
  titleOrContext?: string | EventTrackingContext,
  maybeContext?: EventTrackingContext
) => {
  const { title, context } = normaliseTitleAndContext(titleOrContext, maybeContext);
  if (!shouldTrackOnce('InitiateCheckout', slug)) return;
  const eventId = createEventId('InitiateCheckout', slug);
  const eventContext = buildEventContext(slug, title, context);
  const metaParams = buildMetaParams(slug, title, context);
  pushToDataLayer({
    event: 'eventpage_book_click',
    event_id: eventId,
    ...eventContext
  });
  
  trackFbConversion('InitiateCheckout', metaParams, eventId);
  sendServerEvent('InitiateCheckout', eventId, metaParams, eventContext);
};

// AddToCart - first meaningful interaction inside the embedded checkout.
export const trackAddToCart = (
  slug: string,
  titleOrContext?: string | EventTrackingContext,
  maybeContext?: EventTrackingContext
) => {
  const { title, context } = normaliseTitleAndContext(titleOrContext, maybeContext);
  if (!shouldTrackOnce('AddToCart', slug)) return;
  const eventId = createEventId('AddToCart', slug);
  const eventContext = buildEventContext(slug, title, context);
  const metaParams = buildMetaParams(slug, title, context);
  pushToDataLayer({
    event: 'add_to_cart',
    event_id: eventId,
    ...eventContext
  });
  
  trackFbConversion('AddToCart', metaParams, eventId);
  sendServerEvent('AddToCart', eventId, metaParams, eventContext);
};

// Purchase - browser confirmation from the Eventbrite widget. Reconcile against Eventbrite orders.
export const trackPurchase = (
  slug: string,
  title: string,
  value?: number,
  orderId?: string,
  context: EventTrackingContext = {}
) => {
  const eventId = createEventId('Purchase', slug, orderId);
  const eventContext = buildEventContext(slug, title, context);
  const metaParams = buildMetaParams(slug, title, context, {
    value: value || 0,
    currency: 'GBP'
  });
  pushToDataLayer({
    event: 'purchase',
    event_id: eventId,
    ...eventContext,
    transaction_value: value,
    currency: 'GBP',
    order_id: orderId
  });
  
  trackFbConversion('Purchase', metaParams, eventId);
  sendServerEvent('Purchase', eventId, metaParams, eventContext, {
    transaction_value: value,
    order_id: orderId
  });
};

export const trackCheckoutInteraction = (
  slug: string,
  titleOrContext?: string | EventTrackingContext,
  maybeContext?: EventTrackingContext
) => {
  const { title, context } = normaliseTitleAndContext(titleOrContext, maybeContext);
  pushToDataLayer({
    event: 'eb_checkout_interaction',
    event_id: createEventId('CheckoutInteraction', slug),
    ...buildEventContext(slug, title, context)
  });
};
