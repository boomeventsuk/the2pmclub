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
    <section id="hero" className="relative h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg"
        alt="THE 2PM CLUB crowd at a daytime disco party"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-6 py-16 md:py-20">
        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight uppercase tracking-wide">
          THE 2PM CLUB — YOUR BEST NIGHT OUT IS NOW IN THE AFTERNOON
        </h1>
        
        <p className="font-poppins text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto px-4 md:px-0">
          Iconic 80s 90s 00s Anthems. Perfectly timed so all your crew can make it. Let your hair down, be home by 7ish and no Sunday regrets! Daytime Disco Parties across the Midlands
        </p>
        
        <Button 
          onClick={() => scrollToSection('tickets')}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all uppercase tracking-wide"
        >
          Book Your Next Daytime Disco
        </Button>
      </div>
    </section>
  );
};

export default NewHero;