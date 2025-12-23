import { Home, Wallet, CreditCard, Tags, TrendingUp } from 'lucide-react'

import { NavItems } from './types'

export const navItems: NavItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/transactions', label: 'Transações', icon: TrendingUp },
  { href: '/accounts', label: 'Contas Bancárias', icon: Wallet },
  { href: '/cards', label: 'Cartões', icon: CreditCard },
  { href: '/categories', label: 'Categorias', icon: Tags },
]
