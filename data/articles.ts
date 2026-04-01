export type ArticleSection = {
  heading: string
  paragraphs: string[]
}

export type ArticleDefinition = {
  slug: string
  title: string
  description: string
  /** ISO 8601 — first publication */
  datePublished: string
  /** ISO 8601 — last substantive edit (UI + schema + sitemap) */
  dateModified: string
  intro: string
  sections: ArticleSection[]
}

export const articles: ArticleDefinition[] = [
  {
    slug: 'emergency-plumbing-before-the-plumber-arrives',
    title: 'Emergency plumbing in New Orleans: what to do before we arrive',
    description:
      'Practical steps to limit water damage during a burst pipe, backup, or major leak—while you wait for MS & P LLC.',
    datePublished: '2026-02-10T10:00:00.000Z',
    dateModified: '2026-03-28T14:30:00.000Z',
    intro:
      'A plumbing emergency is stressful. These steps help protect your home, your family, and your property while our team is on the way across New Orleans.',
    sections: [
      {
        heading: 'Shut off the water when it is safe',
        paragraphs: [
          'If you know where your main water shutoff is, turn it clockwise to stop flow to the house. For a single fixture, use the angle stop behind the toilet or under the sink. If you are unsure, describe what you see when you call—we can talk you through it.',
          'Never enter standing water if you suspect electrical contact; keep clear and wait for professionals.',
        ],
      },
      {
        heading: 'Reduce damage and document',
        paragraphs: [
          'Move valuables and electronics away from water. Use towels or a mop on hard surfaces if you can do so safely; avoid slipping on wet tile.',
          'Photos or short video of the affected area help us plan parts and tools before we arrive.',
        ],
      },
      {
        heading: 'When to call 911 or your utility first',
        paragraphs: [
          'If you smell gas near a water heater or appliance, leave the building and call 911 from outside—do not operate switches or create sparks.',
          'Sewage backing into living spaces can pose health risks; avoid contact and keep children and pets away from the area until it is cleaned and disinfected professionally if needed.',
        ],
      },
    ],
  },
  {
    slug: 'water-heater-repair-vs-replace-new-orleans',
    title: 'Water heater: when to repair vs. replace in a New Orleans home',
    description:
      'How to think about age, efficiency, and recurring problems so you can budget confidently—with honest criteria we use on service calls.',
    datePublished: '2026-02-18T09:00:00.000Z',
    dateModified: '2026-03-15T11:00:00.000Z',
    intro:
      'Louisiana humidity and mineral content in water affect tanks and connections over time. Here is a straightforward framework for deciding between repair and replacement.',
    sections: [
      {
        heading: 'Age and tank condition',
        paragraphs: [
          'Conventional tank water heaters often last roughly 8–12 years with maintenance, depending on usage and water quality. If the tank is past its typical lifespan and showing rust on the jacket, noise, or moisture at the base, replacement is often the better long-term value.',
          'A newer unit with a single failed component—such as a thermocouple, gas valve, or element—may be worth repairing if the tank itself is sound.',
        ],
      },
      {
        heading: 'Efficiency and operating cost',
        paragraphs: [
          'If your bills are climbing and the heater is older, a newer efficient model may pay back over time. We can explain options that fit your space and venting.',
        ],
      },
      {
        heading: 'Recurring problems',
        paragraphs: [
          'Multiple service calls for the same symptom in a short window can signal systemic issues—corrosion, bad dip tube, or sediment buildup beyond quick flushing. We will tell you plainly when another repair is throwing good money after bad.',
        ],
      },
    ],
  },
  {
    slug: 'older-home-drain-care-new-orleans',
    title: 'Drain care for older New Orleans homes',
    description:
      'Why galley kitchens, mature trees, and settled lines matter—and habits that keep drains flowing between professional cleanings.',
    datePublished: '2026-03-01T12:00:00.000Z',
    dateModified: '2026-03-31T08:00:00.000Z',
    intro:
      'Many neighborhoods in New Orleans have charming older plumbing mixed with modern usage. A little prevention goes a long way toward avoiding backups and emergency calls.',
    sections: [
      {
        heading: 'What makes clogs more common here',
        paragraphs: [
          'Grease poured down kitchen sinks solidifies in cooler stretches of pipe. Tree roots seek moisture and can intrude into sewer laterals over years. Older cast iron or clay lines may have offsets or bellies that collect debris.',
        ],
      },
      {
        heading: 'Daily habits that help',
        paragraphs: [
          'Scrape plates into the trash, not the disposal. Use sink strainers. Only flush human waste and toilet paper—no wipes labeled “flushable,” which still snag in municipal and home lines.',
          'If multiple fixtures gurgle or drain slowly together, that often points past the branch line; stop using water and call before it backs up into tubs or showers.',
        ],
      },
      {
        heading: 'When to call a pro',
        paragraphs: [
          'Recurring slow drains after DIY chemicals, or sewage smell near floor drains, warrant a camera inspection or professional cleaning. We match the method—snaking, auger, or jetting—to what your line needs.',
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getAllArticleSlugs() {
  return articles.map((a) => a.slug)
}
