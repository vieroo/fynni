import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'
import { getBillingPeriod } from './_helpers/get-billing-period'

export async function getBillingCycleForecast(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/credit-cards/:id/billing-cycle/forecast',
      {
        schema: {
          tags: ['Billing-cycle'],
          summary: 'Get credit card billing cycle forecast.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            200: z.object({
              months: z.array(
                z.object({
                  month: z.number(),
                  year: z.number(),
                  start: z.date(),
                  end: z.date(),
                  total: z.number(),
                  transactions: z.array(
                    z.object({
                      date: z.date(),
                      description: z.string().nullable(),
                      id: z.uuid(),
                      userId: z.uuid(),
                      type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
                      amount: z.number(),
                      categoryId: z.string().nullable(),
                      accountId: z.string().nullable(),
                      creditCardId: z.string().nullable(),
                      fromAccountId: z.string().nullable(),
                      toAccountId: z.string().nullable(),
                      isInstallment: z.boolean(),
                      installmentGroupId: z.string().nullable(),
                      createdAt: z.date(),
                    }),
                  ),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const card = await prisma.creditCard.findFirst({
          where: { id, userId },
        })

        if (!card) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        const months = []
        const BASE = new Date()

        for (let i = 0; i < 12; i++) {
          const ref = new Date(BASE.getFullYear(), BASE.getMonth() + i, 1)

          const { start, end } = getBillingPeriod(card.closingDay, ref)

          const transactions = await prisma.transaction.findMany({
            where: {
              userId,
              creditCardId: id,
              date: { gte: start, lte: end },
            },
          })

          months.push({
            year: ref.getFullYear(),
            month: ref.getMonth() + 1,
            start,
            end,
            total: transactions.reduce((s, t) => s + t.amount, 0),
            transactions,
          })
        }

        return reply.status(200).send({
          months,
        })
      },
    )
}
