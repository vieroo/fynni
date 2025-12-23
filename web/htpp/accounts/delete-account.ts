import { UpdateAccountInput } from '@/schemas/finances/accounts.schema'
import { api } from '../http-client'

interface deleteAccountResponse {
  message: string
}

export async function deleteAccount(id: string) {
  const result = await api
    .delete(`accounts/${id}`)
    .json<deleteAccountResponse>()

  return result.message
}
