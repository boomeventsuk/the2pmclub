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
    <section id="hero" className="relative h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background Image */}
      <img 
        src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" 
        alt="THE 2PM CLUB crowd at a daytime disco party" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(328_100%_54%_/_0.15)_0%,_transparent_70%)]" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-6 py-16 md:py-20">
        <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight uppercase tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          THE 2PM CLUB — YOUR BEST NIGHT OUT IS NOW IN THE AFTERNOON
        </h1>
        
        <p className="font-poppins text-base md:text-lg text-foreground/80 mb-10 leading-relaxed max-w-2xl mx-auto">
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
            FIND YOUR SATURDAY
          </Button>
        </div>
      </div>
    </section>
  );
};
export default NewHero;