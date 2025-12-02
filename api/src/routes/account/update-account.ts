import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function updateAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/accounts/:id',
      {
        schema: {
          tags: ['Accounts'],
          summary: 'Update an account.',
          params: z.object({
            id: z.uuid(),
          }),
          body: z.object({
            name: z.string().min(1).optional(),
            type: z
              .enum(['CHECKING', 'SAVINGS', 'WALLET', 'INVESTMENT'])
              .optional(),
            balance: z.number().optional(),
            color: z.string().optional(),
            imageUrl: z.string().optional(),
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

        const existingAccount = await prisma.account.findFirst({
          where: { id, userId },
        })

        if (!existingAccount) {
          throw new BadRequestError('Conta não encontrada.')
        }

        await prisma.account.update({
          data: { ...request.body },
          where: { id },
        })

        return reply
          .status(200)
          .send({ message: 'Conta atualizada com sucesso.' })
      },
    )
}
