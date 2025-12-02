import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function createAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/accounts',
      {
        schema: {
          tags: ['Accounts'],
          summary: 'Create a new account.',
          body: z.object({
            name: z.string(),
            type: z.enum(['CHECKING', 'SAVINGS', 'WALLET', 'INVESTMENT']),
            balance: z.number(),
            color: z.string().optional(),
            imageUrl: z.string().optional(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, type, balance, color, imageUrl } = request.body

        await prisma.account.create({
          data: {
            userId,
            name,
            type,
            balance,
            color,
            imageUrl,
          },
        })

        return reply.status(201).send(null)
      },
    )
}
