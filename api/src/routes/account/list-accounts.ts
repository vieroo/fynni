import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function listAccounts(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/accounts',
      {
        schema: {
          tags: ['Accounts'],
          summary: 'List all user accounts.',
          response: {
            200: z.object({
              accounts: z.array(
                z.object({
                  id: z.string(),
                  userId: z.string(),
                  name: z.string(),
                  type: z.enum(['CHECKING', 'SAVINGS', 'WALLET', 'INVESTMENT']),
                  balance: z.number(),
                  color: z.string().nullable(),
                  imageUrl: z.string().nullable(),
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const accounts = await prisma.account.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        })

        return reply.status(200).send({ accounts })
      },
    )
}
