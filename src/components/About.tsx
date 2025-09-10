const About = () => {
  return (
    <section id="about" className="py-lg bg-background" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <div className="about max-w-4xl mx-auto text-center">
          <h2 id="about-title" className="about-title font-bebas text-5xl md:text-6xl font-bold text-center mb-lg text-foreground">
            About THE 2PM CLUB™
          </h2>
          <p className="lead font-poppins text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong className="text-primary">THE 2PM CLUB™</strong> is the Midlands' most popular daytime disco for over-25s, 
            delivering big night out energy with smarter afternoon timing. Created by Boombastic Events, 
            we've perfected the art of the <strong className="text-primary">daytime party</strong> - featuring wall-to-wall 
            80s, 90s and 00s anthems from 2PM-6PM. With sell-out parties across Northampton, Birmingham, Bedford, 
            Milton Keynes, Coventry and Luton, our concept is simple: dance, sing along, and 
            <strong className="text-primary">wake up fresh</strong> the next day. No regrets, just a glow that'll last for days!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;