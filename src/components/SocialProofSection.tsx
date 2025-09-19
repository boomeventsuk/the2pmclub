import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
    <section id="social-proof" className="py-12 md:py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 
          ref={titleRef}
          className={`font-poppins text-3xl md:text-5xl font-bold text-primary text-center mb-16 uppercase transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Don't Just Take Our Word For It
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-white p-6 rounded-lg border border-border hover:border-primary/20 transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Star rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="font-poppins text-black mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <cite className="font-poppins text-primary font-semibold not-italic">
                — {testimonial.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;