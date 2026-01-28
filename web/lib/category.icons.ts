import {
  Utensils,
  Soup,
  ShoppingCart,
  Home,
  Building2,
  Droplet,
  Zap,
  Wifi,
  Pill,
  HeartPulse,
  Bus,
  Fuel,
  Car,
  Tv,
  Gamepad2,
  CreditCard,
  Banknote,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  RefreshCcw,
  Repeat,
  Sliders,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export const categoryIconMap: Record<string, LucideIcon> = {
  // Despesas
  utensils: Utensils,
  restaurant: Soup,
  'shopping-cart': ShoppingCart,

  home: Home,
  building: Building2,
  droplet: Droplet,
  zap: Zap,
  wifi: Wifi,

  pill: Pill,
  'heart-pulse': HeartPulse,

  bus: Bus,
  fuel: Fuel,
  car: Car,

  tv: Tv,
  'gamepad-2': Gamepad2,

  'credit-card': CreditCard,
  banknote: Banknote,

  'more-horizontal': MoreHorizontal,

  // Receitas
  briefcase: Briefcase,
  laptop: Laptop,
  'trending-up': TrendingUp,
  'refresh-ccw': RefreshCcw,

  // Ambos
  repeat: Repeat,
  sliders: Sliders,
}
