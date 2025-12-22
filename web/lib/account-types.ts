export const accountTypes = [
  { value: 'CHECKING', label: 'Conta Corrente' },
  { value: 'SAVINGS', label: 'Poupança' },
  { value: 'WALLET', label: 'Carteira' },
  { value: 'INVESTMENT', label: 'Investimentos' },
] as const

export type AccountType = (typeof accountTypes)[number]['value']
