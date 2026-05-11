import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const FinalCta = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      window.scrollTo({ top: element.offsetTop - headerHeight, behavior: "smooth" });
    }
  };

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
    "Sorting our next afternoon out — THE 2PM CLUB. Iconic anthems, home by 7. Have a look at the dates: https://www.the2pmclub.co.uk/#tickets"
  )}`;

  return (
    <section className="final-cta py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Disco ball flourish on the right */}
      <div
        aria-hidden="true"
        className="absolute right-[-80px] md:right-10 top-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full opacity-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, hsl(0 0% 100% / 0.6) 0%, hsl(328 100% 70%) 25%, hsl(280 60% 40%) 60%, transparent 80%)",
          filter: "blur(2px)",
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <h2 className="font-poppins text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
            Sort the <span className="text-primary">group chat</span>
            <br />
            before it goes quiet again.
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              onClick={() => scrollToSection("tickets")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wide px-8 py-6 rounded-full text-sm"
            >
              Book Tickets <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 font-poppins font-semibold uppercase tracking-wide px-8 py-6 rounded-full text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send to the chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
