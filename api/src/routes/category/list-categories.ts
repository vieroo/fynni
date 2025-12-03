import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function listCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/categories',
      {
        schema: {
          tags: ['Categories'],
          summary: 'List all user categories.',
          response: {
            200: z.object({
              categories: z.array(
                z.object({
                  id: z.string(),
                  userId: z.string(),
                  name: z.string(),
                  type: z.enum(['INCOME', 'EXPENSE', 'BOTH']),
                  color: z.string().nullable(),
                  createdAt: z.date(),
                  icon: z.string().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const categories = await prisma.category.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        })

        return reply.status(200).send({ categories })
      },
    )
}
