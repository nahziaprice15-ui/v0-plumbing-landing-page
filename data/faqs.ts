export type FaqItem = {
  question: string
  answer: string
}

export const homeFaqs: FaqItem[] = [
  {
    question: 'Do you offer 24/7 emergency plumbing services?',
    answer:
      'Yes! We provide round-the-clock emergency plumbing services. Our team is available 24/7, 365 days a year to handle urgent plumbing issues. We typically arrive within 2 hours of your call.',
  },
  {
    question: 'What areas in New Orleans do you service?',
    answer:
      "We service all of New Orleans including the French Quarter, Garden District, Uptown, Mid-City, Bywater, Marigny, and surrounding areas. If you're in the greater New Orleans area, we can help!",
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Absolutely! MS & P LLC is fully licensed, bonded, and insured. Our technicians are certified professionals with over 15 years of combined experience in residential and commercial plumbing.',
  },
  {
    question: 'How much do your services cost?',
    answer:
      'Pricing varies depending on the service needed. We offer free estimates for most jobs and transparent pricing with no hidden fees. Emergency services have a premium rate due to immediate response requirements.',
  },
  {
    question: 'Do you provide warranties on your work?',
    answer:
      'Yes! We stand behind our work with comprehensive warranties. Labor is guaranteed for 1 year, and parts warranties vary by manufacturer (typically 1-5 years). We use only high-quality materials.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, cash, and checks. Payment is due upon completion of service. For larger projects, we can discuss payment plans.',
  },
  {
    question: 'How quickly can you respond to service calls?',
    answer:
      'For emergencies, we aim to arrive within 2 hours. Standard service calls are typically scheduled within 24-48 hours. We always call ahead to confirm our arrival time.',
  },
  {
    question: 'Do I need to be home during the service?',
    answer:
      "For most services, yes. However, if you can't be present, we can work with you to arrange access. We always provide a detailed summary and photos of completed work.",
  },
  {
    question: 'Do you work on commercial properties in New Orleans?',
    answer:
      'Yes. MS & P LLC handles select commercial plumbing—restaurants, small retail, offices, and property management turnarounds—alongside residential work. Tell us your building type and hours of operation so we can plan access and minimize disruption.',
  },
  {
    question: 'Can you help with permits or code questions for plumbing work?',
    answer:
      'We coordinate permits when your project requires them and explain how local code applies to water heaters, backflow, gas lines, and major alterations. If something is outside our scope, we will point you to the right resource.',
  },
]

export function buildFaqPageJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } as const
}
