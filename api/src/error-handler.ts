import { z } from 'zod'
import { type FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_error/bad-request-error'
import { UnauthorizedError } from './routes/_error/unauthorized-error'

function hasErrorCode(
  err: unknown,
): err is { code: string; validation?: unknown } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'string'
  )
}

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasErrorCode(error) && error.code === 'FST_ERR_VALIDATION') {
    return reply.status(400).send({
      message: 'Erro de validação.',
      errors: error.validation,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      errors: z.treeifyError(error),
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability platform

  return reply.status(500).send({ message: 'Internal server error' })
}
