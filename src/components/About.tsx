import { MapPin, Music, Sun } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Music,
      text: "Wall-to-wall 80s, 90s & 00s anthems from 2PM–6PM"
    },
    {
      icon: MapPin,
      text: "Sell-out parties across Northampton, Birmingham, Bedford, Milton Keynes, Coventry & Luton"
    },
    {
      icon: Sun,
      text: "Dance, sing along, and wake up fresh — no regrets, just a glow"
    }
  ];

  return (
    <section id="about" className="py-12 md:py-16 bg-card/30" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="about-title" className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-8 uppercase">
            About <span className="text-primary">THE 2PM CLUB</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-poppins text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
