import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AccountType, accountTypes } from './account-types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const accountTypeLabelMap: Record<AccountType, string> = Object.fromEntries(
  accountTypes.map(({ value, label }) => [value, label])
) as Record<AccountType, string>

export function getAccountTypeLabel(type: AccountType): string {
  return accountTypeLabelMap[type]
}
