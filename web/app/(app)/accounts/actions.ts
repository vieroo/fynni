'use server'

import { createAccount } from '@/htpp/accounts/create-account'
import { ACCOUNT_TYPES } from '@/schemas/finances/accounts.schema'
import { HTTPError } from 'ky'
import z from 'zod'

const createAccountSchema = z.object({
  name: z.string().min(1, { error: 'Nome é obrigatório' }),
  type: z.enum(ACCOUNT_TYPES, { error: 'Tipo é inválido' }),
  balance: z.coerce.number().default(0),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
})

export async function createAccountAction(_: unknown, data: FormData) {
  console.log('ACTION CHAMADA')
  console.log(data)
  const result = createAccountSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  try {
    await createAccount(result.data)

    return {
      success: true,
      message: 'Conta criada com sucesso.',
      errors: null,
    }
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
}
