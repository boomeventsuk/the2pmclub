import { Button } from "@/components/ui/button";

const NewHero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/lovable-uploads/28aa6d32-e3e7-4056-a5ca-26471fab5532.png"
        alt="THE 2PM CLUB crowd at a daytime disco party"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-4 py-20">
        <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight uppercase">
          Your Best Night Out Is Now In The Afternoon
        </h1>
        
        <p className="font-poppins text-base md:text-lg text-white mb-8 leading-relaxed max-w-4xl mx-auto">
          Introducing THE 2PM CLUB Daytime Disco - big night out energy with smarter afternoon timing. Get all your friends together and dance and sing to the biggest 80s, 90s & 00s anthems at selling out venues across the Midlands. The beauty of it? Wake up fresh on Sunday. No regrets.
        </p>
        
        <Button 
          onClick={() => scrollToSection('tickets')}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all uppercase tracking-wide mb-6"
        >
          Book Your Next Daytime Disco
        </Button>
        
        <p className="font-poppins text-sm md:text-base text-primary font-semibold uppercase tracking-wide">
          The Midlands' Most Popular Day Party
        </p>
      </div>
    </section>
  );
};

export default NewHero;