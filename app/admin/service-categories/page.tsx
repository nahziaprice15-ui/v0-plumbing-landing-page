const CATEGORIES = [
  {
    slug: 'emergency',
    name: 'Emergency Plumbing',
    description: 'Burst pipes, major leaks, flooding, and other urgent situations.',
  },
  {
    slug: 'drain',
    name: 'Drain Cleaning',
    description: 'Slow drains, clogs, and sewer line clearing.',
  },
  {
    slug: 'water-heater',
    name: 'Water Heater Service',
    description: 'Water heater repairs, replacements, and tune-ups.',
  },
  {
    slug: 'leak',
    name: 'Leak Detection & Repair',
    description: 'Identifying and repairing hidden leaks throughout the property.',
  },
  {
    slug: 'installation',
    name: 'Fixture / Installation',
    description: 'Faucets, toilets, sinks, garbage disposals, and more.',
  },
  {
    slug: 'other',
    name: 'Other',
    description: 'General plumbing work not covered by the above categories.',
  },
]

export default function ServiceCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-amber-50 border-amber-200 px-5 py-4 text-sm text-amber-800">
        Service categories are managed via code — contact your developer to add or remove categories.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.slug} className="rounded-xl border bg-white p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-[#0b3a62]">{cat.name}</h3>
              <span className="rounded-full bg-[#eef2f8] px-2 py-0.5 text-xs font-mono text-muted-foreground">
                {cat.slug}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
