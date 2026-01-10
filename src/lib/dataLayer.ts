import { isConsentGranted } from './cookieConsent';

declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (...args: any[]) => void;
  }
}

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

// Helper to track Meta Pixel events - only fires if consent granted (for browsing events)
const trackFbEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq && isConsentGranted()) {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] ${eventName}`, params);
    debugLog('Meta Pixel fired:', eventName, params);
  } else {
    debugLog('Meta Pixel blocked (no consent):', eventName, params);
  }
};

// Conversion tracking - fires regardless of consent (legitimate interest for transactions)
const trackFbConversion = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel Conversion] ${eventName}`, params);
    debugLog('Meta Pixel conversion fired:', eventName, params);
  }
};

export const pushToDataLayer = (event: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  debugLog('DataLayer push:', event);
};

// ViewContent - respects consent (browsing behaviour)
export const trackEventPageView = (slug: string, title: string) => {
  pushToDataLayer({
    event: 'eventpage_view',
    event_slug: slug,
    event_type: '2PM',
    event_title: title
  });
  
  trackFbEvent('ViewContent', {
    content_name: title,
    content_type: 'event',
    content_ids: [slug]
  });
};

// InitiateCheckout - fires regardless of consent (conversion event)
export const trackBookClick = (slug: string, title: string) => {
  pushToDataLayer({
    event: 'eventpage_book_click',
    event_slug: slug,
    event_type: '2PM',
    event_title: title
  });
  
  trackFbConversion('InitiateCheckout', {
    content_ids: [slug],
    content_name: title
  });
};

// AddToCart - fires regardless of consent (conversion event)
export const trackAddToCart = (slug: string, title: string) => {
  pushToDataLayer({
    event: 'add_to_cart',
    event_slug: slug,
    event_type: '2PM',
    event_title: title
  });
  
  trackFbConversion('AddToCart', {
    content_name: title,
    content_ids: [slug]
  });
};

// Purchase - fires regardless of consent (conversion event)
export const trackPurchase = (slug: string, title: string, value?: number, orderId?: string) => {
  pushToDataLayer({
    event: 'purchase',
    event_slug: slug,
    event_type: '2PM',
    event_title: title,
    transaction_value: value,
    currency: 'GBP',
    order_id: orderId
  });
  
  trackFbConversion('Purchase', {
    content_name: title,
    content_ids: [slug],
    value: value || 0,
    currency: 'GBP'
  });
};

export const trackCheckoutInteraction = (slug: string, title: string) => {
  pushToDataLayer({
    event: 'eb_checkout_interaction',
    event_slug: slug,
    event_type: '2PM',
    event_title: title
  });
};
