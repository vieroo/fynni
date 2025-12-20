import { auth, isAuthenticated } from '@/auth/auth'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isAuth = await isAuthenticated()

  if (!isAuth) {
    redirect('/login')
  }

  const { user } = await auth()

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  )
}
