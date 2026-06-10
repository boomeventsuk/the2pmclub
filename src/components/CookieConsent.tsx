import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { hasConsentBeenGiven, grantConsent, denyConsent } from '@/lib/cookieConsent';

/**
 * Non-blocking cookie banner.
 * Fixed to the bottom of the viewport: the page stays fully visible and
 * scrollable behind it, no overflow lock, no backdrop. Accept and Reject are
 * equal-weight one-tap actions; granular toggles live behind the smaller
 * "Manage preferences" link. Consent gating is unchanged: tracking stays
 * revoked until grantConsent() runs, and the decision persists in
 * localStorage via the cookieConsent lib.
 */
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

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

  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      grantConsent();
    } else {
      denyConsent();
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[60] p-3 md:p-4 pointer-events-none animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="pointer-events-auto mx-auto w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl p-4 md:p-5">
        {!showPreferences ? (
          // Main banner view
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
            <p className="font-poppins text-sm text-foreground/80 leading-relaxed flex-1">
              We use cookies for analytics and marketing. Essential cookies are always on.{' '}
              <a href="/privacy/" className="underline underline-offset-2 hover:text-primary transition-colors">
                Privacy policy
              </a>
            </p>
            <div className="flex flex-col gap-2 shrink-0 md:items-end">
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="secondary"
                  onClick={handleReject}
                  className="flex-1 md:flex-none md:min-w-28 text-sm font-semibold"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 md:flex-none md:min-w-28 text-sm bg-primary hover:bg-primary/90 font-semibold"
                >
                  Accept
                </Button>
              </div>
              <button
                onClick={() => setShowPreferences(true)}
                className="font-poppins text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors self-center md:self-end"
              >
                Manage preferences
              </button>
            </div>
          </div>
        ) : (
          // Preferences view
          <div>
            <h2 className="font-poppins text-base font-bold text-foreground mb-3">
              Cookie Preferences
            </h2>
            <div className="space-y-2 mb-4">
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
            <div className="flex gap-2">
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
