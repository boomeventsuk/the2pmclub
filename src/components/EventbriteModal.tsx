import { useEffect } from 'react';

interface EventbriteModalProps {
  eventbriteId: string;
  triggerId: string;
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

const EventbriteModal = ({ eventbriteId, triggerId, promoCode, onOrderComplete }: EventbriteModalProps) => {
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
          onOrderComplete: () => {
            // Track order completion
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: 'eb_purchase_completed',
              eventbriteId: eventbriteId
            });
            
            if (onOrderComplete) {
              onOrderComplete();
            }
          }
        });
      }
    }
  }, [eventbriteId, triggerId, onOrderComplete]);

  // Listen for Eventbrite iframe events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from Eventbrite domains
      if (!event.origin.includes('eventbrite')) return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Push relevant events to dataLayer
        if (data.type === 'ticket_selected' || data.event === 'ticket_selected') {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'eb_ticket_selected',
            eventbriteId: eventbriteId,
            ticketData: data
          });
        }
        
        if (data.type === 'checkout_started' || data.event === 'checkout_started') {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'eb_checkout_started',
            eventbriteId: eventbriteId
          });
        }
      } catch (e) {
        // Silent fail for non-JSON messages
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [eventbriteId, triggerId, onOrderComplete]);

  return null; // This component doesn't render anything visible
};

export default EventbriteModal;
