import { Instagram } from "lucide-react";

const InstagramGrid = () => {
  // Until the Meta Graph API feed is wired in, we use the curated 2PM web library
  // already on the CDN. Each tile links straight to the IG profile.
  const posts = [
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg",
    "https://boombastic-events.b-cdn.net/Boombastic%20Events/event%20photos/2PM/280226-2PM-NPTON-confetti-cannon-rainbow-lighting-crowd.jpeg",
  ];

  return (
    <section
      aria-labelledby="instagram-title"
      className="py-14 md:py-20 px-4 bg-[hsl(270_45%_10%)] border-t border-foreground/10"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="font-poppins text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
              Real moments, no filter
            </p>
            <h2 id="instagram-title" className="font-poppins text-2xl md:text-4xl font-bold text-foreground">
              Follow the dancefloor
            </h2>
          </div>
          <a
            href="https://www.instagram.com/the2pmclub"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 self-start md:self-auto font-poppins text-sm font-semibold uppercase tracking-wider text-primary hover:gap-3 transition-all"
          >
            <Instagram className="w-4 h-4" />
            @the2pmclub
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {posts.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/the2pmclub"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group relative aspect-square overflow-hidden rounded-lg"
              aria-label="View on Instagram"
            >
              <img
                src={src}
                alt="THE 2PM CLUB on Instagram"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 flex items-center justify-center transition-colors">
                <Instagram className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGrid;
