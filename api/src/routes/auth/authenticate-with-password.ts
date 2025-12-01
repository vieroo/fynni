import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_error/bad-request-error'
import { compare } from 'bcryptjs'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user using email and password.',
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      if (userFromEmail.passwordHash === null) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      const isPasswordCorrect = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordCorrect) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
