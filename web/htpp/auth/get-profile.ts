import { api } from '@/htpp/http-client'
import { cookies } from 'next/headers'

interface GetProfileResponse {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getProfile() {
  try {
    if (typeof window === 'undefined') {
      const token = (await cookies()).get('token')?.value

      const res = await fetch('http://localhost:3333/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to fetch profile: ${res.status} ${err}`)
      }

      const result = (await res.json()) as GetProfileResponse

      return result
    }

    const result = await api.get('profile').json<GetProfileResponse>()

    return result
  } catch (error) {
    throw error
  }
}
