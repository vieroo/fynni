import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function deleteCreditCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/credit-cards/:id',
      {
        schema: {
          tags: ['Credit-cards'],
          summary: 'Delete an user credit card.',
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

        const existingCard = await prisma.creditCard.findFirst({
          where: { userId, id },
        })

        if (!existingCard) {
          throw new BadRequestError('Cartão não encontrado.')
        }

        await prisma.creditCard.delete({
          where: { id },
        })

        return reply
          .status(204)
          .send({ message: 'Cartão deletado com sucesso.' })
      },
    )
}
