import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import bcrypt from 'bcryptjs'
import { UnauthorizedError } from '../_error/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'

export async function updatePassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/users/password',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Update logged user password.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            oldPassword: z.string(),
            newPassword: z.string().min(6),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { sub: userId } = request.user as { sub: string }
        const { oldPassword, newPassword } = request.body

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new UnauthorizedError('Usuario não encontrado.')
        }

        if (!user.passwordHash) {
          throw new UnauthorizedError('Senha atual não corresponde.')
        }

        const isValidOld = bcrypt.compareSync(oldPassword, user.passwordHash)

        if (!isValidOld) {
          throw new UnauthorizedError('Senha atual não corresponde.')
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
          where: { id: userId },
          data: {
            passwordHash: newPasswordHash,
          },
        })

        return reply.send({
          message: 'Senha atualizada com sucesso.',
        })
      },
    )
}
