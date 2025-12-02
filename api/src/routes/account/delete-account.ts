import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function deleteAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/accounts/:id',
      {
        schema: {
          tags: ['Accounts'],
          summary: 'Delete an account.',
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

        const existingAccount = await prisma.account.findUnique({
          where: { id, userId },
        })

        if (!existingAccount) {
          throw new BadRequestError('Conta não encontrada.')
        }

        await prisma.account.delete({
          where: { id },
        })

        return reply
          .status(204)
          .send({ message: 'Conta deletada com sucesso.' })
      },
    )
}
