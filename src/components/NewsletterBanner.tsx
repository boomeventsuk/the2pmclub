import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CalendarPlus, ShieldCheck } from "lucide-react";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Hook into your existing subscribe endpoint when ready.
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "newsletter_signup", source: "homepage_banner" });
    setSubmitted(true);
  };

  return (
    <section className="newsletter-banner py-14 md:py-20 px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://boombastic-events.b-cdn.net/Boombastic%20Events/event%20photos/2PM/280226-2PM-NPTON-confetti-cannon-rainbow-lighting-crowd.jpeg')" }}
    >
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Headline */}
          <div className="text-foreground">
            <h2 className="font-poppins text-3xl md:text-5xl font-extrabold leading-tight">
              Be first to know <br className="hidden md:block" />
              before the group <br className="hidden md:block" />
              chat <span className="text-primary">wakes up.</span>
            </h2>
            <p className="font-poppins text-foreground/80 mt-4 max-w-md">
              Get a 24-hour head start on new dates before they go on general sale, plus first dibs when we add a new city.
            </p>
          </div>

          {/* Form + benefits */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 bg-foreground/10 backdrop-blur-md border border-foreground/15 rounded-full p-1.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground/55 px-5 py-3 outline-none font-poppins text-sm"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wide rounded-full px-6 py-5 text-xs"
              >
                {submitted ? "You're in" : "Join the Community"}
              </Button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <Benefit icon={Clock} title="24-hour" subtitle="early access" />
              <Benefit icon={MapPin} title="New cities" subtitle="first" />
              <Benefit icon={CalendarPlus} title="Dates" subtitle="before public" />
              <Benefit icon={ShieldCheck} title="No spam" subtitle="One email, max" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Benefit = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-start gap-2 text-foreground/90">
    <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={2.2} />
    <div className="leading-tight">
      <div className="text-[11px] uppercase tracking-wider font-semibold">{title}</div>
      <div className="text-[11px] uppercase tracking-wider text-foreground/70">{subtitle}</div>
    </div>
  </div>
);

export default NewsletterBanner;
