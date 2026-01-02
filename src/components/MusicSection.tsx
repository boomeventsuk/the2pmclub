const MusicSection = () => {
  return (
    <section id="music" className="py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(328_100%_54%_/_0.08)_0%,_transparent_60%)]" />
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <h2 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase">
          Nothing But The <span className="text-primary">Biggest Anthems</span>
        </h2>
        
        <p className="font-poppins text-muted-foreground mb-8 text-base leading-relaxed max-w-2xl mx-auto">
          <strong className="text-foreground">Spice Girls to Shania, Robbie to Rihanna, Bon Jovi to Beyoncé</strong> — 
          every track a sing-along, every chorus louder than the last.
        </p>
        
        <div className="max-w-lg mx-auto rounded-xl overflow-hidden shadow-[0_0_40px_hsl(328_100%_54%_/_0.15)]">
          <iframe 
            src="https://open.spotify.com/embed/playlist/6e7znhSoj4DbYlTdXaxoDW?utm_source=generator&theme=0" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
