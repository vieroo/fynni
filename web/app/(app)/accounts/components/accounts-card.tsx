import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getAccountTypeLabel } from '@/lib/utils'
import { Account } from '@/schemas/finances/accounts.schema'
import { Wallet } from 'lucide-react'
import AccountsDialog from './accounts-dialog'
import { DeleteAccountDialog } from './delete-dialog'

type AccountsCardsProps = {
  accounts: Account[]
}

export function AccountsCards({ accounts }: AccountsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card key={account.id} className="relative overflow-hidden">
          <span
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundColor: account.color ?? '#e5e7eb' }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: account.color ?? '#e5e7eb' }}
              />
              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
            </div>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(account.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getAccountTypeLabel(account.type)}
            </p>
            <div className="flex gap-2 mt-4">
              <AccountsDialog mode="edit" account={account} />
              <DeleteAccountDialog accountId={account.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
