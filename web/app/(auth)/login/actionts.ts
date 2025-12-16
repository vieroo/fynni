'use server'

import { loginWithPassword } from '@/htpp/auth/login-with-password'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { success, z } from 'zod'

const loginSchema = z.object({
  email: z.email({ error: 'Por favor, digite um endereço de e-mail válido.' }),
  password: z.string({ error: 'Por favor, digite sua senha.' }),
})

export async function loginAction(data: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    // const errors = z.treeifyError(result.error)
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await loginWithPassword({ email, password })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message:
        'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
