import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function deleteCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/categories/:id',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Delete category.',
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

        const category = await prisma.category.findFirst({
          where: { userId, id },
        })

        if (category?.userId === null) {
          throw new BadRequestError('Categorias padrão não podem ser alteradas')
        }

        if (!category) {
          throw new BadRequestError('Categoria não encontrada.')
        }

        await prisma.category.delete({
          where: { id },
        })

        return reply
          .status(204)
          .send({ message: 'Categoria deletada com sucesso.' })
      },
    )
}
