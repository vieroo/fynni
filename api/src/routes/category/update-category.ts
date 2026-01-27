import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function updateCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/categories/:id',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Update a category.',
          params: z.object({
            id: z.uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            icon: z.string().optional(),
            color: z.string().optional(),
            type: z.enum(['INCOME', 'EXPENSE', 'BOTH']).optional(),
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

        const existingCategory = await prisma.category.findFirst({
          where: { id, userId },
        })

        if (!existingCategory) {
          throw new BadRequestError('Categoria não encontrada')
        }

        if (existingCategory.userId === null) {
          throw new BadRequestError('Categorias padrão não podem ser editadas')
        }

        await prisma.category.update({
          data: { ...request.body },
          where: {
            id,
            userId,
          },
        })

        return reply
          .status(200)
          .send({ message: 'Categoria atualizada com sucesso.' })
      },
    )
}
