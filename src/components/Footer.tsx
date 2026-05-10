import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-[hsl(270_45%_10%)] border-t border-foreground/10 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-2">
              <img
                src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/9681c1c5-9af2-40fa-9e7f-0af6361274fc_k2q7ot.png"
                alt="THE 2PM CLUB Daytime Disco logo"
                className="h-10 w-auto"
                loading="lazy"
              />
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-poppins text-[11px] uppercase tracking-widest text-foreground/55 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li><a href="/" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/#tickets" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Upcoming Dates</a></li>
              <li><a href="/what-to-expect/" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#social-proof" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="/faqs/" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-poppins text-[11px] uppercase tracking-widest text-foreground/55 mb-3">Info</h3>
            <ul className="space-y-2">
              <li><a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="/terms" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Terms &amp; Conditions</a></li>
              <li><a href="/privacy" className="font-poppins text-sm text-foreground/85 hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-poppins text-[11px] uppercase tracking-widest text-foreground/55 mb-3">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/boombastic.eventsuk"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Boombastic Events on Facebook"
                className="w-9 h-9 rounded-full bg-foreground/10 hover:bg-primary/30 flex items-center justify-center text-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/boombastic.eventsuk"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Boombastic Events on Instagram"
                className="w-9 h-9 rounded-full bg-foreground/10 hover:bg-primary/30 flex items-center justify-center text-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-foreground/10 text-center">
          <p className="font-poppins text-xs text-foreground/55">
            © {new Date().getFullYear()} THE 2PM CLUB Daytime Disco. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
