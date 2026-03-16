type StructuredDataProps = {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = JSON.stringify(data)

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  )
}

