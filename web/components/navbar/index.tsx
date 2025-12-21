'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProfileButton } from './profile-button'
import { navItems } from './nav-items'
import { User } from './types'
import { ThemeToggle } from '../theme-toggle'

export function Navbar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <nav className="shadow-md">
      <div className="container mx-auto px-4">
        <div className="relative flex h-12 items-center">
          <Link href="/" className="flex items-center font-semibold">
            <span className="hidden font-extrabold text-xl text-primary font-mono sm:inline">
              Fynni
            </span>
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
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
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`}
                    />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex gap-2">
            <ProfileButton navItems={navItems} user={user} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
