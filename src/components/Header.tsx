import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [locationsOpen, setLocationsOpen] = useState(false);

  const toggleMobileMenu = () => {
    document.body.classList.toggle('nav-open');
  };

  const closeMobileMenu = () => {
    document.body.classList.remove('nav-open');
  };

  return (
    <>
      <header className="site-header fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 header-inner">
          {/* Logo */}
          <a href="/" className="site-logo">
            <img 
              src="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/9681c1c5-9af2-40fa-9e7f-0af6361274fc_k2q7ot.png"
              alt="The 2 PM Club logo"
              className="h-10 w-auto"
            />
          </a>
          
          {/* Navigation */}
          <nav className="primary-nav">
            <a 
              href="/#tickets"
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Events
            </a>
            <div className="cities-dropdown">
              <button 
                className="font-poppins text-muted-foreground hover:text-primary transition-colors cities-dropdown-trigger"
              >
                Locations ▾
              </button>
              <div className="cities-dropdown-menu">
                <a href="/hubs/northampton/" className="cities-dropdown-item">Northampton</a>
                <a href="/hubs/bedford/" className="cities-dropdown-item">Bedford</a>
                <a href="/hubs/milton-keynes/" className="cities-dropdown-item">Milton Keynes</a>
                <a href="/hubs/coventry/" className="cities-dropdown-item">Coventry</a>
                <a href="/hubs/luton/" className="cities-dropdown-item">Luton</a>
                <a href="/hubs/leicester/" className="cities-dropdown-item">Leicester</a>
              </div>
            </div>
            <a 
              href="/what-to-expect/"
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              What to Expect
            </a>
            <a 
              href="/group-bookings/"
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Group Bookings
            </a>
            <a 
              href="/faqs/"
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              FAQs
            </a>
          </nav>

          {/* Book Tickets CTA */}
          <div className="header-actions">
            <a href="/#tickets">
              <Button size="sm" className="font-poppins font-semibold">
                Book Tickets
              </Button>
            </a>
          </div>
          
          {/* Social Icons */}
          <div className="header-icons">
            <a href="https://www.instagram.com/boombastic.eventsuk" aria-label="Boombastic Events on Instagram" target="_blank" rel="noopener noreferrer nofollow">
              <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
            </a>
            <a href="https://www.facebook.com/boombastic.eventsuk" aria-label="Boombastic Events on Facebook" target="_blank" rel="noopener noreferrer nofollow">
              <svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h3.1v8h2.4z"/></svg>
            </a>
            <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" aria-label="Email">
              <svg viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM4 7.5l8 5 8-5V6H4v1.5z"/></svg>
            </a>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="nav-toggle text-2xl text-white p-2 hover:bg-white/10 rounded-md transition-colors" 
            aria-expanded="false" 
            aria-controls="mobile-menu" 
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="false">
          <a href="/#tickets" onClick={closeMobileMenu} className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Events
          </a>
          
          {/* Cities accordion */}
          <button 
            onClick={() => setLocationsOpen(!locationsOpen)}
            className="text-white hover:text-primary text-lg py-3 w-full text-left transition-colors flex items-center justify-between"
          >
            Locations
            <span className="text-sm opacity-60">{locationsOpen ? '▲' : '▼'}</span>
          </button>
          {locationsOpen && (
            <div className="pl-4 pb-2">
              <a href="/hubs/northampton/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Northampton</a>
              <a href="/hubs/bedford/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Bedford</a>
              <a href="/hubs/milton-keynes/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Milton Keynes</a>
              <a href="/hubs/coventry/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Coventry</a>
              <a href="/hubs/luton/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Luton</a>
              <a href="/hubs/leicester/" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary text-base py-2 block transition-colors">Leicester</a>
            </div>
          )}
          
          <a href="/what-to-expect/" onClick={closeMobileMenu} className="text-white hover:text-primary text-lg py-3 block transition-colors">
            What to Expect
          </a>
          <a href="/group-bookings/" onClick={closeMobileMenu} className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Group Bookings
          </a>
          <a href="/faqs/" onClick={closeMobileMenu} className="text-white hover:text-primary text-lg py-3 block transition-colors">
            FAQs
          </a>
          
          <hr style={{borderColor: "rgba(255,255,255,.08)"}} className="my-4" />
          <a href="https://www.facebook.com/boombastic.eventsuk" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Facebook
          </a>
          <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Email us
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
