import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/dataLayer";

/**
 * Fires a generic page_view to dataLayer and a Meta Pixel PageView
 * on every SPA route change. The first paint is covered by the
 * initial script-tag fire; this listener covers client-side navigation.
 */
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Defer one tick so document.title has settled to the new page's value.
    const id = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 0);
    return () => clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeTracker;
