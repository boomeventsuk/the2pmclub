import { useEffect, useRef } from 'react';
import { isConsentGranted } from '@/lib/cookieConsent';
import { trackPurchase, trackAddToCart, trackCheckoutInteraction } from '@/lib/dataLayer';

interface EventbriteEmbedProps {
  eventbriteId: string;
  eventSlug: string;
  containerId: string;
  height?: number;
  promoCode?: string;
  eventTitle?: string;
  onOrderComplete?: () => void;
}

declare global {
  interface Window {
    EBWidgets?: {
      createWidget: (config: any) => void;
    };
  }
}

const EventbriteEmbed = ({ eventbriteId, eventSlug, containerId, height = 425, promoCode, eventTitle, onOrderComplete }: EventbriteEmbedProps) => {
  const hasTrackedInteraction = useRef(false);

  useEffect(() => {
    // Load Eventbrite widget script if not already loaded
    if (!window.EBWidgets) {
      const script = document.createElement('script');
      script.src = 'https://www.eventbrite.co.uk/static/widgets/eb_widgets.js';
      script.async = true;
      script.onload = () => {
        initializeWidget();
      };
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (window.EBWidgets) {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: eventbriteId,
          iframeContainerId: containerId,
          iframeContainerHeight: height,
          ...(promoCode && { promoCode }),
          onOrderComplete: (order: any) => {
            const value = order?.gross_total?.value || 0;
            const orderId = order?.id;
            
            // Track purchase via centralized dataLayer (includes Meta Pixel)
            trackPurchase(eventSlug, eventTitle || '', value, orderId);
            
            if (onOrderComplete) {
              onOrderComplete();
            }
          }
        });
      }
    }
  }, [eventbriteId, containerId, height, onOrderComplete]);

  // Listen for Eventbrite iframe events (for additional tracking signals)
  useEffect(() => {
    const isDebugMode = () => {
      if (typeof window === 'undefined') return false;
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('eb_debug') === '1' || localStorage.getItem('eb_debug') === '1';
    };

    const handleMessage = (event: MessageEvent) => {
      // Debug: log all postMessage events from Eventbrite
      if (isDebugMode() && event.origin.includes('eventbrite')) {
        console.log('[EB Debug] PostMessage received:', {
          origin: event.origin,
          data: event.data,
          type: typeof event.data
        });
      }

      if (!event.origin.includes('eventbrite')) return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (isDebugMode()) {
          console.log('[EB Debug] Parsed data:', data);
        }
        
        if (data.type === 'ticket_selected' || data.event === 'ticket_selected') {
          if (isDebugMode()) {
            console.log('[EB Debug] Ticket selected event detected');
          }
          // Fire AddToCart on ticket selection if not already tracked
          if (!hasTrackedInteraction.current) {
            hasTrackedInteraction.current = true;
            trackAddToCart(eventSlug, eventTitle || '');
            if (isDebugMode()) {
              console.log('[EB Debug] AddToCart tracked via postMessage');
            }
          }
        }
        
        if (data.type === 'checkout_started' || data.event === 'checkout_started') {
          trackCheckoutInteraction(eventSlug, eventTitle || '');
          if (isDebugMode()) {
            console.log('[EB Debug] Checkout interaction tracked via postMessage');
          }
        }
      } catch (e) {
        // Silent fail for non-JSON messages
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [eventSlug, eventTitle]);

  // Iframe focus tracking for checkout interactions and AddToCart
  useEffect(() => {
    const isDebugMode = () => {
      if (typeof window === 'undefined') return false;
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('eb_debug') === '1' || localStorage.getItem('eb_debug') === '1';
    };

    const handleFocusIn = (e: FocusEvent) => {
      const container = document.getElementById(containerId);
      const iframe = container?.querySelector('iframe');
      
      if (iframe && document.activeElement === iframe) {
        if (isDebugMode()) {
          console.log('[EB Debug] Iframe focus detected');
        }
        
        // Track checkout interaction
        trackCheckoutInteraction(eventSlug, eventTitle || '');
        
        // Fire AddToCart only once per session
        if (!hasTrackedInteraction.current) {
          hasTrackedInteraction.current = true;
          trackAddToCart(eventSlug, eventTitle || '');
          if (isDebugMode()) {
            console.log('[EB Debug] AddToCart tracked via iframe focus');
          }
        }
      }
    };
    
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [containerId, eventSlug, eventTitle]);

  return (
    <div id={containerId} style={{ minHeight: `${height}px` }} />
  );
};

export default EventbriteEmbed;
