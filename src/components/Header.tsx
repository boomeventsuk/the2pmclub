import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 116; // Account for fixed header + community banner
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleMobileMenu = () => {
    document.body.classList.toggle('nav-open');
  };

  const closeMobileMenu = () => {
    document.body.classList.remove('nav-open');
  };

  const handleMobileNavClick = (id: string) => {
    scrollToSection(id);
    closeMobileMenu();
  };

  return (
    <>
      <header className="site-header fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 header-inner">
          {/* Logo */}
          <a href="/" className="site-logo">
        <img 
          src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519826/9681c1c5-9af2-40fa-9e7f-0af6361274fc_k2q7ot.png" 
          alt="The 2 PM Club logo"
          className="h-10 w-auto"
        />
          </a>
          
          {/* Navigation */}
          <nav className="primary-nav">
            <button 
              onClick={() => scrollToSection('why')}
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Why 2PM Works
            </button>
            <button 
              onClick={() => scrollToSection('tickets')}
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Tickets
            </button>
            <button 
              onClick={() => scrollToSection('social-proof')}
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('music')}
              className="font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              Music
            </button>
          </nav>
          
          {/* Social Icons */}
          <div className="header-icons">
            {/* Instagram */}
            <a href="https://www.instagram.com/boombastic.eventsuk" aria-label="Boombastic Events on Instagram" target="_blank" rel="noopener noreferrer nofollow">
              <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/boombastic.eventsuk" aria-label="Boombastic Events on Facebook" target="_blank" rel="noopener noreferrer nofollow">
              <svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h3.1v8h2.4z"/></svg>
            </a>
            {/* Email */}
            <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" aria-label="Email">
              <svg viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM4 7.5l8 5 8-5V6H4v1.5z"/></svg>
            </a>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={() => scrollToSection('tickets')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-semibold book-cta"
          >
            Book Tickets
          </Button>
          
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
          <button onClick={() => handleMobileNavClick('why')} className="text-white hover:text-primary text-lg py-3 w-full text-left transition-colors">
            Why 2PM Works
          </button>
          <button onClick={() => handleMobileNavClick('tickets')} className="text-white hover:text-primary text-lg py-3 w-full text-left transition-colors">
            Tickets
          </button>
          <button onClick={() => handleMobileNavClick('social-proof')} className="text-white hover:text-primary text-lg py-3 w-full text-left transition-colors">
            Reviews
          </button>
          <button onClick={() => handleMobileNavClick('music')} className="text-white hover:text-primary text-lg py-3 w-full text-left transition-colors">
            Music
          </button>
          <hr style={{borderColor: "rgba(255,255,255,.08)"}} className="my-4" />
          <a href="https://www.facebook.com/boombastic.eventsuk" target="_blank" rel="noopener noreferrer nofollow" className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Facebook
          </a>
          <a href="mailto:hello@boomevents.co.uk?subject=The%202PM%20CLUB%20query" className="text-white hover:text-primary text-lg py-3 block transition-colors">
            Email us
          </a>
        </div>
      </header>
      
      {/* Community Banner */}
      <div className="community-banner">
        <a 
          href="https://www.facebook.com/groups/daytimediscorevolution" 
          target="_blank" 
          rel="noopener noreferrer"
          className="community-banner-link"
        >
          JOIN THE 2PM CLUB COMMUNITY! CLICK HERE TO JOIN OUR OFFICIAL FACEBOOK GROUP
        </a>
      </div>
    </>
  );
};

export default Header;
