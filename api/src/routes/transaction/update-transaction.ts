import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function updateTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/transactions/:id',
      {
        schema: {
          tags: ['Transactions'],
          summary:
            'Update a normal (non-transfer, non-installment) transaction.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.uuid(),
          }),
          body: z.object({
            amount: z.number().optional(),
            date: z.date().optional(),
            description: z.string().nullable().optional(),
            categoryId: z.string().nullable().optional(),
            accountId: z.string().nullable().optional(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { id } = request.params
        const { amount, date, description, categoryId, accountId } =
          request.body

        const original = await prisma.transaction.findFirst({
          where: { id, userId },
        })

        if (!original) throw new BadRequestError('Transação não encontrada.')

        if (original.type === 'TRANSFER')
          throw new BadRequestError(
            'Use delete + create para atualizar transferências.',
          )

        if (original.installmentGroupId)
          throw new BadRequestError(
            'Transações de parcelamento não podem ser atualizadas individualmente.',
          )

        // --------------------
        // Ajustar saldo
        // --------------------
        const updates: any = {}

        if (amount !== undefined || accountId !== undefined) {
          const newAmount = amount ?? original.amount
          const newAccount = accountId ?? original.accountId

          // Se mudou a conta ↓
          if (newAccount !== original.accountId) {
            // remover saldo da conta antiga
            if (original.accountId) {
              await prisma.account.update({
                where: { id: original.accountId },
                data: {
                  balance:
                    original.type === 'INCOME'
                      ? { decrement: original.amount }
                      : { increment: original.amount },
                },
              })
            }

            // adicionar saldo na nova conta
            if (newAccount) {
              await prisma.account.update({
                where: { id: newAccount },
                data: {
                  balance:
                    original.type === 'INCOME'
                      ? { increment: newAmount }
                      : { decrement: newAmount },
                },
              })
            }
          } else if (newAmount !== original.amount) {
            // Se só mudou o valor ↓
            const diff = newAmount - original.amount

            if (original.accountId) {
              await prisma.account.update({
                where: { id: original.accountId },
                data: {
                  balance:
                    original.type === 'INCOME'
                      ? { increment: diff }
                      : { decrement: diff },
                },
              })
            }
          }

          updates.amount = newAmount
          updates.accountId = newAccount
        }

        if (description !== undefined) updates.description = description
        if (categoryId !== undefined) updates.categoryId = categoryId
        if (date !== undefined) updates.date = date

        await prisma.transaction.update({
          where: { id },
          data: updates,
        })

        return reply.send({ message: 'Transação atualizada com sucesso.' })
      },
    )
}
