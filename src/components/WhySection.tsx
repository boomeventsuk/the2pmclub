import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const WhySection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const reasons = [
    {
      title: "🎉 EVERYONE CAN ACTUALLY MAKE IT",
      body: "How impossible has it become to get everyone together? THE 2PM CLUB solves the eternal adult friendship coordination puzzle - 2pm start means no childcare dramas, no work worries, no 'I'm too tired' excuses."
    },
    {
      title: "🕖 HOME BY 7-ISH, NO SUNDAY REGRETS",
      body: "Dance your heart out, home at a decent time, full night's sleep, feel great on Sunday. We're done with 2am taxis and writing off entire Sundays. Sometimes the revolution is just common sense."
    },
    {
      title: "💃 PARTY ON YOUR TERMS",
      body: "It's a real night out in the afternoon. Let yourself go, be yourself, enjoy time with your friends and be on the sofa watching Strictly before you know it."
    },
    {
      title: "🎶 YOU'LL KNOW EVERY SONG",
      body: "Four hours of pure anthems that you love. When was the last time you went somewhere and knew EVERY SINGLE WORD? That's what we do."
    }
  ];

  return (
    <section id="why" className="py-12 md:py-16 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <h2 
          ref={titleRef}
          className={`font-bebas text-3xl md:text-5xl font-bold text-primary text-center mb-16 uppercase transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Reasons Why THE 2PM CLUB Is A Social Game-Changer
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="font-bebas text-xl md:text-2xl font-bold text-primary mb-4 uppercase">
                {reason.title}
              </h3>
              <p className="font-poppins text-black leading-relaxed">
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