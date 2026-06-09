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
