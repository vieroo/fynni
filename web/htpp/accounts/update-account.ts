import { UpdateAccountInput } from '@/schemas/finances/accounts.schema'
import { api } from '../http-client'

interface updateAccountResponse {
  message: string
}

export async function updateAccount({
  id,
  name,
  type,
  balance,
  color,
  imageUrl,
}: UpdateAccountInput) {
  const result = await api
    .put(`accounts/${id}`, {
      json: {
        name,
        type,
        balance,
        color,
        imageUrl,
      },
    })
    .json<updateAccountResponse>()

  return result
}
