import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'

export async function forgotPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/forgot',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Generate reset password token.',
        body: z.object({
          email: z.email(),
        }),
        response: {
          201: z.null,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(201).send()
      }

      const resetToken = app.jwt.sign(
        {
          sub: user.id,
        },
        { expiresIn: '15m' },
      )

      console.log('RESET TOKEN: ', resetToken)

      return reply.status(201).send()
    },
  )
}
