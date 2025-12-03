import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function updateCreditCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/credit-cards/:id',
      {
        schema: {
          tags: ['Credit-cards'],
          summary: 'Update an user credit card.',
          params: z.object({
            id: z.uuid(),
          }),
          body: z.object({
            accountId: z.uuid().optional(),
            name: z.string().optional(),
            limitAmount: z.number().optional(),
            closingDay: z.number().optional(),
            dueDay: z.number().optional(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const existingCard = await prisma.creditCard.findFirst({
          where: { userId, id },
        })

        if (!existingCard) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        await prisma.creditCard.update({
          data: { ...request.body },
          where: { id },
        })

        return reply
          .status(200)
          .send({ message: 'Cartão atualizado com sucesso.' })
      },
    )
}
