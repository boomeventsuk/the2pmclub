import { Star } from "lucide-react";

/**
 * Visible trust bar. Single approved set of numbers, same as llms.txt.
 * Mounted under the homepage hero and above the checkout on event pages.
 */
const TrustStrip = () => {
  return (
    <section className="py-4 px-4 bg-card/80 backdrop-blur-sm border-y border-border/50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 font-poppins text-sm text-foreground font-semibold">
              4.9/5 from 250+ reviews
            </span>
          </div>
          <span className="hidden md:block text-muted-foreground">•</span>
          <span className="font-poppins text-sm text-muted-foreground">
            23,000+ through the doors since 2014
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
