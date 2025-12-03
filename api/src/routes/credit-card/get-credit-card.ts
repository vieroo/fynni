import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function getCreditCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/credit-cards/:id',
      {
        schema: {
          tags: ['Credit-cards'],
          summary: 'List credit card by ID.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            200: z.object({
              creditCard: z.object({
                id: z.uuid(),
                userId: z.string(),
                name: z.string(),
                createdAt: z.date(),
                accountId: z.string(),
                limitAmount: z.number(),
                closingDay: z.number(),
                dueDay: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const creditCard = await prisma.creditCard.findUnique({
          where: { id, userId },
        })

        if (!creditCard) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        return reply.status(200).send({ creditCard })
      },
    )
}
