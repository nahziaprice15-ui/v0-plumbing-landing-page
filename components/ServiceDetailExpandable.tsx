'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Section = { heading: string; paragraphs: string[] }
type Faq = { question: string; answer: string }

export function ServiceDetailExpandable({ sections, faqs }: { sections: Section[]; faqs: Faq[] }) {
  return (
    <div className="space-y-10 mb-12">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Service details</h2>
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem key={section.heading} value={section.heading}>
              <AccordionTrigger className="text-base font-semibold text-left hover:no-underline">
                {section.heading}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground leading-relaxed pb-2">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Frequently asked questions</h2>
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-base font-semibold text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed pb-2">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
