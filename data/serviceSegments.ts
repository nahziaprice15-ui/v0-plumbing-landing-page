/** Lucide icon names used by ServicesHub (mapped in component). */
export type OfferingIconKey =
  | 'home'
  | 'building2'
  | 'zap'
  | 'droplets'
  | 'thermometer'
  | 'wrench'
  | 'shield'
  | 'wind'
  | 'flame'
  | 'gauge'
  | 'users'
  | 'utensils'
  | 'network'
  | 'alertCircle'

/** Matches slugs in data/services.ts */
export type ServiceDetailSlug =
  | 'emergency-plumbing'
  | 'drain-cleaning'
  | 'water-heater-service'
  | 'leak-detection'
  | 'fixture-installation'
  | 'pipe-repair'

export type SegmentId = 'residential' | 'commercial' | 'emergency'

export type SegmentOffering = {
  title: string
  summary: string
  bullets?: string[]
  detailSlug?: ServiceDetailSlug
  iconKey: OfferingIconKey
}

export type SegmentPricingRow = {
  label: string
  display: string
  note?: string
}

export type ServiceSegment = {
  id: SegmentId
  tabLabel: string
  headline: string
  subhead: string
  intro: string
  offerings: SegmentOffering[]
  pricing: SegmentPricingRow[]
  pricingDisclaimer: string
}

