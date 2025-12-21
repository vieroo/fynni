import { z } from 'zod'

export const ACCOUNT_TYPES = [
  'CHECKING',
  'SAVINGS',
  'WALLET',
  'INVESTMENT',
] as const

export const accountsSchema = z.object({
  name: z.string(),
  type: z.enum(ACCOUNT_TYPES),
  balance: z.number(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
})

export type AccountFormData = z.infer<typeof accountsSchema>
