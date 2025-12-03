import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function createCreditCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/credit-cards',
      {
        schema: {
          tags: ['Credit-cards'],
          summary: 'Create new user credit card.',
          body: z.object({
            accountId: z.uuid(),
            name: z.string(),
            limitAmount: z.number(),
            closingDay: z.number(),
            dueDay: z.number(),
          }),
          response: {
            response: {
              201: z.null(),
            },
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { accountId, name, limitAmount, closingDay, dueDay } =
          request.body

        await prisma.creditCard.create({
          data: {
            userId,
            accountId,
            name,
            limitAmount,
            closingDay,
            dueDay,
          },
        })

        return reply.status(201).send()
      },
    )
}
