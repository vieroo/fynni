import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_error/bad-request-error'
import { hash } from 'bcryptjs'

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new user account.',
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z.null,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('Email já está em uso.')
      }

      const hashedPassword = await hash(password, 10)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
        },
      })

      return reply.status(201).send()
    },
  )
}
