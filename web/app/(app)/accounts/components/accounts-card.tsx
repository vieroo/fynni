import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getAccountTypeLabel } from '@/lib/utils'
import { Account } from '@/schemas/finances/accounts.schema'
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
            <div className="flex items-center gap-3">
              {account.imageUrl ? (
                <img
                  src={account.imageUrl}
                  alt={account.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: account.color ?? '#64748b' }}
                >
                  {account.name
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()}
                </div>
              )}

              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <AccountsDialog mode="edit" account={account} />
              <DeleteAccountDialog accountId={account.id} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(account.balance)}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {getAccountTypeLabel(account.type)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
