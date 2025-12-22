import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import AccountsDialog from './components/accounts-dialog'
import { getAccounts } from '@/htpp/accounts/get-accounts'
import { AccountsCards } from './components/accounts-card'

export default async function AccountsPage() {
  const accounts = await getAccounts()

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="container mx-auto p-4 mt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contas Bancárias
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias
          </p>
        </div>

        <AccountsDialog />
      </div>
      <Card className="relative border overflow-hidden">
        <span
          className={`absolute left-0 top-0 h-full w-1 ${
            totalBalance >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <CardHeader>
          <CardTitle>Saldo Total</CardTitle>
          <CardDescription>Soma de todas as contas</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(totalBalance)}
          </div>
        </CardContent>
      </Card>
      <AccountsCards accounts={accounts} />
    </div>
  )
}
