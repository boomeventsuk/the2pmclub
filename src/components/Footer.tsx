import { Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-card border-t border-border py-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Logo + Contact + Social */}
          <div className="text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <img 
                src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/57926c83-5a73-43e4-b501-9f9c758534fd_fs7hwi.png" 
                alt="Boombastic Events Logo" 
                className="h-16 w-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex items-center justify-center md:justify-start mb-6">
              <a 
                href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-poppins">hello@boomevents.co.uk</span>
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6">
              <a 
                href="https://www.facebook.com/boombastic.eventsuk"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Boombastic Events on Facebook"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/boombastic.eventsuk"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Boombastic Events on Instagram"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="text-center md:text-left">
            <h3 className="font-poppins font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><a href="/what-to-expect/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">What to Expect</a></li>
              <li><a href="/group-bookings/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Group Bookings</a></li>
              <li><a href="/faqs/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="/blog/why-daytime-discos-are-popular/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Cities */}
          <div className="text-center md:text-left">
            <h3 className="font-poppins font-semibold text-foreground mb-4">Cities</h3>
            <ul className="space-y-3">
              <li><a href="/hubs/northampton/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Northampton</a></li>
              <li><a href="/hubs/bedford/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Bedford</a></li>
              <li><a href="/hubs/milton-keynes/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Milton Keynes</a></li>
              <li><a href="/hubs/coventry/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Coventry</a></li>
              <li><a href="/hubs/luton/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Luton</a></li>
              <li><a href="/hubs/leicester/" className="font-poppins text-muted-foreground hover:text-primary transition-colors">Leicester</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="font-poppins text-sm text-muted-foreground">
            © {new Date().getFullYear()} Boombastic Events Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
