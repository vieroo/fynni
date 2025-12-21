import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

// Tipos só para ajudar (opcional)
type Account = {
  id: string
  name: string
  balance: number
}

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

type MonthStats = {
  income: number
  expenses: number
  balance: number
  transactionCount: number
}

export default function Home() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Conta Corrente',
      balance: 3500.75,
    },
    {
      id: '2',
      name: 'Poupança',
      balance: 8200.0,
    },
  ]

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      description: 'Salário',
      date: '2025-01-05',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      description: 'Aluguel',
      date: '2025-01-06',
    },
    {
      id: '3',
      type: 'expense',
      amount: 350,
      description: 'Mercado',
      date: '2025-01-08',
    },
    {
      id: '4',
      type: 'income',
      amount: 800,
      description: 'Freelance',
      date: '2025-01-10',
    },
  ]

  const monthStats: MonthStats = {
    income: 5800,
    expenses: 1550,
    balance: 4250,
    transactionCount: transactions.length,
  }

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  )

  return (
    <div className="container mx-auto px-4 mt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.length} contas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receitas (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthStats.income)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === 'income').length}{' '}
              transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas (Mês)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(monthStats.expenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === 'expense').length}{' '}
              transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                monthStats.balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}
            >
              {formatCurrency(monthStats.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthStats.transactionCount} movimentações
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
