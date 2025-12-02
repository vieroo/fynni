import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function getAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/accounts/:id',
      {
        schema: {
          tags: ['Accounts'],
          summary: 'List account by ID.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              userId: z.string(),
              name: z.string(),
              type: z.enum(['CHECKING', 'SAVINGS', 'WALLET', 'INVESTMENT']),
              balance: z.number(),
              color: z.string().nullable(),
              imageUrl: z.string().nullable(),
              createdAt: z.date(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const account = await prisma.account.findUnique({
          where: { id, userId },
        })

        if (!account) {
          throw new BadRequestError('Conta não encontrada.')
        }

        return reply.status(200).send(account)
      },
    )
}
