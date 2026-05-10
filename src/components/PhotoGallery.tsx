const PhotoGallery = () => {
  // Mockup: 5 crowd photos in a row under "The 2PM CLUB crowd"
  const photos = [
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_1_ndjab4.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_2_qedzzq.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_3_nuwrvk.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_4_j87ixj.jpg",
    "https://boombastic-events.b-cdn.net/2PM%20Web%20Images/2pm_web_5_eln7gp.jpg",
  ];

  return (
    <section className="section-cream py-14 md:py-20 px-4">
      <div className="container mx-auto">
        <p className="font-poppins text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
          Real Saturdays, real people
        </p>
        <h2 className="font-poppins text-2xl md:text-4xl font-bold text-foreground mb-8">
          The <span className="text-primary">2PM CLUB</span> crowd
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={photo}
                alt={`THE 2PM CLUB crowd ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
