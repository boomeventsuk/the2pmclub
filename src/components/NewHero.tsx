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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0">
      {/* Background Image */}
      <img 
        src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" 
        alt="THE 2PM CLUB crowd at a daytime disco party" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      
      {/* Gradient overlay - much lighter to show crowd energy */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(328_100%_54%_/_0.2)_0%,_transparent_70%)]" />
      
      {/* Content - tighter padding, bigger text */}
      <div className="relative z-10 text-center w-full px-3 sm:px-6 py-8 md:py-12">
        <h1 className="font-bebas text-[3.5rem] sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground mb-1 leading-[0.95] uppercase tracking-wide drop-shadow-[0_6px_40px_rgba(0,0,0,1)]">
          THE 2PM CLUB DAYTIME DISCO.
        </h1>
        <p className="font-bebas text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-4 uppercase tracking-wide leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          YOUR BEST NIGHT OUT IS NOW IN THE AFTERNOON.
        </p>
        
        <p className="font-poppins text-lg sm:text-xl md:text-2xl text-foreground mb-6 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
          4 hours of iconic 80s 90s 00s anthems. Home by 7ish. No Sunday regrets.
        </p>
        
        <div className="relative inline-block">
          {/* Glow behind button */}
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
          <Button 
            onClick={() => scrollToSection('tickets')} 
            size="lg" 
            className="relative bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 shadow-[0_0_30px_hsl(328_100%_54%_/_0.4)] hover:shadow-[0_0_40px_hsl(328_100%_54%_/_0.5)] transition-all uppercase tracking-wide"
          >
            BOOK YOUR TICKETS
          </Button>
        </div>
      </div>
    </section>
  );
};
export default NewHero;