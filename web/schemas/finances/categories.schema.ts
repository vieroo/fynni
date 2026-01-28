import { z } from 'zod'

export const CATEGORY_TYPES = ['INCOME', 'EXPENSE', 'BOTH'] as const

export const categoryBaseSchema = z.object({
  name: z.string().min(1, { error: 'Nome é obrigatório' }),
  type: z.enum(CATEGORY_TYPES, { error: 'Tipo é inválido' }),
  icon: z.string().optional(),
  color: z.string().optional(),
  userId: z.uuid().nullable(),
})

export const categoriesSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(CATEGORY_TYPES),
  icon: z.string().optional(),
  color: z.string().optional(),
  userId: z.uuid().optional(),
})

export const updateCategorySchema = categoryBaseSchema.partial().extend({
  id: z.uuid({ error: 'ID é inválido' }),
})

export const categorySchema = categoryBaseSchema.extend({
  id: z.uuid(),
})

export const createCategorySchema = categoryBaseSchema

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type Category = z.infer<typeof categorySchema>
