import { useEffect, useRef } from 'react';
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
  const trackingContext = {
    eventbriteId,
    source: 'eventbrite_modal'
  };

  const normaliseEventbriteValue = (order: any): number | undefined => {
    const rawValue = order?.gross_total?.major_value ?? order?.gross_total?.value;
    if (rawValue === undefined || rawValue === null) return undefined;
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return undefined;
    return numericValue > 1000 ? numericValue / 100 : numericValue;
  };

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
            const value = normaliseEventbriteValue(order);
            const orderId = order?.id;
            
            // Track purchase via centralized dataLayer (includes Meta Pixel)
            if (eventSlug) {
              trackPurchase(eventSlug, eventTitle || '', value, orderId, {
                ...trackingContext,
                source: 'eventbrite_modal_order_complete'
              });
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
            trackAddToCart(eventSlug, eventTitle || '', {
              ...trackingContext,
              source: 'eventbrite_modal_ticket_selected'
            });
          }
        }
        
        if (data.type === 'checkout_started' || data.event === 'checkout_started') {
          if (eventSlug) {
            trackCheckoutInteraction(eventSlug, eventTitle || '', {
              ...trackingContext,
              source: 'eventbrite_modal_checkout_started'
            });
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
