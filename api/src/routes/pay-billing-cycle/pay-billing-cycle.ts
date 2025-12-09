import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'
import { getBillingPeriod } from '../billing-cycle/_helpers/get-billing-period'

export async function payBillingCycle(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/credit-cards/:id/pay',
      {
        schema: {
          tags: ['Pay-billing-cycle'],
          summary: 'Pay billing cycle by credit card ID.',
          params: z.object({
            id: z.uuid(),
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
        const { id } = request.params
        const { accountId } = request.body
        const userId = await request.getCurrentUserId()

        const card = await prisma.creditCard.findFirst({
          where: { id, userId },
        })

        if (!card) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        const { start, end } = getBillingPeriod(card.closingDay)

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
              description: `Pagamento da fatura ${card.name}`,
              accountId,
              categoryId: null,
              creditCardId: null,
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
