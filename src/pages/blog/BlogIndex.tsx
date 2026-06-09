import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogIndex = () => {
  const publishedPosts = [
    {
      slug: "what-is-a-daytime-disco",
      title: "What Is a Daytime Disco?",
      excerpt: "Everything you need to know about daytime discos: what they are, who goes, and why they sell out.",
      image: "https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-confetti-cannon-rainbow-lighting-crowd.jpeg?width=600&quality=75",
      readTime: "5 min read",
      date: "15 Aug 2024",
      published: true,
      isStatic: true
    },
    {
      slug: "hen-do-daytime-disco",
      title: "Hen Do Daytime Disco: The Afternoon Alternative",
      excerpt: "Why a daytime disco hen party is the plan everyone actually says yes to.",
      image: "https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-woman-gold-dress-arms-wide-dancing-crowd.jpeg?width=600&quality=75",
      readTime: "4 min read",
      date: "1 Sep 2024",
      published: true,
      isStatic: true
    },
    {
      slug: "hen-party-ideas-northampton",
      title: "Hen Party Ideas in Northampton",
      excerpt: "The best hen party ideas in Northampton, from afternoon discos to cocktail classes.",
      image: "https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/280226-2PM-NPTON-confetti-cannon-rainbow-lighting-crowd.jpeg?width=600&quality=75",
      readTime: "5 min read",
      date: "10 Sep 2024",
      published: true,
      isStatic: true
    },
    {
      slug: "birthday-party-ideas-northampton-adults",
      title: "Birthday Party Ideas for Adults in Northampton",
      excerpt: "Grown-up birthday ideas that actually work: daytime discos, group experiences, and more.",
      image: "https://boombastic-events.b-cdn.net/EVENT%20PHOTOS/2PM/070326-2PM-COV-crowd-confetti-cannon-arms-raised-stage.jpeg?width=600&quality=75",
      readTime: "5 min read",
      date: "15 Sep 2024",
      published: true,
      isStatic: true
    },
    {
      slug: "why-daytime-discos-are-popular",
      title: "Why Daytime Discos Are So Popular",
      excerpt: "The rise of the afternoon party: why daytime events sell out while evening ones struggle.",
      image: "https://boombastic-events.b-cdn.net/The2PMCLUB-Website/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg",
      readTime: "4 min read",
      date: "20 Sep 2024",
      published: true,
      isStatic: true
    }
  ];


  return (
    <>
      <Helmet>
        <title>Blog | THE 2PM CLUB</title>
        <meta name="description" content="Stories, science, and the soundtrack to your Saturday. Discover why afternoon parties work, the music we love, and the culture of daytime disco." />
        <link rel="canonical" href="https://www.the2pmclub.co.uk/blog/" />
        
        <meta property="og:title" content="THE 2PM CLUB Blog" />
        <meta property="og:description" content="Stories, science, and the soundtrack to your Saturday" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://boombastic-events.b-cdn.net/The2PMCLUB-Website/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main id="main-content" className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 pt-32 md:pt-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-bebas text-5xl md:text-7xl text-foreground mb-6 tracking-wide">
                THE 2PM CLUB BLOG
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Stories, science, and the soundtrack to your Saturday
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>

        {/* Published Posts */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedPosts.map((post) => (
                  <a 
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="group block"
                  >
                    <Card className="bg-card/60 border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden">
                      <div className="relative overflow-hidden aspect-video">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                      <CardHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-muted-foreground mb-4">
                          {post.excerpt}
                        </CardDescription>
                        <div className="flex items-center text-primary font-semibold">
                          Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
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
                  Ready to Experience It?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Reading about it is one thing. Living it is completely different.
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

export default BlogIndex;
