import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
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
      <Tickets />
      <PhotoGallery />
      <WhySection />
      <SocialProofSection />
      <MusicSection />
      <HomeFaq />
      <Footer />
    </main>
  );
};

export default Index;