export const serviceSegments: ServiceSegment[] = [
  {
    id: 'residential',
    tabLabel: 'Residential',
    headline: 'Home plumbing in New Orleans',
    subhead: 'Repairs, installs, and maintenance sized for houses, condos, and duplexes.',
    intro:
      'From everyday fixes to full upgrades, we keep your home’s water and drains reliable. Call for same-week scheduling or book online—licensed, insured, and upfront about scope.',
    offerings: [
      {
        iconKey: 'droplets',
        title: 'Drain & sewer cleaning',
        summary: 'Clear tough clogs, main lines, and recurring backups without guesswork.',
        bullets: ['Kitchen & bath drains', 'Main line clearing', 'Camera when needed'],
        detailSlug: 'drain-cleaning',
      },
      {
        iconKey: 'thermometer',
        title: 'Water heaters',
        summary: 'Repair or replace tank and tankless units with correct sizing and safe venting.',
        bullets: ['Repairs', 'New installs', 'Flush & tune-ups'],
        detailSlug: 'water-heater-service',
      },
      {
        iconKey: 'wind',
        title: 'Leak detection',
        summary: 'Find hidden slab and wall leaks before they wreck floors and cabinets.',
        bullets: ['High bills', 'Warm spots', 'Mystery moisture'],
        detailSlug: 'leak-detection',
      },
      {
        iconKey: 'wrench',
        title: 'Fixtures & upgrades',
        summary: 'Faucets, toilets, disposals, and remodel finishes installed to code.',
        bullets: ['Kitchen & bath', 'Disposals & ice lines'],
        detailSlug: 'fixture-installation',
      },
      {
        iconKey: 'shield',
        title: 'Pipe repair & repipes',
        summary: 'Targeted repairs or full repipes when old lines keep failing.',
        bullets: ['Burst pipes', 'Corrosion', 'PEX / copper options'],
        detailSlug: 'pipe-repair',
      },
      {
        iconKey: 'home',
        title: 'Preventive checks',
        summary: 'Whole-home lookover for older NOLA properties—shutoffs, hoses, and pressure.',
        bullets: ['Pre-purchase / seasonal', 'Shutoff labeling'],
      },
    ],
    pricing: [
      { label: 'Service call & diagnosis', display: 'Starting at $89', note: 'Waived toward approved same-day repair in many cases—ask when you call.' },
      { label: 'Standard labor window', display: '$125–$195 / hr', note: 'Most residential repairs quoted as a flat range after we see the job.' },
      { label: 'Drain opening (typical branch)', display: 'From $195', note: 'Main line or jetting may differ; we confirm before work.' },
      { label: 'Water heater swap (like-for-like)', display: 'From $1,850', note: 'Includes standard tank, labor, and disposal; upgrades quoted on site.' },
    ],
    pricingDisclaimer:
      'Prices are examples for planning only. Final pricing follows on-site diagnosis and your written approval before we start major work.',
  },
  {
    id: 'commercial',
    tabLabel: 'Commercial',
    headline: 'Commercial plumbing & light industrial',
    subhead: 'Restaurants, retail, offices, and multi-unit properties—minimal downtime, clear bids.',
    intro:
      'We coordinate around your hours of operation, prioritize code compliance, and document scope for managers and owners. Request a walk-through for recurring issues or tenant turnover.',
    offerings: [
      {
        iconKey: 'utensils',
        title: 'Grease interceptors & kitchen lines',
        summary: 'Heavy-use kitchen drains, hydro jetting, and scheduled line maintenance.',
        bullets: ['After-hours jetting', 'Interceptor pumping coordination'],
        detailSlug: 'drain-cleaning',
      },
      {
        iconKey: 'users',
        title: 'Multi-fixture & restroom banks',
        summary: 'High-traffic restrooms, flush valves, and domestic lines that keep staff and customers moving.',
        bullets: ['Valve rebuilds', 'Cartridge programs'],
        detailSlug: 'fixture-installation',
      },
      {
        iconKey: 'building2',
        title: 'Tenant improvements',
        summary: 'Rough-in and finish for sinks, break rooms, and bar areas per plan and inspection.',
        bullets: ['Permit-ready installs', 'GC coordination'],
        detailSlug: 'fixture-installation',
      },
      {
        iconKey: 'gauge',
        title: 'Backflow & domestic boosters',
        summary: 'Testing coordination, repairs, and replacements with your compliance calendar in mind.',
        bullets: ['Annual test reminders', 'Priority scheduling'],
      },
      {
        iconKey: 'network',
        title: 'Building water distribution',
        summary: 'Repairs and sectional repipes for aging risers, corroded galvanized, and poly issues.',
        bullets: ['Sectional repipe', 'Pressure diagnostics'],
        detailSlug: 'pipe-repair',
      },
      {
        iconKey: 'thermometer',
        title: 'Commercial water heating',
        summary: 'Higher-capacity tanks, rack systems, and recirculation troubleshooting.',
        detailSlug: 'water-heater-service',
      },
    ],
    pricing: [
      { label: 'Commercial service call', display: 'From $125', note: 'Covers trip and assessment; proposal provided for larger scopes.' },
      { label: 'Labor (business hours)', display: '$145–$225 / hr', note: 'Two-tech jobs and confined-space work quoted in advance.' },
      { label: 'Preventive maintenance agreement', display: 'Custom quote', note: 'Quarterly or monthly jetting, fixture sweeps, and priority response.' },
      { label: 'After-hours / weekend commercial', display: '1.5× standard', note: 'We confirm rates before dispatch.' },
    ],
    pricingDisclaimer:
      'Commercial work is quoted from walk-through or plans. Net-30 may be available for established accounts—ask our office.',
  },
  {
    id: 'emergency',
    tabLabel: 'Emergencies',
    headline: '24/7 emergency plumbing',
    subhead: 'Active leaks, backups, and no-water situations—call now for fastest dispatch.',
    intro:
      'When water is moving the wrong direction or not at all, we prioritize stopping damage, then permanent repair. Keep our number handy for nights, weekends, and holidays.',
    offerings: [
      {
        iconKey: 'zap',
        title: 'Burst & leaking pipes',
        summary: 'Shut down the leak fast, dry-in safely, and repair or replace the failed section.',
        bullets: ['Slab & wall bursts', 'Supply line failures'],
        detailSlug: 'emergency-plumbing',
      },
      {
        iconKey: 'droplets',
        title: 'Sewer backup & overflows',
        summary: 'Clear blockages and advise on next steps if the line needs camera or repair.',
        bullets: ['Toilet / tub overflow', 'Floor drain sewage'],
        detailSlug: 'drain-cleaning',
      },
      {
        iconKey: 'flame',
        title: 'Water heater emergencies',
        summary: 'Tank failures, T&P discharge, and gas water heater safety concerns.',
        detailSlug: 'water-heater-service',
      },
      {
        iconKey: 'wind',
        title: 'Hidden leak escalation',
        summary: 'When you suspect a major leak but cannot find it—we trace and isolate under pressure.',
        detailSlug: 'leak-detection',
      },
      {
        iconKey: 'alertCircle',
        title: 'No water / pressure collapse',
        summary: 'Diagnose PRV, PRV failures, and building isolation valves.',
        detailSlug: 'pipe-repair',
      },
    ],
    pricing: [
      { label: 'Emergency response fee', display: 'From $195', note: 'Covers after-hours dispatch and first hour of assessment—varies by time and distance.' },
      { label: 'Emergency labor', display: '$195–$275 / hr', note: 'Nights, weekends, and holidays at premium; we quote expectations on the phone.' },
      { label: 'Materials & parts', display: 'Pass-through + 15%', note: 'Or use your approved PO process for institutional clients.' },
      { label: 'True property-threatening flood', display: 'Priority queue', note: 'Tell the dispatcher if standing water is spreading—we triage life-safety and damage first.' },
    ],
    pricingDisclaimer:
      'Emergency pricing reflects immediate response and on-call staffing. We communicate rates before you commit whenever safety allows.',
  },
]

export function isSegmentId(value: string | null): value is SegmentId {
  return value === 'residential' || value === 'commercial' || value === 'emergency'
}
