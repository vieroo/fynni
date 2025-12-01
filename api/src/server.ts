import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import fastifyJwt from '@fastify/jwt'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createUser } from './routes/auth/create-user'
import { getProfile } from './routes/auth/get-profile'
import { resetPassword } from './routes/auth/reset-password'
import { forgotPassword } from './routes/auth/forgot-password'

const JWT_SECRET = process.env.JWT_SECRET || 'my-jwt-secret'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Fynni API Documentation',
      description: 'API documentation for Fynni application',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: JWT_SECRET,
})

// Auth Routes
app.register(authenticateWithPassword)
app.register(createUser)
app.register(getProfile)
app.register(resetPassword)
app.register(forgotPassword)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🔥 Server is running on http://localhost:3333')
  console.log('📘 Docs available at http://localhost:3333/docs')
})
