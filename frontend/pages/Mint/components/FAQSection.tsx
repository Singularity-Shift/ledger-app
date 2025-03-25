// Internal config
import { config } from "@/config";
// Internal components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQSectionProps {}

export const FAQSection: React.FC<FAQSectionProps> = () => {
  if (!config.faqs) return null;

  return (
    <section className="faq-container px-3 md:px-4 max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-3 md:p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <h2 className="text-center heading-md mb-2 md:mb-0">{config.faqs.title}</h2>

      <div className="flex flex-col space-y-2 pt-2 md:pt-4">
        {config.faqs.questions.map((question, i) => (
          <Accordion key={`faq-${i}`} type="single" collapsible className="w-full">
            <AccordionItem value={`item-${i}`} className="border-b-0">
              <AccordionTrigger className="py-2 md:py-4 text-left body-sm-semibold hover:no-underline">{question.title}</AccordionTrigger>
              <AccordionContent className="py-2 px-2 body-sm">{question.description}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};
