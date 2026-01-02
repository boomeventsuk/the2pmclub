import { Star } from "lucide-react";
const TrustStrip = () => {
  return <section className="py-4 px-4 bg-card/80 backdrop-blur-sm border-y border-border/50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="ml-2 font-poppins text-sm text-foreground font-semibold">4.9/5</span>
          </div>
          <span className="hidden md:block text-muted-foreground">•</span>
          <span className="font-poppins text-sm text-muted-foreground">10,000+ happy partygoers</span>
          <span className="hidden md:block text-muted-foreground">•</span>
          <span className="font-poppins text-sm text-primary font-medium">Most dates sell out in advance</span>
        </div>
      </div>
    </section>;
};
export default TrustStrip;