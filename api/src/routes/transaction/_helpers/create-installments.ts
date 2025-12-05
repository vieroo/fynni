import { prisma } from '@/lib/prisma'
import { addMonths } from './add-months'
import { TransactionType } from '@/generated/prisma/enums'

export async function createInstallments(
  amount: number,
  installments: number,
  description: string | null,
  userId: string,
  type: TransactionType,
  date: Date,
  categoryId: string | null,
  accountId: string | null,
  creditCardId: string,
) {
  const group = await prisma.installmentGroup.create({
    data: {
      totalAmount: amount,
      totalInstallments: installments,
      description: description ?? null,
    },
  })

  const installmentAmount = Number((amount / installments).toFixed(2))

  const parcels = Array.from({ length: installments }).map((_, i) => ({
    userId,
    type,
    amount: installmentAmount,
    date: addMonths(date, i),
    description: `${description ?? ''} (Parcela ${i + 1}/${installments})`,
    categoryId,
    accountId,
    creditCardId,
    installmentGroupId: group.id,
  }))

  await prisma.transaction.createMany({ data: parcels })
}
