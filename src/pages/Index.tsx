import Header from "@/components/Header";
import NextEventStrip from "@/components/NextEventStrip";
import NewHero from "@/components/NewHero";
import WhySection from "@/components/WhySection";
import Tickets from "@/components/Tickets";
import NewsletterBanner from "@/components/NewsletterBanner";
import PhotoGallery from "@/components/PhotoGallery";
import SocialProofSection from "@/components/SocialProofSection";
import MusicSection from "@/components/MusicSection";
import About from "@/components/About";
import HomeFaq from "@/components/HomeFaq";
import FinalCta from "@/components/FinalCta";
import InstagramGrid from "@/components/InstagramGrid";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";

const Index = () => {
  return (
    <main id="main-content" className="min-h-screen">
      <Header />
      <NextEventStrip />
      <NewHero />
      <WhySection />
      <Tickets />
      <NewsletterBanner />
      <PhotoGallery />
      <SocialProofSection />
      <MusicSection />
      <About />
      <HomeFaq />
      <FinalCta />
      <InstagramGrid />
      <Footer />
      <MobileBookBar />
    </main>
  );
};

export default Index;
