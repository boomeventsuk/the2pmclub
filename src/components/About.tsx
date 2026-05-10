import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="section-cream py-12 md:py-16" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <div className="bg-white border border-[hsl(var(--cream-border))] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          {/* Roundel */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[hsl(270_45%_14%)] flex items-center justify-center shrink-0">
            <div className="text-center leading-none">
              <div className="font-poppins font-extrabold text-primary text-lg md:text-xl">2PM</div>
              <div className="font-poppins font-bold text-foreground text-[10px] md:text-xs tracking-widest mt-0.5">CLUB</div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 id="about-title" className="font-poppins text-xl md:text-2xl font-bold text-foreground mb-1">
              About the <span className="text-primary">2PM CLUB</span>
            </h2>
            <p className="font-poppins text-sm text-muted-foreground leading-relaxed max-w-xl">
              We created THE 2PM CLUB because the best nights don't have to end at 3am. Proper tunes, real people, earlier times. It just makes sense.
            </p>
          </div>

          <a href="/what-to-expect/" className="shrink-0">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wide rounded-full px-6 py-5 text-xs">
              More about us <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
