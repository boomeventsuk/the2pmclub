const MusicSection = () => {
  return (
    <section id="music" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="font-bebas text-3xl md:text-5xl font-bold text-primary mb-6 uppercase">
          Your New Favourite Soundtrack
        </h2>
        
        <p className="font-poppins text-white mb-8 text-lg">
          Listen to our Spotify playlist
        </p>
        
        <div className="max-w-lg mx-auto">
          <iframe 
            src="https://open.spotify.com/embed/playlist/6e7znhSoj4DbYlTdXaxoDW?utm_source=generator&theme=0" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;