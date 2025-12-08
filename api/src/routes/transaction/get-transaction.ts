import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function listTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transactions/:id',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get transaction by ID.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            200: z.object({
              transaction: z.object({
                date: z.date(),
                description: z.string().nullable(),
                id: z.string(),
                userId: z.string(),
                createdAt: z.date(),
                accountId: z.string().nullable(),
                type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
                amount: z.number(),
                categoryId: z.string().nullable(),
                creditCardId: z.string().nullable(),
                fromAccountId: z.string().nullable(),
                toAccountId: z.string().nullable(),
                isInstallment: z.boolean(),
                installmentGroupId: z.string().nullable(),
              }),
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

        return reply.status(200).send({ transaction })
      },
    )
}
