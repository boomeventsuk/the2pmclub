import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star } from "lucide-react";

const SocialProofSection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  // Mockup: 5 short testimonials in a row
  const testimonials = [
    { quote: "Finally a Saturday plan everyone can say yes to.", author: "Lisa, Northampton" },
    { quote: "Big tunes, great atmosphere and home by 7.", author: "Mark, Exeter" },
    { quote: "Best day out I've had in ages. Proper feel-good.", author: "Sarah, Guildford" },
    { quote: "We danced, we sang, we still made Sunday brunch.", author: "Jo, Leicester" },
    { quote: "The perfect Saturday. Can't wait for the next.", author: "Dan, Coventry" },
  ];

  return (
    <section id="social-proof" className="section-cream py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div
          ref={titleRef}
          className={`text-center mb-10 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-poppins text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            From the people who've been on the dancefloor
          </p>
          <h2 className="font-poppins text-2xl md:text-4xl font-bold text-foreground">
            What our <span className="text-primary">crowd</span> says
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`bg-white border border-[hsl(var(--cream-border))] rounded-2xl p-5 transition-all duration-700 ${
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex mb-3 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="font-poppins text-sm text-foreground leading-relaxed mb-3">
                "{t.quote}"
              </blockquote>
              <cite className="font-poppins text-xs text-muted-foreground not-italic">
                — {t.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
