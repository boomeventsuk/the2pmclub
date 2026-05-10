import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, ChevronDown, Star } from "lucide-react";

const NewHero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-20 md:pt-24 pb-0 overflow-hidden bg-[hsl(270_45%_10%)]"
    >
      {/* Full-bleed background photo — bleeds across the whole hero, biased to the right */}
      <div className="absolute inset-0">
        <img
          src="https://boombastic-events.b-cdn.net/Boombastic%20Events/event%20photos/2PM/280226-2PM-NPTON-confetti-cannon-rainbow-lighting-crowd.jpeg"
          alt="THE 2PM CLUB crowd dancing at a daytime disco"
          className="w-full h-full object-cover object-[70%_30%]"
          loading="eager"
        />
        {/* Left-to-right fade so text sits on dark, image bleeds into copy */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(270 50% 8% / 0.97) 0%, hsl(270 50% 8% / 0.92) 22%, hsl(270 50% 8% / 0.55) 45%, hsl(270 50% 8% / 0.15) 65%, transparent 90%)",
          }}
        />
        {/* Top + bottom feather to soften photo into the page */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(270 50% 8% / 0.55) 0%, transparent 18%, transparent 70%, hsl(270 50% 8% / 0.85) 100%)",
          }}
        />
        {/* Pink glow bleed under the headline */}
        <div
          aria-hidden="true"
          className="absolute -left-40 top-1/3 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, hsl(328 100% 54% / 0.35) 0%, transparent 65%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* Content sits on top of the photo */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10 md:pt-16 pb-10 md:pb-16 min-h-[80vh]">
          <div className="lg:col-span-7 text-left">
            <h1 className="font-poppins font-extrabold leading-[0.95] tracking-tight text-foreground text-5xl md:text-7xl lg:text-[5.5rem] drop-shadow-[0_6px_30px_rgba(0,0,0,0.7)] whitespace-nowrap">
              <span className="block">Night-out Energy,</span>
              <span className="block text-primary drop-shadow-[0_4px_24px_hsl(328_100%_54%_/_0.45)]">
                Afternoon Timing.
              </span>
            </h1>
            <p className="font-poppins text-lg md:text-xl lg:text-2xl text-foreground/95 mt-6 leading-relaxed max-w-xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]">
              Iconic anthems. Home by 7. <span className="text-foreground font-semibold">It's the plan everyone can actually make.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                onClick={() => scrollToSection("tickets")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wide px-8 py-6 rounded-full text-sm shadow-[0_10px_30px_hsl(328_100%_54%_/_0.5)]"
              >
                Book Tickets <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => scrollToSection("tickets")}
                size="lg"
                variant="outline"
                className="border border-foreground/50 bg-foreground/5 backdrop-blur-sm text-foreground hover:bg-foreground/15 font-semibold uppercase tracking-wide px-8 py-6 rounded-full text-sm"
              >
                Find Your City <MapPin className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-foreground/85 font-poppins text-xs uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="font-semibold">Loved by 5,000+ dancers</span>
              </div>
              <span className="hidden sm:inline opacity-40">|</span>
              <span className="font-semibold">As seen across the Midlands</span>
              <span className="hidden sm:inline opacity-40">|</span>
              <span className="font-semibold">By Boombastic Events</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("tickets")}
          aria-label="See upcoming dates"
          className="absolute left-1/2 -translate-x-1/2 bottom-6 hidden md:flex flex-col items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
        >
          <span className="font-poppins text-[10px] uppercase tracking-[0.25em]">See upcoming dates</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default NewHero;
