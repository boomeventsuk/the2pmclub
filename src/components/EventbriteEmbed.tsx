import { useEffect } from 'react';

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
            // Track order completion with standardized purchase event
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: 'purchase',
              event_slug: eventSlug,
              event_type: '2PM',
              event_title: eventTitle,
              transaction_value: order?.gross_total?.value || 0,
              currency: order?.gross_total?.currency || 'GBP',
              order_id: order?.id
            });
            
            if (onOrderComplete) {
              onOrderComplete();
            }
          }
        });
      }
    }
  }, [eventbriteId, containerId, height, onOrderComplete]);

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
            event_slug: eventSlug,
            event_type: '2PM',
            event_title: eventTitle,
            ticketData: data
          });
        }
        
        if (data.type === 'checkout_started' || data.event === 'checkout_started') {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'eb_checkout_started',
            event_slug: eventSlug,
            event_type: '2PM',
            event_title: eventTitle
          });
        }
      } catch (e) {
        // Silent fail for non-JSON messages
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [eventbriteId, eventSlug, eventTitle]);

  // Iframe focus tracking for checkout interactions
  useEffect(() => {
    const container = document.getElementById(containerId);
    const iframe = container?.querySelector('iframe');
    
    const handleFocus = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'eb_checkout_interaction',
        event_slug: eventSlug,
        event_type: '2PM',
        event_title: eventTitle
      });
    };
    
    if (iframe) {
      iframe.addEventListener('focus', handleFocus);
      return () => iframe.removeEventListener('focus', handleFocus);
    }
  }, [eventbriteId, eventSlug, eventTitle, containerId]);

  return (
    <div id={containerId} style={{ minHeight: `${height}px` }} />
  );
};

export default EventbriteEmbed;
