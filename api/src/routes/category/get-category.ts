import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function getCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/categories/:id',
      {
        schema: {
          tags: ['Categories'],
          summary: 'List all user categories.',
          params: z.object({
            id: z.uuid(),
          }),
          response: {
            200: z.object({
              category: z.object({
                id: z.string(),
                userId: z.string().nullable(),
                name: z.string(),
                type: z.enum(['INCOME', 'EXPENSE', 'BOTH']),
                color: z.string().nullable(),
                createdAt: z.date(),
                icon: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const category = await prisma.category.findFirst({
          where: { OR: [{ userId }, { userId: null }] },
        })

        if (!category) {
          throw new BadRequestError('Categoria não encontrada.')
        }

        return reply.status(200).send({ category })
      },
    )
}
