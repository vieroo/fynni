import { Card, CardContent } from '@/components/ui/card'
import { categoryIconMap } from '@/lib/category.icons'
import { Tag } from 'lucide-react'

export default function CategoryCard({ category }: { category: any }) {
  const Icon =
    category.icon && categoryIconMap[category.icon]
      ? categoryIconMap[category.icon]
      : Tag

  return (
    <Card className="hover:bg-muted/40 transition-colors">
      <CardContent className="flex items-center gap-3 p-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0"
          style={{
            backgroundColor: category.color ?? 'hsl(var(--muted-foreground))',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="leading-tight">
          <p className="font-medium">{category.name}</p>
        </div>
      </CardContent>
    </Card>
  )
}
