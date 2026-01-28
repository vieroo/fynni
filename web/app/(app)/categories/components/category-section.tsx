import CategoryCard from './category-card'

export default function CategorySection({
  title,
  categories,
}: {
  title: string
  categories: any[]
}) {
  if (!categories.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
