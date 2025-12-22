import { Account } from '@/schemas/finances/accounts.schema'
import { api } from '../http-client'

type GetAccountsResponse = {
  accounts: Account[]
}

export async function getAccounts() {
  const result = await api.get('accounts').json<GetAccountsResponse>()

  return result.accounts
}
