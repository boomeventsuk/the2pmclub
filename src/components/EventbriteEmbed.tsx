import { useEffect } from 'react';

interface EventbriteEmbedProps {
  eventbriteId: string;
  containerId: string;
  height?: number;
  onOrderComplete?: () => void;
}

declare global {
  interface Window {
    EBWidgets?: {
      createWidget: (config: any) => void;
    };
  }
}

const EventbriteEmbed = ({ eventbriteId, containerId, height = 425, onOrderComplete }: EventbriteEmbedProps) => {
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
          onOrderComplete: () => {
            // Track order completion
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: 'order_complete',
              eventbriteId: eventbriteId
            });
            
            if (onOrderComplete) {
              onOrderComplete();
            }
          }
        });
      }
    }
  }, [eventbriteId, containerId, height, onOrderComplete]);

  return (
    <div id={containerId} style={{ minHeight: `${height}px` }} />
  );
};

export default EventbriteEmbed;
