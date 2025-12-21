import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import AccountsDialog from './components/accounts-dialog'

export default function AccountsPage() {
  return (
    <div className="container mx-auto p-4 mt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias
          </p>
        </div>

        <AccountsDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Saldo Total</CardTitle>
          <CardDescription>Some de todas as contas</CardDescription>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(10000)}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
