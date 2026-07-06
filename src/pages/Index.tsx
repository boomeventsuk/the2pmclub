import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import TrustStrip from "@/components/TrustStrip";
import MobileBookBar from "@/components/MobileBookBar";
import Tickets from "@/components/Tickets";
import PhotoGallery from "@/components/PhotoGallery";
import WhySection from "@/components/WhySection";
import SocialProofSection from "@/components/SocialProofSection";
import MusicSection from "@/components/MusicSection";
import HomeFaq from "@/components/HomeFaq";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Homepage-only LCP hero preload. Lives here (not in index.html) so
          event/hub pages, which share the index.html template, don't preload
          an image they never render and starve the JS bundle of bandwidth. */}
      <Helmet>
        <link
          rel="preload"
          as="image"
          href="/img/hero-confetti-1280.webp"
          imagesrcset="/img/hero-confetti-768.webp 768w, /img/hero-confetti-1280.webp 1280w, /img/hero-confetti-1920.webp 1920w"
          imagesizes="100vw"
          fetchpriority="high"
        />
      </Helmet>
      <Header />
      <NewHero />
      <TrustStrip />
      <Tickets />
      <PhotoGallery />
      <WhySection />
      <SocialProofSection />
      <MusicSection />
      <HomeFaq />
      <Footer />
      <MobileBookBar />
    </main>
  );
};

export default Index;
