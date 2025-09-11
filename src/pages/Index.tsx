import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import WhySection from "@/components/WhySection";
import Tickets from "@/components/Tickets";
import SocialProofSection from "@/components/SocialProofSection";
import MusicSection from "@/components/MusicSection";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { EventLinks } from "@/components/EventLinks";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <NewHero />
      <WhySection />
      <Tickets />
      <SocialProofSection />
      <MusicSection />
      <About />
      {/* Development helper - remove in production */}
      <div className="bg-gray-50 p-8">
        <div className="container mx-auto">
          <EventLinks />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Index;