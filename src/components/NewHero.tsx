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
        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight uppercase"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontSize: '2.6rem',
              lineHeight: '1.08'
            }}>
          THE 2PM CLUB™ — The Midlands' Most Popular Daytime Party
        </h1>
        
        <h2 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight uppercase"
            style={{
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              fontSize: '2.0rem',
              lineHeight: '1.08'
            }}>
          Party on Your Terms
        </h2>
        
        <h3 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight uppercase"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}>
          — Home by 7 (ish)
        </h3>
        
        <p className="font-poppins text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto px-4 md:px-0"
           style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          The biggest 80s, 90s &amp; 00s anthems. Full club atmosphere, perfect timing.
          From Coventry to Northampton, Milton Keynes to Birmingham, every event is packed.
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