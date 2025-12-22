import { z } from 'zod'

export const ACCOUNT_TYPES = [
  'CHECKING',
  'SAVINGS',
  'WALLET',
  'INVESTMENT',
] as const

export const accountBaseSchema = z.object({
  name: z.string().min(1, { error: 'Nome é obrigatório' }),
  type: z.enum(ACCOUNT_TYPES, { error: 'Tipo é inválido' }),
  balance: z.coerce.number().default(0),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
})

export const accountsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(ACCOUNT_TYPES),
  balance: z.number(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
})

export const updateAccountSchema = accountBaseSchema.partial().extend({
  id: z.uuid({ error: 'ID é inválido' }),
})

export const accountSchema = accountBaseSchema.extend({
  id: z.uuid(),
  balance: z.number(),
})

export const createAccountSchema = accountBaseSchema

export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type Account = z.infer<typeof accountSchema>
