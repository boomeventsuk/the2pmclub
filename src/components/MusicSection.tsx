import { useState } from 'react';

const SPOTIFY_SRC = 'https://open.spotify.com/embed/playlist/6e7znhSoj4DbYlTdXaxoDW?utm_source=generator&theme=0';

const MusicSection = () => {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <section id="music" className="py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(328_100%_54%_/_0.08)_0%,_transparent_60%)]" />

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <h2 className="font-bebas text-4xl md:text-5xl text-foreground mb-4 tracking-wide">
          Every Song A Banger. <span className="text-primary">Zero Filler.</span>
        </h2>

        <p className="font-poppins text-muted-foreground mb-8 text-base leading-relaxed max-w-2xl mx-auto">
          The songs you've been mouthing along to in Sainsbury's for 20 years. Finally played loud enough.
          <br /><br />
          <strong className="text-foreground">Spice Girls to Shania, Robbie to Rihanna, Bon Jovi to Beyoncé</strong> —
          every track a sing-along, every chorus louder than the last.
        </p>

        <div className="max-w-lg mx-auto rounded-xl overflow-hidden shadow-[0_0_40px_hsl(328_100%_54%_/_0.15)]">
          {showEmbed ? (
            <iframe
              title="THE 2PM CLUB Spotify playlist preview"
              src={SPOTIFY_SRC}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-xl"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowEmbed(true)}
              className="w-full h-[352px] rounded-xl bg-[#121212] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors group"
              aria-label="Load Spotify playlist preview"
            >
              {/* Spotify logo */}
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity">
                <circle cx="12" cy="12" r="12" fill="#1DB954"/>
                <path d="M17.25 16.26c-.2.33-.62.43-.95.23-2.6-1.59-5.87-1.95-9.72-1.07-.37.09-.74-.14-.83-.51-.09-.37.14-.74.51-.83 4.22-.96 7.84-.55 10.76 1.23.33.2.43.62.23.95zm1.16-2.58c-.25.4-.78.53-1.18.28-2.97-1.83-7.5-2.36-11.01-1.29-.46.14-.94-.12-1.08-.57-.14-.46.12-.94.57-1.08 4.02-1.22 9.02-.63 12.44 1.48.4.25.53.78.26 1.18zm.1-2.69c-3.57-2.12-9.45-2.31-12.85-1.28-.54.16-1.12-.14-1.28-.69-.16-.54.14-1.12.69-1.28 3.91-1.19 10.41-.96 14.52 1.49.49.29.65.92.36 1.41-.29.49-.92.65-1.41.36l-.03-.01z" fill="white"/>
              </svg>
              <div className="text-center">
                <p className="font-poppins font-semibold text-white text-sm">Preview the playlist</p>
                <p className="font-poppins text-xs text-white/50 mt-1">Click to load Spotify</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
