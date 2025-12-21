import { AccountFormData } from '@/schemas/finances/accounts.schema'
import { api } from '../http-client'

export async function createAccount({
  name,
  type,
  balance,
  color,
  imageUrl,
}: AccountFormData) {
  const result = await api
    .post('accounts', {
      json: {
        name,
        type,
        balance,
        color,
        imageUrl,
      },
    })
    .json()

  return result
}
