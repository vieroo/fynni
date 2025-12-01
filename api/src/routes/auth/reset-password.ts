import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset password using token.',
        body: z.object({
          token: z.string(),
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
      const { token, newPassword } = request.body

      try {
        const payload = app.jwt.verify<{ sub: string }>(token)

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
          where: { id: payload.sub },
          data: {
            passwordHash,
          },
        })

        return reply.send({
          message: 'Senha atualizada com sucesso.',
        })
      } catch (err) {
        return reply.status(401).send({
          message: 'Token expirado ou inválido.',
        })
      }
    },
  )
}
