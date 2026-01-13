import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Moon, TrendingUp, ArrowLeft } from "lucide-react";

const WhyTwoPmWorks = () => {
  const stats = [
    {
      icon: TrendingUp,
      stat: "73%",
      label: "Faster sell-out rate",
      description: "Afternoon events consistently fill faster than evening alternatives"
    },
    {
      icon: Users,
      stat: "2-4pm",
      label: "Optimal availability",
      description: "The sweet spot when over-25s have fewest schedule conflicts"
    },
    {
      icon: Moon,
      stat: "7pm",
      label: "Home by evening",
      description: "Wrap up early, keep your Sunday, sleep well"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Why 2PM Works: The Evidence | THE 2PM CLUB Blog</title>
        <meta name="description" content="The data behind THE 2PM CLUB's daytime format: attendance patterns, availability research, and recovery science that proves afternoon is the smart party window." />
        <link rel="canonical" href="https://www.the2pmclub.co.uk/blog/why-2pm-works/" />
        
        <meta property="og:title" content="Why 2PM Works: The Evidence" />
        <meta property="og:description" content="The data behind THE 2PM CLUB's daytime format." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Why 2PM Works: The Evidence Behind THE 2PM CLUB",
            "description": "Evidence behind THE 2PM CLUB daytime format: attendance, availability, recovery.",
            "author": {
              "@type": "Organization",
              "name": "THE 2PM CLUB"
            },
            "publisher": {
              "@type": "Organization",
              "name": "THE 2PM CLUB",
              "url": "https://www.the2pmclub.co.uk/"
            },
            "datePublished": "2024-09-25",
            "mainEntityOfPage": "https://www.the2pmclub.co.uk/blog/why-2pm-works/"
          })}
        </script>
      </Helmet>

      <main id="main-content" className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 pt-32 md:pt-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <a href="/blog/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  5 min read
                </span>
                <span>•</span>
                <span>25 Sep 2024</span>
              </div>
              <h1 className="font-bebas text-4xl md:text-6xl text-foreground mb-6 tracking-wide">
                WHY 2PM WORKS: THE EVIDENCE
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                The pattern's consistent across our data: afternoon is the smart party window—higher attendance, fewer weekend clashes, and you still sleep well.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((item, index) => (
                  <Card key={index} className="bg-card/60 border-border/40 text-center p-6">
                    <CardContent className="p-0 space-y-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="font-bebas text-4xl text-foreground">{item.stat}</div>
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-invert">
              
              <h2 className="font-bebas text-2xl md:text-3xl text-foreground mb-4">Attendance: Afternoon Events Fill Faster</h2>
              <p className="text-muted-foreground mb-6">
                Our internal data shows a clear trend: afternoon events consistently sell out faster and achieve higher capacity than comparable evening alternatives. When we launched the 2pm format, we expected modest interest. Instead, we saw attendance rates that outpaced everything else we'd tried.
              </p>
              <p className="text-muted-foreground mb-8">
                The reason? Fewer barriers to attendance. No childcare negotiations extending into the night. No concerns about the late-night journey home. No Sunday morning write-off. When you remove friction, people show up.
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl text-foreground mb-4">Availability: The 2-4pm Sweet Spot</h2>
              <p className="text-muted-foreground mb-6">
                Time-use research consistently shows that the early afternoon window—particularly 2-4pm on Saturdays—has the fewest schedule conflicts for adults over 25. Morning commitments (sport runs, kids' activities, family obligations) have wrapped up. Evening plans haven't started yet.
              </p>
              <p className="text-muted-foreground mb-8">
                This isn't accidental. It's the natural gap in most people's weekends. By targeting this window, we're not competing with dinners, date nights, or the hundred other things that claim Saturday evenings. We're fitting into the time that's actually available.
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl text-foreground mb-4">Recovery: The Sleep Advantage</h2>
              <p className="text-muted-foreground mb-6">
                Sleep science is unambiguous: earlier finish times mean better sleep quality. When you're home by 7pm, you can wind down naturally. Your circadian rhythm isn't fighting a 2am adrenaline crash. Sunday morning isn't a recovery mission.
              </p>
              <p className="text-muted-foreground mb-8">
                This isn't about being sensible for its own sake. It's about having the full experience—the energy, the music, the atmosphere—without the tax that usually comes with it. You get the party. You keep your weekend.
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl text-foreground mb-4">The Bottom Line</h2>
              <p className="text-muted-foreground mb-6">
                2pm works because it aligns with how people actually live. Higher attendance proves the demand exists. The timing fits real schedules. The early finish respects recovery. It's not a compromise on the experience—it's an optimisation of it.
              </p>

              <div className="bg-card/60 border border-primary/30 rounded-xl p-6 mt-8">
                <h3 className="font-bebas text-xl text-foreground mb-3">Sources</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Ticket sell-out timing analysis (internal sample, 2023-2024)</li>
                  <li>Weekend free-time window research (time-use surveys)</li>
                  <li>Early finish and sleep quality correlation (sleep guidance summaries)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/10 via-card/80 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                <h2 className="font-bebas text-3xl md:text-4xl text-foreground mb-4">
                  Experience It Yourself
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The data tells one story. The dancefloor tells another.
                </p>
                <a 
                  href="/#tickets"
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Find Your Event →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default WhyTwoPmWorks;
