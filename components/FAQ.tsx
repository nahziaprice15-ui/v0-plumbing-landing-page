'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Do you offer 24/7 emergency plumbing services?',
    answer: 'Yes! We provide round-the-clock emergency plumbing services. Our team is available 24/7, 365 days a year to handle urgent plumbing issues. We typically arrive within 2 hours of your call.',
  },
  {
    question: 'What areas in New Orleans do you service?',
    answer: 'We service all of New Orleans including the French Quarter, Garden District, Uptown, Mid-City, Bywater, Marigny, and surrounding areas. If you\'re in the greater New Orleans area, we can help!',
  },
  {
    question: 'Are you licensed and insured?',
    answer: 'Absolutely! MS & P LLC is fully licensed, bonded, and insured. Our technicians are certified professionals with over 15 years of combined experience in residential and commercial plumbing.',
  },
  {
    question: 'How much do your services cost?',
    answer: 'Pricing varies depending on the service needed. We offer free estimates for most jobs and transparent pricing with no hidden fees. Emergency services have a premium rate due to immediate response requirements.',
  },
  {
    question: 'Do you provide warranties on your work?',
    answer: 'Yes! We stand behind our work with comprehensive warranties. Labor is guaranteed for 1 year, and parts warranties vary by manufacturer (typically 1-5 years). We use only high-quality materials.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, cash, and checks. Payment is due upon completion of service. For larger projects, we can discuss payment plans.',
  },
  {
    question: 'How quickly can you respond to service calls?',
    answer: 'For emergencies, we aim to arrive within 2 hours. Standard service calls are typically scheduled within 24-48 hours. We always call ahead to confirm our arrival time.',
  },
  {
    question: 'Do I need to be home during the service?',
    answer: 'For most services, yes. However, if you can\'t be present, we can work with you to arrange access. We always provide a detailed summary and photos of completed work.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-muted">
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
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
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
            href="tel:+15045551234"
            className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
          >
            Call us at (504) 555-1234
          </a>
        </div>
      </div>
    </section>
  )
}
