import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { hasConsentBeenGiven, grantConsent, denyConsent } from '@/lib/cookieConsent';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      if (!hasConsentBeenGiven()) {
        setShowBanner(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  const handleAcceptAll = () => {
    grantConsent();
    setShowBanner(false);
    document.body.style.overflow = '';
  };

  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      grantConsent();
    } else {
      denyConsent();
    }
    setShowBanner(false);
    document.body.style.overflow = '';
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {!showPreferences ? (
          // Main consent view
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground font-poppins mb-3">
              Your Privacy Matters
            </h2>
            <p className="text-sm md:text-base text-foreground/80 font-poppins mb-6 leading-relaxed">
              We use cookies to personalise your experience and show you relevant content. 
              You can manage your preferences anytime.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
                className="text-sm text-muted-foreground border-muted-foreground/30 hover:bg-muted/50"
              >
                Manage Preferences
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 text-sm bg-primary hover:bg-primary/90 font-semibold"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Preferences view
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground font-poppins mb-4">
              Cookie Preferences
            </h2>
            
            <div className="space-y-4 mb-6">
              {/* Essential cookies - always on */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Essential Cookies</p>
                  <p className="text-xs text-muted-foreground">Required for the site to work</p>
                </div>
                <Switch checked={true} disabled className="opacity-50" />
              </div>
              
              {/* Analytics & Marketing */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Analytics & Marketing</p>
                  <p className="text-xs text-muted-foreground">Help us improve your experience</p>
                </div>
                <Switch 
                  checked={analyticsEnabled} 
                  onCheckedChange={setAnalyticsEnabled}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
                className="text-sm"
              >
                Back
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 text-sm bg-primary hover:bg-primary/90 font-semibold"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
