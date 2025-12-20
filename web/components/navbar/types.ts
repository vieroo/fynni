import { z } from 'zod'
import { LucideIcon } from 'lucide-react'

export type User = {
  name: string | null
  email: string
  avatarUrl?: string | null
}

export const navItemSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  icon: z.custom<LucideIcon>(),
})

export type NavItem = z.infer<typeof navItemSchema>
export type NavItems = NavItem[]
