import { getProfile } from '@/htpp/auth/get-profile'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return !!token
}

export async function auth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }

  redirect('/api/logout')
}
