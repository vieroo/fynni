import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function listCreditCards(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/credit-cards',
      {
        schema: {
          tags: ['Credit-cards'],
          summary: 'List all user credit cards.',
          response: {
            200: z.object({
              creditCards: z.array(
                z.object({
                  id: z.uuid(),
                  userId: z.string(),
                  name: z.string(),
                  createdAt: z.date(),
                  accountId: z.string(),
                  limitAmount: z.number(),
                  closingDay: z.number(),
                  dueDay: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const creditCards = await prisma.creditCard.findMany({
          where: { userId },
        })

        return reply.status(200).send({ creditCards })
      },
    )
}
