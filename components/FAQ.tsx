'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { homeFaqs } from '@/data/faqs'
import { SITE } from '@/lib/site'

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Got questions? We've got answers. Find everything you need to know about our services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Accordion type="single" collapsible className="space-y-4">
            {homeFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-brand hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 animate-in fade-in duration-700 delay-500">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="text-secondary hover:text-secondary/80 font-semibold text-lg transition-colors"
          >
            Call us at {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
