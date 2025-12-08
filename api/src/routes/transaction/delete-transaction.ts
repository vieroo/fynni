import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function deleteTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/transactions/:id',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Delete transaction.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            204: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const transaction = await prisma.transaction.findFirst({
          where: { userId, id },
        })

        if (!transaction) {
          throw new BadRequestError('Transação não encontrada.')
        }

        // -----------------------------
        // CASO: TRANSFERÊNCIA (2 transações)
        // -----------------------------
        if (transaction.type === 'TRANSFER') {
          const { fromAccountId, toAccountId, amount } = transaction

          if (!fromAccountId || !toAccountId) {
            throw new BadRequestError('Transferência inválida. IDs ausentes.')
          }

          // Buscar transações irmãs
          const pair = await prisma.transaction.findMany({
            where: {
              userId,
              fromAccountId,
              toAccountId,
              date: transaction.date,
              amount,
            },
          })

          await prisma.$transaction([
            // Deletar todas as transações da transferência
            prisma.transaction.deleteMany({
              where: {
                id: { in: pair.map((t) => t.id) },
              },
            }),

            // Reverter o saldo
            prisma.account.update({
              where: { id: fromAccountId },
              data: { balance: { increment: amount } },
            }),

            prisma.account.update({
              where: { id: toAccountId },
              data: { balance: { decrement: amount } },
            }),
          ])

          return reply.status(204).send({
            message: 'Transferência removida com sucesso.',
          })
        }

        // ------------------------------------------
        // CASO: TRANSAÇÃO PARCELADA (INSTALLMENT GROUP)
        // ------------------------------------------
        if (transaction.installmentGroupId) {
          const groupId = transaction.installmentGroupId

          // Buscar todas as parcelas
          const installments = await prisma.transaction.findMany({
            where: {
              installmentGroupId: groupId,
              userId,
            },
          })

          await prisma.$transaction([
            // Deletar todas as parcelas
            prisma.transaction.deleteMany({
              where: { installmentGroupId: groupId },
            }),

            // Deletar o grupo
            prisma.installmentGroup.delete({
              where: { id: groupId },
            }),
          ])

          return reply.status(204).send({
            message: 'Parcelamento removido com sucesso.',
          })
        }

        // ------------------------------------------
        // CASO: TRANSAÇÃO NORMAL
        // ------------------------------------------
        await prisma.$transaction(async (tx) => {
          // Se transação normal tiver conta, reverte saldo
          if (transaction.accountId) {
            if (transaction.type === 'INCOME') {
              await tx.account.update({
                where: { id: transaction.accountId },
                data: { balance: { decrement: transaction.amount } },
              })
            }

            if (transaction.type === 'EXPENSE') {
              await tx.account.update({
                where: { id: transaction.accountId },
                data: { balance: { increment: transaction.amount } },
              })
            }
          }

          // Deleta a transação
          await tx.transaction.delete({
            where: { id },
          })
        })

        return reply
          .status(204)
          .send({ message: 'Transação deletada com sucesso.' })
      },
    )
}
