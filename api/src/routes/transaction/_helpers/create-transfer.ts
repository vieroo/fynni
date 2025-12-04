import { prisma } from '@/lib/prisma'

export async function createTransfer(
  userId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  date: Date,
  description: string | null,
) {
  const fromId = fromAccountId!
  const toId = toAccountId!

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId,
        type: 'EXPENSE',
        amount,
        date,
        description,
        accountId: fromId,
        categoryId: null,
        creditCardId: null,
        fromAccountId: fromId,
        toAccountId: toId,
      },
    }),

    prisma.transaction.create({
      data: {
        userId,
        type: 'INCOME',
        amount,
        date,
        description,
        accountId: toId,
        categoryId: null,
        creditCardId: null,
        fromAccountId: fromId,
        toAccountId: toId,
      },
    }),

    prisma.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    }),

    prisma.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    }),
  ])
}
