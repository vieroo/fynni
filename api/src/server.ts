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
import { updatePassword } from './routes/auth/update-password'
import { createAccount } from './routes/account/create-account'
import { listAccounts } from './routes/account/list-accounts'
import { getAccount } from './routes/account/get-account'
import { updateAccount } from './routes/account/update-account'
import { deleteAccount } from './routes/account/delete-account'
import { createCategory } from './routes/category/create-category'
import { listCategories } from './routes/category/list-categories'
import { getCategory } from './routes/category/get-category'
import { updateCategory } from './routes/category/update-category'
import { deleteCategory } from './routes/category/delete-category'
import { createCreditCard } from './routes/credit-card/create-credit-card'
import { listCreditCards } from './routes/credit-card/list-credit-cards'
import { getCreditCard } from './routes/credit-card/get-credit-card'
import { updateCreditCard } from './routes/credit-card/update-credit-card'
import { deleteCreditCard } from './routes/credit-card/delete-credit-card'
import { createTransaction } from './routes/transaction/create-transaction'
import { listTransactions } from './routes/transaction/get-transaction'
import { getTransaction } from './routes/transaction/list-transactions'
import { deleteTransaction } from './routes/transaction/delete-transaction'
import { updateTransaction } from './routes/transaction/update-transaction'
import { getCurrentBillingCycle } from './routes/billing-cycle/get-current-billing-cycle'
import { getNextBillingCycle } from './routes/billing-cycle/get-next-billing-cycle'
import { getBillingCycleByMonthAndYear } from './routes/billing-cycle/get-billing-cycle-by-month-and-year'
import { getBillingCycleForecast } from './routes/billing-cycle/get-billing-cycle-forecast'
import { payBillingCycle } from './routes/pay-billing-cycle/pay-billing-cycle'
import { paySpecificBillingCycle } from './routes/pay-billing-cycle/pay-specific-billing-cycle'
import { previewBillingCycle } from './routes/pay-billing-cycle/preview-billing-cycle'

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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
app.register(updatePassword)

// Account Routes
app.register(createAccount)
app.register(listAccounts)
app.register(getAccount)
app.register(updateAccount)
app.register(deleteAccount)

// Categories Routes
app.register(createCategory)
app.register(listCategories)
app.register(getCategory)
app.register(updateCategory)
app.register(deleteCategory)

// Credit Card Routes
app.register(createCreditCard)
app.register(listCreditCards)
app.register(getCreditCard)
app.register(updateCreditCard)
app.register(deleteCreditCard)

// Transactions Routes
app.register(createTransaction)
app.register(listTransactions)
app.register(getTransaction)
app.register(updateTransaction)
app.register(deleteTransaction)

// Billing
app.register(getCurrentBillingCycle)
app.register(getNextBillingCycle)
app.register(getBillingCycleByMonthAndYear)
app.register(getBillingCycleForecast)

// Pay billing cycle
app.register(payBillingCycle)
app.register(paySpecificBillingCycle)
app.register(previewBillingCycle)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🔥 Server is running on http://localhost:3333')
  console.log('📘 Docs available at http://localhost:3333/docs')
})
