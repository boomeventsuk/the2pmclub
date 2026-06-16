import { Button } from "@/components/ui/button";
import NextEventStrip from "@/components/NextEventStrip";
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
  return <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0">
      {/* Instant blurred placeholder: the hero is never a black void while the photo arrives */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[center_30%]"
        style={{ backgroundImage: "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAVACADASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABAAFAwb/xAAfEAABAwUBAQEAAAAAAAAAAAACAAEDBBESITETBSL/xAAXAQADAQAAAAAAAAAAAAAAAAABAgME/8QAHBEBAQACAgMAAAAAAAAAAAAAAQACERIhAzFB/9oADAMBAAIRAxEAPwDJpKQibW1SQEJ2wu6b8yQQf9umZwlI56dJ483kiVddWSFK5jodo1TTuL2tteji88nJrc4satmb2LFbeInUpiPuHFMWSdDcibbspSzkPl3kJ4pRxfqKYiZlduqUq7YX/9k=')" }}
      />
      {/* Background Image: self-hosted WebP, 86% lighter than the old CDN JPEG */}
      <img src="/img/hero-confetti-1280.webp" srcSet="/img/hero-confetti-768.webp 768w, /img/hero-confetti-1280.webp 1280w, /img/hero-confetti-1920.webp 1920w" sizes="100vw" fetchPriority="high" decoding="async" alt="THE 2PM CLUB crowd with confetti cannons and rainbow lighting at a daytime disco party" className="absolute inset-0 w-full h-full object-cover object-[center_30%]" />
      
      {/* Gradient overlay - much lighter to show crowd energy */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/15 to-transparent" />
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(328_100%_54%_/_0.2)_0%,_transparent_70%)]" />
      
      {/* Content - tighter padding, bigger text */}
      <div className="relative z-10 text-center w-full px-3 sm:px-6 py-8 md:py-12">
        <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-foreground mb-1 tracking-wide drop-shadow-[0_6px_40px_rgba(0,0,0,1)]">
          THE 2PM CLUB DAYTIME DISCO
        </h1>
        <p className="font-bebas text-3xl md:text-5xl lg:text-6xl text-primary mb-6 tracking-wide drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          YOUR BEST NIGHT OUT. IN THE MIDDLE OF THE AFTERNOON.
        </p>
        
        <p className="font-poppins text-lg sm:text-xl md:text-2xl text-foreground mb-6 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
          4 hours of iconic 80s 90s 00s anthems. Home by 7ish. No Sunday regrets.
        </p>
        
        <div className="relative inline-block">
          {/* Glow behind button */}
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
          <Button onClick={() => scrollToSection('tickets')} size="lg" className="relative bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 shadow-[0_0_30px_hsl(328_100%_54%_/_0.4)] hover:shadow-[0_0_40px_hsl(328_100%_54%_/_0.5)] transition-all uppercase tracking-wide">
            BOOK YOUR TICKETS
          </Button>
        </div>

        {/* Next event above the fold */}
        <div className="mt-2">
          <NextEventStrip />
        </div>
      </div>
    </section>;
};
export default NewHero;