import { getCategories } from '@/htpp/categories/get-categories'
import CategoryCard from './components/category-card'
import CategorySection from './components/category-section'

export const metadata = {
  title: 'Fynni - Categorias',
  description: 'Gerencie as categorias das transações',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const expenses = categories.filter((c) => c.type === 'EXPENSE')
  const incomes = categories.filter((c) => c.type === 'INCOME')
  const both = categories.filter((c) => c.type === 'BOTH')

  return (
    <div className="container mx-auto p-4 mt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie suas categorias de receitas e despesas.
          </p>
        </div>

        {/* <AccountsDialog /> */}
      </div>

      <CategorySection title="Despesas" categories={expenses} />
      <CategorySection title="Receitas" categories={incomes} />
      <CategorySection title="Ambos" categories={both} />
      {/* <AccountsCards accounts={accounts} /> */}
    </div>
  )
}
