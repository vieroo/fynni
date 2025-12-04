import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function getTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'List all user transactions.',
          response: {
            200: z.object({
              transactions: z.array(
                z.object({
                  date: z.date(),
                  description: z.string().nullable(),
                  id: z.string(),
                  userId: z.string(),
                  createdAt: z.date(),
                  accountId: z.string().nullable(),
                  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
                  amount: z.number(),
                  categoryId: z.string().nullable(),
                  creditCardId: z.string(),
                  fromAccountId: z.string().nullable(),
                  toAccountId: z.string().nullable(),
                  isInstallment: z.boolean(),
                  installmentGroupId: z.string().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const transactions = await prisma.transaction.findMany({
          where: { userId },
        })

        return reply.status(200).send({ transactions })
      },
    )
}
