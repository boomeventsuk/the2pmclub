const CONSENT_KEY = 'cookie_consent';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export type ConsentStatus = 'granted' | 'denied' | null;

export const getConsentStatus = (): ConsentStatus => {
  if (typeof window === 'undefined') return null;
  const status = localStorage.getItem(CONSENT_KEY);
  if (status === 'granted' || status === 'denied') return status;
  return null;
};

export const setConsentStatus = (status: 'granted' | 'denied'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, status);
};

export const hasConsentBeenGiven = (): boolean => {
  return getConsentStatus() !== null;
};

export const isConsentGranted = (): boolean => {
  return getConsentStatus() === 'granted';
};

// Grant consent and fire PageView
export const grantConsent = (): void => {
  setConsentStatus('granted');
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('consent', 'grant');
    window.fbq('track', 'PageView');
    console.log('[Consent] Granted - PageView fired');
  }
};

// Deny consent - pixel remains in revoke mode
export const denyConsent = (): void => {
  setConsentStatus('denied');
  console.log('[Consent] Denied - tracking disabled');
};

// Check consent and fire PageView on page load if already granted
export const initConsentOnLoad = (): void => {
  if (typeof window === 'undefined') return;
  
  const status = getConsentStatus();
  if (status === 'granted' && window.fbq) {
    window.fbq('consent', 'grant');
    window.fbq('track', 'PageView');
    console.log('[Consent] Restored - PageView fired');
  }
};
