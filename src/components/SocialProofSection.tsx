import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star } from "lucide-react";

const SocialProofSection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  
  const testimonials = [
    {
      quote: "Brilliant music, not just clubbing anthems the whole time (just the right mix) loved the big singalong moments",
      author: "JOSIE L, NORTHAMPTON"
    },
    {
      quote: "Finally able to get all my friends together, when's the next one?",
      author: "MARIE T, COVENTRY"
    },
    {
      quote: "Don't think I've danced and laughed so much in a long time. Thank you!",
      author: "TRACEY M, BEDFORD"
    }
  ];

  return (
    <section id="social-proof" className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <h2 
          ref={titleRef}
          className={`font-poppins text-3xl md:text-5xl font-bold text-foreground text-center mb-12 uppercase transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          What The Group Chat Said <span className="text-primary">Monday Morning</span>
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-card/60 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-primary/30 transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Star rating - gold */}
              <div className="flex mb-4 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Pink left border accent */}
              <div className="border-l-2 border-primary/50 pl-4">
                <blockquote className="font-poppins text-foreground/90 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <cite className="font-poppins text-sm text-primary font-semibold not-italic">
                  — {testimonial.author}
                </cite>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
