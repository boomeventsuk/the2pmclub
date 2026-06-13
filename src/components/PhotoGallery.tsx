import { useState } from "react";

const photos = [
  {
    src: "/img/gallery/2pm-crowd-1.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFAv/EAB4QAAEEAwADAAAAAAAAAAAAAAEAAgMEERIhEzFR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgED/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQACEf/aAAwDAQACEQMRAD8AiiBz8fE1BFoNT6KVgtY4U15NmjCplZOgtPqtkOAhUoqxFYPA6hZGuzv/2Q==",
  },
  {
    src: "/img/gallery/2pm-crowd-2.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFA//EAB4QAAICAQUBAAAAAAAAAAAAAAECAAMEERITIYEx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgED/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAECESH/2gAMAwEAAhEDEQA/AE602kFe5RBD1BXHckUZWjfI82cFq0byFQ1w2daKZOGtTlgYTTIXlo5Q3kJZtAzT/9k=",
  },
  {
    src: "/img/gallery/2pm-crowd-3.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIEAwX/xAAcEAACAgMBAQAAAAAAAAAAAAABAgADBBESITH/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQID/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQARITH/2gAMAwEAAhEDEQA/AIMWsNpt+Sm2ytk4J+Tkpk8oFUx2sLaIk9tNLZyKwSF8hHvUHD6BhEIwueX/2Q==",
  },
  {
    src: "/img/gallery/2pm-crowd-4.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAIBBAX/xAAdEAABBQADAQAAAAAAAAAAAAABAAIDBBESEzEh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQP/xAAXEQEBAQEAAAAAAAAAAAAAAAABACEx/9oADAMBAAIRAxEAPwDIs1iZjvieOk0gFTBOJQ5z/UjrXF2A4h7UDNrFisOrW/MQmncTUDw5CBGL/9k=",
  },
  {
    src: "/img/gallery/2pm-crowd-5.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUE/8QAHhAAAgIBBQEAAAAAAAAAAAAAAQIAAwQREyEiI0H/xAAWAQEBAQAAAAAAAAAAAAAAAAACAAP/xAAYEQADAQEAAAAAAAAAAAAAAAAAARECIf/aAAwDAQACEQMRAD8Ajpt2dfsPiOF1J4mbFPqDLFrq9IWGQ1qfSWKilgAMTdZiimkWloktJhlP/9k=",
  },
  {
    src: "/img/gallery/2pm-crowd-6.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAQBAgMF/8QAHBAAAgICAwAAAAAAAAAAAAAAAQIAAwQhEhMx/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//EABcRAQEBAQAAAAAAAAAAAAAAAAEAEQL/2gAMAwEAAhEDEQA/AOTXWHHu5omKeQLGMJVU9IZTsSHuRa+J0Y3lLQRliKq7iG2IS74g6e4t7CRoxrf/2Q==",
  },
  {
    src: "/img/gallery/2pm-crowd-7.webp",
    lqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EABwQAAIDAAMBAAAAAAAAAAAAAAECAAMRBBIhMf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQACITH/2gAMAwEAAhEDEQA/AMcMQMURtdRQCzfslXka/ssD7WCT5CHar5F1Q7BxCNsULQLO2wjzoTlO/9k=",
  },
];

const GalleryImage = ({ photo, index }: { photo: (typeof photos)[number]; index: number }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-64 md:w-96 aspect-[4/3] rounded-xl overflow-hidden bg-card bg-cover bg-center shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundImage: `url(${photo.lqip})` }}
    >
      <img
        src={photo.src}
        alt={`THE 2PM CLUB party atmosphere ${(index % photos.length) + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const PhotoGallery = () => {
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
          <GalleryImage key={`${photo.src}-${index}`} photo={photo} index={index} />
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;
