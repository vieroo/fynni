import { CreateAccountInput } from '@/schemas/finances/accounts.schema'
import { api } from '../http-client'

export async function createAccount({
  name,
  type,
  balance,
  color,
  imageUrl,
}: CreateAccountInput) {
  console.log(imageUrl)

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
