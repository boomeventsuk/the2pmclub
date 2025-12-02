import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogIndex = () => {
  const publishedPosts = [
    {
      slug: "why-daytime-discos-are-popular",
      title: "Why 2PM is the New 2AM",
      excerpt: "We cracked the code on perfect party timing. Discover why afternoon events sell out while evening ones struggle.",
      image: "https://res.cloudinary.com/dteowuv7o/image/upload/c_fill,w_600,h_400,f_jpg,q_auto/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg",
      readTime: "4 min read",
      date: "20 Sep 2024",
      published: true
    },
    {
      slug: "why-2pm-works",
      title: "Why 2PM Works: The Evidence",
      excerpt: "The data behind THE 2PM CLUB's daytime format: attendance patterns, availability research, and recovery science.",
      image: "https://res.cloudinary.com/dteowuv7o/image/upload/c_fill,w_600,h_400,f_jpg,q_auto/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg",
      readTime: "5 min read",
      date: "25 Sep 2024",
      published: true
    }
  ];

  const comingSoonPosts = [
    {
      title: "Songs We Love",
      excerpt: "From Donna Summer to Dua Lipa—the iconic anthems that make every 2PM Club event unforgettable.",
      readTime: "5 min read",
      category: "Music"
    },
    {
      title: "The Science of Sleep After a Party",
      excerpt: "Why finishing by 6pm means you wake up Sunday feeling human. The biology behind smart timing.",
      readTime: "6 min read",
      category: "Wellness"
    },
    {
      title: "Why Daytime Parties Are Perfect for Groups",
      excerpt: "No babysitter negotiations. No work-night anxiety. Finally, timing that works for humans with responsibilities.",
      readTime: "4 min read",
      category: "Lifestyle"
    },
    {
      title: "The Ultimate Saturday Playlist",
      excerpt: "4 hours of iconic 80s, 90s & 00s anthems. Every track chosen to keep the energy high and the singalongs loud.",
      readTime: "3 min read",
      category: "Music"
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
        <meta property="og:image" content="https://res.cloudinary.com/dteowuv7o/image/upload/c_fill,w_1200,h_630,f_jpg,q_auto/v1757519594/28aa6d32-e3e7-4056-a5ca-26471fab5532_igct7w.jpg" />
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

        {/* Coming Soon Posts */}
        <section className="py-12 md:py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-bebas text-3xl md:text-4xl text-foreground mb-8 text-center">
                Coming Soon
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {comingSoonPosts.map((post, index) => (
                  <Card 
                    key={index}
                    className="bg-card/40 border-border/50 relative overflow-hidden opacity-75"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/30">
                        Coming Soon
                      </Badge>
                    </div>
                    <CardHeader className="space-y-3 pt-6">
                      <Badge variant="outline" className="w-fit border-primary/30 text-primary">
                        {post.category}
                      </Badge>
                      <CardTitle className="text-lg">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground/70 mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </CardContent>
                  </Card>
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
