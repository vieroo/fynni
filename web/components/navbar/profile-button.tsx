import { ChevronDown, LogOut, UserPen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import Link from 'next/link'
import { NavItems, User } from './types'
import {} from './types'

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function ProfileButton({
  user,
  navItems,
}: {
  user: User
  navItems: NavItems
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:cursor-pointer">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="hover:cursor-pointer">
          <Link href="/profile">
            <UserPen className="mr-2 size-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <div className="md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem
                key={item.href}
                asChild
                className='hover:cursor-pointer"'
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
        </div>
        <DropdownMenuItem asChild className="hover:cursor-pointer">
          <a href="/api/logout">
            <LogOut className="mr-2 size-4" />
            Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
