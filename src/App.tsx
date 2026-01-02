import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import EventPage from "./pages/EventPage";
import NotFound from "./pages/NotFound";
import DevEventsIndex from "./pages/DevEventsIndex";
import SiteFaqs from "./pages/SiteFaqs";
import BlogIndex from "./pages/blog/BlogIndex";
import WhyDaytimeDiscosArePopular from "./pages/blog/WhyDaytimeDiscosArePopular";
import WhyTwoPmWorks from "./pages/blog/WhyTwoPmWorks";
import CookieConsent from "./components/CookieConsent";
import { initConsentOnLoad } from "./lib/cookieConsent";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initConsentOnLoad();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
        <div className="min-h-screen bg-background font-poppins">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events/:slug/*" element={<EventPage />} />
              <Route path="/faqs/" element={<SiteFaqs />} />
              <Route path="/blog/" element={<BlogIndex />} />
              <Route path="/blog/why-daytime-discos-are-popular/" element={<WhyDaytimeDiscosArePopular />} />
              <Route path="/blog/why-2pm-works/" element={<WhyTwoPmWorks />} />
              {/* Dev-only QA route */}
              {import.meta.env.DEV && <Route path="/__events" element={<DevEventsIndex />} />}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <CookieConsent />
        </div>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
