import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function HomeFaq() {
  const faqs = [
    {
      question: "Is it really like a night out clubbing in the afternoon?",
      answer: "Yes. Club-level production, proper sound system, lighting, confetti moments. But you're done by 6pm and you'll actually feel good the next day. Same energy, better timing."
    },
    {
      question: "What music will be played?",
      answer: "80s, 90s and 00s anthems. Wall-to-wall songs you know every word to. The DJ builds the energy across the afternoon—starting with solid, accessible tracks and building toward peak moments. Think Whitney, Wham!, Spice Girls, Beyoncé, Take That, The Killers, Oasis."
    },
    {
      question: "Why do you start at 2pm?",
      answer: "Because it actually works with real life. You can have lunch with friends, run errands, whatever. You're done by 6pm, home by 7pm. You get a proper night out without sacrificing your Sunday or disrupting your week. That's the whole point."
    },
    {
      question: "Do you offer group tickets?",
      answer: "Yes. We offer group tickets for groups of four or more. People come to celebrate all sorts—birthdays, hen dos, work dos. But honestly, you don't need an excuse. The biggest thing is getting your friends together for a proper afternoon out. That's what this is for."
    },
    {
      question: "What's the crowd like?",
      answer: "Predominantly female, predominantly over 30. Everyone's welcome. Everyone's here for the same reason—to have a proper afternoon out with good music and good people. The atmosphere is genuinely welcoming."
    },
    {
      question: "What should I wear?",
      answer: "Whatever makes you feel good. Smart casual works perfectly – think the outfit you'd wear out for a nice afternoon. If you're planning to dance a lot, comfy shoes are your friend. Dress code is just to feel good."
    },
    {
      question: "What time do doors open and when does it finish?",
      answer: "Doors open at 2pm. Event runs until 6pm. You can arrive anytime after 2pm."
    }
  ];

  return (
    <section aria-labelledby="home-faq-title" className="py-16 md:py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 id="home-faq-title" className="font-bebas text-3xl md:text-4xl text-foreground mb-8 text-center">
            Questions People Ask Before They Book
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card/60 border border-border/40 rounded-xl px-4">
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
