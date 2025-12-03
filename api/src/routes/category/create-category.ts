import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/categories',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Create a new category.',
          body: z.object({
            name: z.string(),
            icon: z.string().optional(),
            color: z.string().optional(),
            type: z.enum(['INCOME', 'EXPENSE', 'BOTH']),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name, icon, color, type } = request.body

        await prisma.category.create({
          data: {
            userId,
            name,
            icon,
            color,
            type,
          },
        })

        return reply.status(201).send()
      },
    )
}
