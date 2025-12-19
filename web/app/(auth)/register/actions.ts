import { registerUser } from '@/htpp/auth/register-user'
import { HTTPError } from 'ky'
import { z } from 'zod'

const registerUserSchema = z
  .object({
    name: z
      .string({ error: 'Por favor, digite seu nome.' })
      .min(1, { error: 'Nome é obrigatório.' }),
    email: z
      .email({ error: 'Por favor, digite um endereço de e-mail válido.' })
      .min(1, { error: 'Enderecço de e-mail é obrigatório.' }),
    password: z
      .string({ error: 'Por favor, digite sua senha.' })
      .min(1, { error: 'Senha é obrigatória.' }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem.',
    path: ['confirm_password'],
  })

export async function registerAction(data: FormData) {
  const result = registerUserSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    // const errors = z.treeifyError(result.error)
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data

  try {
    await registerUser({ name, email, password })
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
