import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const BlogPost = () => {
  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = document.title;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, 'facebook-share', 'width=580,height=296');
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      // Use existing toast system
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Link copied to clipboard! 🎉' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Link copied to clipboard! 🎉' }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <>
      <Helmet>
        <title>Why 2PM is the New 2AM | THE 2PM CLUB™</title>
        <meta name="description" content="We cracked the code on perfect party timing. Discover why afternoon events sell out while evening ones struggle - it's all about timing, availability, and feeling amazing tomorrow." />
        <link rel="canonical" href="https://www.the2pmclub.co.uk/blog/why-daytime-discos-are-popular/" />
        
        {/* Social Meta */}
        <meta property="og:title" content="Why 2PM is the New 2AM" />
        <meta property="og:description" content="We cracked the code on perfect party timing - discover the science behind why afternoon parties work better." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://res.cloudinary.com/dteowuv7o/image/upload/c_fill,w_1200,h_630,f_jpg,q_auto/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context":"https://schema.org",
            "@type":"Article",
            "headline":"Why 2PM is the New 2AM",
            "mainEntityOfPage":"https://www.the2pmclub.co.uk/blog/why-daytime-discos-are-popular/",
            "author":{"@type":"Organization","name":"THE 2PM CLUB™"},
            "publisher":{"@type":"Organization","name":"THE 2PM CLUB™","logo":{"@type":"ImageObject","url":"https://www.the2pmclub.co.uk/icon.png"}},
            "datePublished":"2025-09-20",
            "about":["Daytime disco","Party timing","Afternoon events"],
            "articleSection":["Party Science","Timing","Social Events"]
          }
        `}</script>
      </Helmet>

      <main id="main-content" className="min-h-screen">
        <Header />
        
        {/* Main Content */}
        <div className="container mx-auto max-w-4xl px-4 py-12 pt-24">
          {/* Hero Card */}
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-8 border-l-8 border-primary">
            <h1 className="font-bebas text-4xl md:text-5xl text-card-foreground mb-4">
              Why 2PM is the New 2AM
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              We cracked the code on perfect party timing
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-card rounded-xl shadow-lg p-8 mb-8">
            <p className="text-lg leading-relaxed text-card-foreground">
              Here's something interesting: while everyone else was trying to reinvent nightlife, we discovered something hiding in plain sight. <strong>The best time to party isn't when you think it is.</strong>
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            
            {/* Sweet Spot Card */}
            <div className="bg-card rounded-xl shadow-lg p-8 border-l-4 border-secondary">
              <h2 className="font-bebas text-2xl text-card-foreground mb-4">The Sweet Spot Nobody Saw Coming</h2>
              <p className="text-card-foreground leading-relaxed mb-4">
                The afternoon events selling out consistently? They start between 2-4PM. The ones struggling to fill venues? They start at 5PM or later. Across England, afternoon events starting in that sweet spot achieve near-perfect attendance while later starts hover around 70% capacity.
              </p>
              <p className="text-card-foreground leading-relaxed">
                And here's the really clever bit: UK women aged 30-50 have their peak free time exactly when we're throwing the party. Saturday afternoons between 2-6PM show the lowest domestic obligations and highest leisure availability of the entire weekend. <strong>It's like the universe designed this window specifically for celebration.</strong>
              </p>
            </div>

            {/* Science Card */}
            <div className="bg-card rounded-xl shadow-lg p-8 border-l-4 border-accent">
              <h2 className="font-bebas text-2xl text-card-foreground mb-4">The Science of Feeling Amazing Tomorrow</h2>
              <p className="text-card-foreground leading-relaxed mb-4">
                Finishing by 6PM means you genuinely wake up Sunday feeling human. Not because we're being sensible, but because sleep science shows alcohol stops affecting your sleep quality about 3-4 hours after your last drink. So "home by teatime, great sleep by bedtime" isn't just catchy - it's biology.
              </p>
              <p className="text-card-foreground leading-relaxed font-medium">
                Your Sunday morning self will thank you for choosing smart timing over traditional stupidity.
              </p>
            </div>

            {/* Real People Card */}
            <div className="bg-card rounded-xl shadow-lg p-8 border-l-4 border-primary">
              <h2 className="font-bebas text-2xl text-card-foreground mb-4">Real People, Real Reactions</h2>
              <p className="text-card-foreground leading-relaxed mb-4">
                The proof? People don't just attend - they arrive singing and leave still singing. When we analyzed social media posts from actual attendees, the most common phrase was "so much fun" (mentioned 30 times), followed by "had a blast" and "best time ever."
              </p>
              <p className="text-card-foreground leading-relaxed">
                These aren't polite reviews. <strong>This is genuine enthusiasm from people who discovered that afternoon euphoria hits completely different.</strong>
              </p>
            </div>

            {/* Everyone Can Make It Card */}
            <div className="bg-card rounded-xl shadow-lg p-8 border-l-4 border-secondary">
              <h2 className="font-bebas text-2xl text-card-foreground mb-4">Why Everyone Can Finally Make It</h2>
              <p className="text-card-foreground leading-relaxed mb-4">
                No babysitter negotiations. No work-night anxiety. No choosing between having fun and having a life. The 2-6PM window naturally solves every coordination problem that's been killing your group chat plans for years.
              </p>
              <p className="text-card-foreground leading-relaxed font-medium">
                Finally, timing that works for humans with actual responsibilities who still want to have proper fun.
              </p>
            </div>

            {/* Bottom Line Card */}
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl shadow-lg p-8">
              <h2 className="font-bebas text-2xl mb-4">The Bottom Line</h2>
              <p className="leading-relaxed mb-4">
                We're not reinventing celebration - we're just doing it when it makes perfect sense. Same energy, better timing. Same euphoria, zero regret.
              </p>
              <p className="leading-relaxed font-medium">
                Because sometimes the revolution is just common sense with excellent confetti cannons.
              </p>
              <div className="mt-6">
                <p className="text-xl font-semibold">Ready to discover why Saturday afternoons are the new Saturday nights?</p>
              </div>
            </div>

          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 mb-8">
            <a href="/#tickets" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full text-xl font-bold hover:bg-primary/90 transition-colors shadow-lg">
              Find Your Event →
            </a>
          </div>

          {/* Social Share */}
          <div className="bg-card rounded-xl shadow-lg p-6 text-center">
            <h3 className="font-bebas text-lg mb-4 text-card-foreground">Share this article</h3>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleWhatsAppShare}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <img src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519736/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png" alt="WhatsApp" width="24" height="24" />
              </button>
              <button 
                onClick={handleFacebookShare}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </button>
            </div>
          </div>

        </div>

        <Footer />
      </main>
    </>
  );
};

export default BlogPost;