import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { hasConsentBeenGiven, grantConsent, denyConsent } from '@/lib/cookieConsent';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      if (!hasConsentBeenGiven()) {
        setShowBanner(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    grantConsent();
    setShowBanner(false);
  };

  const handleReject = () => {
    denyConsent();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-4 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm md:text-base text-foreground/90 font-poppins">
              We use cookies to enhance your experience and analyse site traffic.{' '}
              <a 
                href="/privacy" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleReject}
              className="text-sm"
            >
              Reject Non-Essential
            </Button>
            <Button
              onClick={handleAccept}
              className="text-sm bg-primary hover:bg-primary/90"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
