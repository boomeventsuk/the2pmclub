import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Clock, Users, PartyPopper, Share2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WhyDaytimeDiscosArePopular = () => {
  const isMobile = useIsMobile();

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = document.title;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const url = window.location.href;
    
    if (isMobile) {
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
    } else {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, 'facebook-share', 'width=580,height=296');
    }
  };

  const stats = [
    { icon: Clock, label: "Sweet Spot", value: "2-4PM", description: "Peak free time window" },
    { icon: Users, label: "Attendance", value: "100%", description: "vs 70% evening events" },
    { icon: PartyPopper, label: "Home By", value: "7PM", description: "Great sleep guaranteed" }
  ];

  return (
    <>
      <Helmet>
        <title>Why 2PM is the New 2AM | THE 2PM CLUB</title>
        <meta name="description" content="We cracked the code on perfect party timing. Discover why afternoon events sell out while evening ones struggle - it's all about timing, availability, and feeling amazing tomorrow." />
        <link rel="canonical" href="https://www.the2pmclub.co.uk/blog/why-daytime-discos-are-popular/" />
        
        <meta property="og:title" content="Why 2PM is the New 2AM" />
        <meta property="og:description" content="We cracked the code on perfect party timing - discover the science behind why afternoon parties work better." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        
        <script type="application/ld+json">{`
          {
            "@context":"https://schema.org",
            "@type":"Article",
            "headline":"Why 2PM is the New 2AM",
            "mainEntityOfPage":"https://www.the2pmclub.co.uk/blog/why-daytime-discos-are-popular/",
            "author":{"@type":"Organization","name":"THE 2PM CLUB"},
            "publisher":{"@type":"Organization","name":"THE 2PM CLUB","logo":{"@type":"ImageObject","url":"https://www.the2pmclub.co.uk/icon.png"}},
            "datePublished":"2024-09-20",
            "about":["Daytime disco","Party timing","Afternoon events"],
            "articleSection":["Party Science","Timing","Social Events"]
          }
        `}</script>
      </Helmet>

      <main id="main-content" className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 pt-32 md:pt-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="absolute inset-0 bg-[url('https://boombastic-events.b-cdn.net/The2PMCLUB-Website/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  20 September 2024
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  4 min read
                </span>
              </div>
              <h1 className="font-bebas text-5xl md:text-7xl text-foreground mb-6 leading-tight">
                Why 2PM is the New 2AM
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                We cracked the code on perfect party timing
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>

        {/* Intro Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-1">
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                    <p className="text-lg font-semibold text-foreground italic leading-relaxed">
                      "The best time to party isn't when you think it is."
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-lg text-foreground/85 leading-relaxed">
                    Here's something interesting: while everyone else was trying to reinvent nightlife, we discovered something hiding in plain sight. The afternoon events selling out consistently? They start between 2-4PM. The ones struggling to fill venues? They start at 5PM or later.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-primary/5 border-primary/30 text-center">
                    <CardHeader className="pb-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-3xl font-bebas text-foreground">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-foreground mb-1">{stat.label}</p>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Sweet Spot Section */}
              <Card className="bg-card/60 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bebas text-foreground">
                    The Sweet Spot Nobody Saw Coming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/85 leading-relaxed">
                    Across England, afternoon events starting in that sweet spot achieve near-perfect attendance while later starts hover around 70% capacity. And here's the really clever bit: UK women aged 30-50 have their peak free time exactly when we're throwing the party.
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-foreground font-semibold">
                      Saturday afternoons between 2-6PM show the lowest domestic obligations and highest leisure availability of the entire weekend.
                    </p>
                  </div>
                  <p className="text-foreground/85 leading-relaxed">
                    It's like the universe designed this window specifically for celebration.
                  </p>
                </CardContent>
              </Card>

              {/* Science Section */}
              <Card className="bg-card/60 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bebas text-foreground">
                    The Science of Feeling Amazing Tomorrow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/85 leading-relaxed">
                    Finishing by 6PM means you genuinely wake up Sunday feeling human. Not because we're being sensible, but because sleep science shows alcohol stops affecting your sleep quality about 3-4 hours after your last drink.
                  </p>
                  <div className="bg-secondary/5 border-l-4 border-secondary p-4 rounded-r-lg">
                    <p className="text-foreground font-semibold">
                      "Home by teatime, great sleep by bedtime" isn't just catchy—it's biology.
                    </p>
                  </div>
                  <p className="text-foreground/85 leading-relaxed">
                    Your Sunday morning self will thank you for choosing smart timing over traditional stupidity.
                  </p>
                </CardContent>
              </Card>

              {/* Real People Section */}
              <Card className="bg-card/60 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bebas text-foreground">
                    Real People, Real Reactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/85 leading-relaxed">
                    The proof? People don't just attend—they arrive singing and leave still singing. When we analyzed social media posts from actual attendees, the most common phrase was "so much fun" (mentioned 30 times), followed by "had a blast" and "best time ever."
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-foreground font-semibold">
                      This is genuine enthusiasm from people who discovered that afternoon euphoria hits completely different.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Coordination Section */}
              <Card className="bg-card/60 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bebas text-foreground">
                    Why Everyone Can Finally Make It
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/85 leading-relaxed">
                    No babysitter negotiations. No work-night anxiety. No choosing between having fun and having a life. The 2-6PM window naturally solves every coordination problem that's been killing your group chat plans for years.
                  </p>
                  <div className="bg-secondary/5 border-l-4 border-secondary p-4 rounded-r-lg">
                    <p className="text-foreground font-semibold">
                      Finally, timing that works for humans with actual responsibilities who still want to have proper fun.
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Bottom Line CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/10 via-card/80 to-secondary/10 border-primary/20">
                <CardContent className="p-8 md:p-12 text-center">
                  <h2 className="font-bebas text-3xl md:text-4xl text-foreground mb-6">
                    The Bottom Line
                  </h2>
                  <p className="text-lg text-foreground/85 leading-relaxed mb-4">
                    We're not reinventing celebration—we're just doing it when it makes perfect sense. Same energy, better timing. Same euphoria, zero regret.
                  </p>
                  <p className="text-lg text-foreground font-semibold mb-8">
                    Because sometimes the revolution is just common sense with excellent confetti cannons.
                  </p>
                  <p className="text-xl md:text-2xl text-foreground font-bold mb-8">
                    Ready to discover why Saturday afternoons are the new Saturday nights?
                  </p>
                  <a 
                    href="/#tickets"
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Find Your Event →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-2xl md:text-3xl text-foreground mb-6">
                Related Reading
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <a href="/blog/" className="group">
                  <Card className="bg-card/60 border-border hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Explore More Blog Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Dive into more stories about music, science, and Saturday culture
                      </p>
                    </CardContent>
                  </Card>
                </a>
                <a href="/#tickets" className="group">
                  <Card className="bg-card/60 border-border hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Find Your Event
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Experience the afternoon difference for yourself
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Social Share */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/60 border-border">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bebas text-xl text-foreground">Share This Article</h3>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={handleWhatsAppShare}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
                      aria-label="Share on WhatsApp"
                    >
                      <img src="https://res.cloudinary.com/dteowuv7o/image/upload/v1757519736/bb7f178c-1cf5-4ce2-a752-a39c92c097f7_cbk3z9.png" alt="WhatsApp" width="24" height="24" />
                    </button>
                    <button 
                      onClick={handleFacebookShare}
                      title={isMobile ? "Share on Messenger" : "Share on Facebook"}
                      aria-label={isMobile ? "Share on Messenger" : "Share on Facebook"}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {isMobile ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.05 1.9c.02.52.49.88.98.76l2.12-.53c.19-.05.39-.02.56.05 1.01.35 2.12.54 3.29.54 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.02L10.5 12.3l-4.28 2.8 4.7-5.02 2.62 2.72 4.2-2.8-4.7 5.02z"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default WhyDaytimeDiscosArePopular;
