import { useEffect, useRef } from 'react';
import { isConsentGranted } from '@/lib/cookieConsent';
import { trackPurchase, trackAddToCart, trackCheckoutInteraction } from '@/lib/dataLayer';

interface EventbriteModalProps {
  eventbriteId: string;
  triggerId: string;
  eventSlug?: string;
  eventTitle?: string;
  promoCode?: string;
  onOrderComplete?: () => void;
}

declare global {
  interface Window {
    EBWidgets?: {
      createWidget: (config: any) => void;
    };
  }
}

const EventbriteModal = ({ eventbriteId, triggerId, eventSlug, eventTitle, promoCode, onOrderComplete }: EventbriteModalProps) => {
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
          modal: true,
          modalTriggerElementId: triggerId,
          ...(promoCode && { promoCode }),
          onOrderComplete: (order: any) => {
            const value = order?.gross_total?.value || 0;
            const orderId = order?.id;
            
            // Track purchase via centralized dataLayer (includes Meta Pixel)
            if (eventSlug) {
              trackPurchase(eventSlug, eventTitle || '', value, orderId);
            }
            
            if (onOrderComplete) {
              onOrderComplete();
            }
          }
        });
      }
    }
  }, [eventbriteId, triggerId, eventSlug, eventTitle, promoCode, onOrderComplete]);

  // Listen for Eventbrite iframe events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('eventbrite')) return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.type === 'ticket_selected' || data.event === 'ticket_selected') {
          if (!hasTrackedInteraction.current && eventSlug) {
            hasTrackedInteraction.current = true;
            trackAddToCart(eventSlug, eventTitle || '');
          }
        }
        
        if (data.type === 'checkout_started' || data.event === 'checkout_started') {
          if (eventSlug) {
            trackCheckoutInteraction(eventSlug, eventTitle || '');
          }
        }
      } catch (e) {
        // Silent fail for non-JSON messages
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [eventSlug, eventTitle]);

  return null;
};

export default EventbriteModal;
