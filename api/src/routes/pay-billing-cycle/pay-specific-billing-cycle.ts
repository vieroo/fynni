import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'
import { getBillingPeriod } from '../billing-cycle/_helpers/get-billing-period'

export async function paySpecificBillingCycle(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/credit-cards/:id/pay/:year/:month',
      {
        schema: {
          tags: ['Pay-billing-cycle'],
          summary:
            'Pay specific billing cyccle using credit card ID, month and year.',
          params: z.object({
            id: z.uuid(),
            month: z.string(),
            year: z.string(),
          }),
          body: z.object({
            accountId: z.uuid(),
          }),
          response: {
            201: z.object({
              message: z.string(),
              total: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id, year, month } = request.params
        const { accountId } = request.body
        const userId = await request.getCurrentUserId()

        const card = await prisma.creditCard.findFirst({
          where: { id, userId },
        })

        if (!card) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        const y = Number(year)
        const m = Number(month) - 1

        const start = new Date(y, m - 1, card.closingDay + 1)
        const end = new Date(y, m, card.closingDay)

        const alreadyPaid = await prisma.billingPayment.findFirst({
          where: {
            creditCardId: id,
            periodStart: start,
            periodEnd: end,
          },
        })

        if (alreadyPaid) {
          throw new BadRequestError('Fatura já foi paga.')
        }

        const transactions = await prisma.transaction.findMany({
          where: { userId, creditCardId: id, date: { gte: start, lte: end } },
        })

        const total = transactions.reduce((s, t) => s + t.amount, 0)

        await prisma.$transaction([
          prisma.billingPayment.create({
            data: {
              userId,
              creditCardId: id,
              periodStart: start,
              periodEnd: end,
              amount: total,
            },
          }),

          prisma.transaction.create({
            data: {
              userId,
              type: 'EXPENSE',
              amount: total,
              date: new Date(),
              description: `Pagamento da fatura ${month}/${year}.`,
              accountId,
            },
          }),

          prisma.account.update({
            where: { id: accountId },
            data: { balance: { decrement: total } },
          }),
        ])

        return reply.status(201).send({
          message: 'Fatura paga com sucesso.',
          total,
        })
      },
    )
}
