import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Clock, Users, Music, Sparkles } from "lucide-react";

const WhySection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  
  const reasons = [
    {
      icon: Clock,
      title: "Home by 7ish",
      body: "Dance your heart out, still catch Strictly"
    },
    {
      icon: Users,
      title: "The Group Chat Finally Agrees",
      body: "No babysitter battles. No 'I'm too tired' texts. Just a date everyone can actually make."
    },
    {
      icon: Music,
      title: "Every Song a Banger",
      body: "You'll know every single word"
    },
    {
      icon: Sparkles,
      title: "Wake Up Fresh (And Smug)",
      body: "All the joy of a big night out. None of the next-day fear. You've won at the weekend."
    }
  ];

  return (
    <section id="why" className="py-12 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <h2 
          ref={titleRef}
          className={`font-poppins text-3xl md:text-5xl font-bold text-foreground text-center mb-12 uppercase transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Why It Works at <span className="text-primary">2PM</span>
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className={`bg-card/60 backdrop-blur-sm border border-border/50 p-6 rounded-xl text-center hover:border-primary/30 hover:bg-card/80 transition-all duration-700 group ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-poppins text-base md:text-lg font-bold text-foreground mb-2">
                {reason.title}
              </h3>
              <p className="font-poppins text-sm text-muted-foreground leading-relaxed">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
