/**
 * Visible trust bar. Founder voice, no numeric badges: the hard figures live
 * only in the background GEO files for AI crawlers, per brand direction.
 * Mounted under the homepage hero and above the checkout on event pages.
 */
const TrustStrip = () => {
  return (
    <section className="py-4 px-4 bg-card/80 backdrop-blur-sm border-y border-border/50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center">
          <span className="font-poppins text-sm text-foreground font-semibold">
            Been going since 2014
          </span>
          <span className="hidden md:block text-muted-foreground">•</span>
          <span className="font-poppins text-sm text-muted-foreground">
            Selling out across the Midlands
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
