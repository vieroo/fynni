'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProfileButton } from './profile-button'
import { navItems } from './nav-items'
import { User } from './types'

export function Navbar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-lg text-primary-foreground">
                💰
              </div>
              <span className="hidden sm:inline">Controle Financeiro</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className="gap-2 hover:cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <ProfileButton navItems={navItems} user={user} />
        </div>
      </div>
    </nav>
  )
}
