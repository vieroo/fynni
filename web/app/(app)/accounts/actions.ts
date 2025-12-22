'use server'

import { createAccount } from '@/htpp/accounts/create-account'
import { updateAccount } from '@/htpp/accounts/update-account'
import {
  createAccountSchema,
  updateAccountSchema,
} from '@/schemas/finances/accounts.schema'
import { HTTPError } from 'ky'
import { revalidatePath } from 'next/cache'

export async function createAccountAction(_: unknown, data: FormData) {
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

    revalidatePath('/accounts')
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

export async function updateAccountAction(_: unknown, data: FormData) {
  const result = updateAccountSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  try {
    const response = await updateAccount(result.data)

    revalidatePath('/accounts')
    return {
      success: true,
      message: response.message || 'Conta atualizada com sucesso.',
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
