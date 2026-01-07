const PhotoGallery = () => {
  const photos = [
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_1_ndjab4.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_2_qedzzq.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268387/2pm_web_3_nuwrvk.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_4_j87ixj.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_5_eln7gp.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268386/2pm_web_6_bjt6h7.jpg",
    "https://res.cloudinary.com/dteowuv7o/image/upload/v1764268389/2pm_web_7_jl6yvd.jpg",
  ];

  // Duplicate for seamless infinite scroll
  const allPhotos = [...photos, ...photos];

  return (
    <section className="py-8 md:py-12 overflow-hidden bg-background relative">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-4 md:gap-6 animate-scroll">
        {allPhotos.map((photo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 md:w-72 aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={photo}
              alt={`THE 2PM CLUB party atmosphere ${(index % photos.length) + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;
