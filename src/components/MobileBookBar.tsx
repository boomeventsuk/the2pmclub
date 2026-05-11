import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const MobileBookBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("tickets");
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background/95 to-background/0 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#tickets"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-poppins font-semibold uppercase tracking-wide text-sm rounded-full py-4 shadow-[0_10px_30px_hsl(328_100%_54%_/_0.45)]"
      >
        Book Tickets <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export default MobileBookBar;
