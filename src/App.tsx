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
import BirminghamHub from "./pages/hubs/Birmingham";
import SiteFaqs from "./pages/SiteFaqs";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/hubs/birmingham/" element={<BirminghamHub />} />
            <Route path="/faqs/" element={<SiteFaqs />} />
            <Route path="/blog/why-daytime-discos-are-popular/" element={<BlogPost />} />
            {/* Dev-only QA route */}
            {import.meta.env.DEV && <Route path="/__events" element={<DevEventsIndex />} />}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
