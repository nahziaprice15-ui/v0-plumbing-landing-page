import type { FaqItem } from '@/data/faqs'

export type ServiceDefinition = {
  slug: string
  title: string
  description: string
  h1: string
  intro: string
  sections: { heading: string; paragraphs: string[] }[]
  faqs: FaqItem[]
}

export const services: ServiceDefinition[] = [
  {
    slug: 'emergency-plumbing',
    title: '24/7 Emergency Plumber in New Orleans | MS & P LLC',
    description:
      'Burst pipe, flooding, or no water? MS & P LLC provides 24/7 emergency plumbing in New Orleans with fast response. Licensed, insured—call or book online.',
    h1: 'Emergency plumbing in New Orleans',
    intro:
      'When a pipe bursts or your home is flooding, you need a licensed plumber who answers the phone and shows up fast. MS & P LLC offers 24/7 emergency plumbing across New Orleans and nearby areas, with a focus on stopping damage first and fixing the problem right.',
    sections: [
      {
        heading: 'When should you call an emergency plumber?',
        paragraphs: [
          'Call immediately for active flooding, sewage backing up into the home, a suspected gas line issue related to water heaters (evacuate and call 911 if you smell gas), completely lost water pressure with no known outage, or a water heater that is leaking heavily or spraying water.',
          'If you are unsure, describe the situation—we can help you decide whether it needs same-day emergency service or can wait for a scheduled visit.',
        ],
      },
      {
        heading: 'What we do on an emergency visit',
        paragraphs: [
          'We locate the source of the problem, shut off water where needed to protect your property, and explain repair or replacement options with a clear scope and written approval before major work begins when possible.',
          'Our team carries common parts for typical emergencies so many repairs can be completed in one visit.',
        ],
      },
      {
        heading: 'Service area',
        paragraphs: [
          'We serve New Orleans neighborhoods including the French Quarter, Garden District, Uptown, Mid-City, Bywater, Marigny, and the greater metro. If you are close by, ask—we often extend service to surrounding communities.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How fast can an emergency plumber arrive in New Orleans?',
        answer:
          'We aim to arrive within about two hours for true emergencies, depending on traffic and current call volume. Call us for the most accurate ETA.',
      },
      {
        question: 'Do you charge more for after-hours emergency plumbing?',
        answer:
          'Yes. Emergency and after-hours calls reflect immediate response and on-call availability. We discuss what to expect before you approve work whenever possible.',
      },
      {
        question: 'What should I do before the plumber arrives?',
        answer:
          'If safe to do so, turn off the main water shutoff to reduce flooding. Move valuables away from water. If there is electrical risk near standing water, avoid the area and wait for professionals.',
      },
    ],
  },
  {
    slug: 'drain-cleaning',
    title: 'Drain Cleaning & Sewer Service in New Orleans | MS & P LLC',
    description:
      'Clogged drains, slow sinks, or sewer backups? Professional drain cleaning and sewer line help in New Orleans. MS & P LLC—snaking, jetting, and honest diagnostics.',
    h1: 'Drain cleaning and sewer backups',
    intro:
      'Slow drains and recurring clogs usually mean something deeper in the line—grease buildup, roots, or a partial blockage in the main. We clear drains properly, explain what we find, and help you avoid repeat problems when possible.',
    sections: [
      {
        heading: 'Signs you need professional drain cleaning',
        paragraphs: [
          'Multiple fixtures draining slowly, gurgling toilets when you run the sink, sewage smell near floor drains, or water backing up in a tub or shower when the washing machine runs often point to a main line or branch line issue—not just a single P-trap clog.',
        ],
      },
      {
        heading: 'How we clear drains',
        paragraphs: [
          'We start with the right tool for the job: cable machines for tough clogs, and when appropriate, hydro jetting for grease and scale. We work to open the full diameter of the pipe, not just punch a small hole that reclogs in a week.',
          'If we see evidence of collapse, severe root intrusion, or repeated failures, we will recommend camera inspection or repair options so you are not paying for the same clog over and over.',
        ],
      },
      {
        heading: 'Preventing future clogs',
        paragraphs: [
          'Avoid pouring grease down the kitchen sink, use strainers in showers, and be cautious with “flushable” wipes—they are a common cause of sewer backups. We can suggest maintenance schedules for high-use homes or older New Orleans plumbing.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are chemical drain cleaners safe to use?',
        answer:
          'We generally do not recommend them. They can damage older pipes and rarely fix main line problems. Professional clearing is safer and more effective for stubborn or recurring clogs.',
      },
      {
        question: 'How do I know if the clog is in my house or the city sewer?',
        answer:
          'Symptoms and cleanout access help us tell. If multiple drains fail at once or sewage appears at the lowest fixture, it may be your building drain or the lateral. We diagnose on site.',
      },
      {
        question: 'Do you offer maintenance drain cleaning?',
        answer:
          'Yes. Homes with tree roots, older cast iron, or heavy kitchen use can benefit from scheduled cleaning. Ask us what interval makes sense for your system.',
      },
    ],
  },
  {
    slug: 'water-heater-service',
    title: 'Water Heater Repair & Installation in New Orleans | MS & P LLC',
    description:
      'No hot water, leaks, or time to replace your tank or tankless unit? Water heater repair and installation in New Orleans by MS & P LLC. Free estimates on many jobs.',
    h1: 'Water heater repair and installation',
    intro:
      'Whether your water heater is leaking, making noise, or simply past its useful life, we repair and replace tank and tankless units to match your home, budget, and efficiency goals. We size equipment correctly for New Orleans homes and explain code-compliant venting and connections.',
    sections: [
      {
        heading: 'Repair vs. replace',
        paragraphs: [
          'If your tank is young and the problem is a failed element, thermostat, or valve, repair often makes sense. If the tank is corroded, leaking from the shell, or over 10–15 years old with repeated issues, replacement is usually the better long-term value.',
        ],
      },
      {
        heading: 'Tankless and high-efficiency options',
        paragraphs: [
          'Tankless water heaters save space and can reduce standby energy use, but they require correct sizing and sometimes gas or electrical upgrades. We walk you through realistic capacity for your household and upfront vs. operating cost.',
        ],
      },
      {
        heading: 'Safety and code',
        paragraphs: [
          'We install temperature and pressure relief discharge correctly, secure strapping where required, and ensure gas connections and venting meet current standards—critical for your family’s safety and for insurance peace of mind.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is my water heater running out of hot water so fast?',
        answer:
          'Common causes include a failed lower element, sediment buildup reducing tank capacity, a broken dip tube, or a unit that is undersized for your household. We test and pinpoint the cause.',
      },
      {
        question: 'How long does water heater installation take?',
        answer:
          'Many tank swaps take a few hours same day if the new unit is in stock and connections match. Tankless or fuel-type changes may take longer for permits and upgrades.',
      },
      {
        question: 'Do you haul away the old water heater?',
        answer:
          'We can include disposal of the old unit as part of replacement jobs. Ask when you schedule.',
      },
    ],
  },
  {
    slug: 'leak-detection',
    title: 'Leak Detection in New Orleans | Slab & Hidden Leaks | MS & P LLC',
    description:
      'High water bill, warm spots on the floor, or mystery moisture? Leak detection for slab, wall, and hidden leaks in New Orleans. MS & P LLC.',
    h1: 'Leak detection and hidden leaks',
    intro:
      'Not every leak shows up as a drip under the sink. Slab leaks, wall leaks, and pinhole leaks in supply lines can waste thousands of gallons and damage framing and finishes. We combine systematic testing with the right equipment to find leaks with minimal unnecessary demolition.',
    sections: [
      {
        heading: 'Warning signs of a hidden leak',
        paragraphs: [
          'Unexplained increases on your water bill, the sound of running water when nothing is on, hot spots on concrete floors, buckling hardwood, or mildew smell in walls or cabinets should prompt a professional look.',
        ],
      },
      {
        heading: 'Our approach',
        paragraphs: [
          'We verify the leak is on your plumbing (not irrigation or municipal), isolate the branch or slab area, and use pressure testing, acoustic listening, and thermal patterns as appropriate. Once located, we discuss repair paths—direct repair, reroute, or repipe sections—so you can choose based on age of plumbing and budget.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does homeowners insurance cover slab leaks?',
        answer:
          'Coverage varies widely by policy and cause. We provide documentation of the leak and repair scope to help you work with your adjuster; we do not guarantee coverage.',
      },
      {
        question: 'Will you have to tear up my whole floor?',
        answer:
          'We target openings once the leak is localized. Goal is the smallest access that allows a solid, code-compliant repair.',
      },
    ],
  },
  {
    slug: 'fixture-installation',
    title: 'Plumbing Fixture Installation in New Orleans | MS & P LLC',
    description:
      'New faucets, toilets, sinks, showers, and garbage disposals installed right. Fixture installation for New Orleans homes by MS & P LLC—no leaks, proper venting.',
    h1: 'Fixture installation and upgrades',
    intro:
      'A beautiful fixture only performs well if supply lines, shutoffs, drains, and vents are correct. We install kitchen and bath fixtures to manufacturer specs and local code so you get reliable operation and a clean finish.',
    sections: [
      {
        heading: 'What we install',
        paragraphs: [
          'Kitchen and bathroom faucets, toilets (including chair-height and dual-flush models), sinks, shower valves and trim, tub fillers, garbage disposals, ice maker lines, and more. If you are remodeling, we coordinate rough-in and finish stages with your timeline.',
        ],
      },
      {
        heading: 'Why professional installation matters',
        paragraphs: [
          'Cross-threaded supplies, overtightened nuts, and improper sealants cause slow leaks inside cabinets and walls. We pressure-test connections, verify drain slopes and traps, and catch small issues before they become mold or floor damage.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I supply my own fixture?',
        answer:
          'Often yes. We may ask to review the model beforehand to confirm compatibility with your existing valves and drain layout.',
      },
      {
        question: 'Do you warranty fixture installs?',
        answer:
          'We warranty our labor per company policy; manufacturer warranties apply to the fixture itself. We will explain both before we start.',
      },
    ],
  },
  {
    slug: 'pipe-repair',
    title: 'Pipe Repair & Repiping in New Orleans | MS & P LLC',
    description:
      'Burst pipes, corrosion, low pressure, or whole-home repiping in New Orleans. MS & P LLC handles pipe repair, partial replacement, and repipes.',
    h1: 'Pipe repair and repiping',
    intro:
      'Old galvanized or corroded copper, pinhole leaks, and polybutylene or aging supply systems can mean repeated patch jobs. We repair isolated damage and, when it makes sense, repipe sections or the whole home for long-term reliability.',
    sections: [
      {
        heading: 'Repair or repipe?',
        paragraphs: [
          'A single burst in accessible piping is often a straightforward repair. Multiple leaks, poor water quality, visible corrosion, or outdated materials may justify repiping. We give honest recommendations and written scope so you can plan.',
        ],
      },
      {
        heading: 'Minimizing disruption',
        paragraphs: [
          'Repipes can often be staged so water is restored nightly. We protect floors and finishes, patch access points neatly, and pressure-test the new system before we leave.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What pipe materials do you use for repipes?',
        answer:
          'We typically use modern materials such as PEX or copper depending on local code, building type, and your preference. We explain pros and cons for your specific property.',
      },
      {
        question: 'How long does a whole-house repipe take?',
        answer:
          'Most residential repipes take several days depending on square footage, number of fixtures, and wall access. We provide a written scope and timeline before work begins.',
      },
    ],
  },
]

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug)
}

export function getAllServiceSlugs() {
  return services.map((s) => s.slug)
}
