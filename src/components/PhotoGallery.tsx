const PhotoGallery = () => {
  // Self-hosted optimised WebPs (44-68KB each vs 290-457KB CDN originals)
  const photos = Array.from({ length: 7 }, (_, i) => `/img/gallery/2pm-crowd-${i + 1}.webp`);

  // Duplicate for seamless infinite scroll
  const allPhotos = [...photos, ...photos];

  return (
    <section className="py-10 md:py-16 overflow-hidden bg-background relative">
      {/* Proof framing: the photos are the argument */}
      <div className="text-center mb-8 px-4">
        <h2 className="font-bebas text-4xl md:text-6xl text-foreground tracking-wide">
          THIS IS WHAT <span className="text-primary">2PM</span> LOOKS LIKE
        </h2>
        <p className="font-poppins text-base md:text-lg text-muted-foreground mt-2">
          Real photos. Real events. No stock imagery, ever.
        </p>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex gap-4 md:gap-6 animate-scroll">
        {allPhotos.map((photo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 md:w-96 aspect-[4/3] rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={photo}
              alt={`THE 2PM CLUB party atmosphere ${(index % photos.length) + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="800"
              height="600"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;
