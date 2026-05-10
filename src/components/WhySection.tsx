import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sun, Music, Home, CalendarDays } from "lucide-react";

const WhySection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const reasons = [
    {
      icon: Sun,
      title: "Daytime energy",
      body: "All the vibes of a night out, with daylight on your side.",
    },
    {
      icon: Music,
      title: "Big familiar tunes",
      body: "80s, 90s, 00s anthems you know every word to.",
    },
    {
      icon: Home,
      title: "Home for tea",
      body: "Dance. Sing. Laugh. Then be home for 7.",
    },
    {
      icon: CalendarDays,
      title: "Weekend sorted",
      body: "The perfect start to your Saturday night.",
    },
  ];

  return (
    <section id="why" className="section-cream py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div
          ref={titleRef}
          className={`mb-12 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-poppins text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            Ticket prices that don't punish you for being responsible
          </p>
          <h2 className="font-poppins text-3xl md:text-5xl font-bold text-foreground">
            Why it works <br className="md:hidden" />at <span className="text-primary">2PM</span>
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`bg-white border border-[hsl(var(--cream-border))] rounded-2xl p-7 md:p-8 text-center transition-all duration-700 hover:shadow-md hover:-translate-y-0.5 ${
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <reason.icon className="w-7 h-7 text-primary" strokeWidth={2.2} />
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
