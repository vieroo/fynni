import { Category } from '@/schemas/finances/categories.schema'
import { api } from '../http-client'

type GetCategoriesResponse = {
  categories: Category[]
}

export async function getCategories() {
  const result = await api.get('categories').json<GetCategoriesResponse>()

  return result.categories
}
