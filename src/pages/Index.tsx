import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import WhySection from "@/components/WhySection";
import Tickets from "@/components/Tickets";
import SocialProofSection from "@/components/SocialProofSection";
import MusicSection from "@/components/MusicSection";
import About from "@/components/About";
import HomeFaq from "@/components/HomeFaq";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main id="main-content" className="min-h-screen">
      <Header />
      <NewHero />
      <WhySection />
      <Tickets />
      <SocialProofSection />
      <MusicSection />
      <About />
      <HomeFaq />
      <Footer />
    </main>
  );
};

export default Index;
