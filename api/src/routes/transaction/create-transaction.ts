import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/middlewares/auth'
import { BadRequestError } from '../_error/bad-request-error'
import { createTransfer } from './_helpers/create-transfer'
import { createInstallments } from './_helpers/create-installments'

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Create a new user transaction.',
          body: z.object({
            type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
            amount: z.number(),
            date: z.date(),
            description: z.string().nullable(),
            categoryId: z.string().nullable(),
            accountId: z.string().nullable(),
            creditCardId: z.string(),
            fromAccountId: z.string().nullable(),
            toAccountId: z.string().nullable(),
            isInstallment: z.boolean().default(false),
            installments: z.number().nullable(),
          }),
          response: {
            201: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const {
          type,
          amount,
          date,
          description,
          categoryId,
          accountId,
          creditCardId,
          fromAccountId,
          toAccountId,
          isInstallment,
          installments,
        } = request.body

        // Verificar conta
        if (accountId) {
          const account = await prisma.account.findFirst({
            where: { userId, id: accountId },
          })

          if (!account) throw new BadRequestError('Conta inválida.')
        }

        // Verificar cartao
        if (creditCardId) {
          const creditCard = await prisma.creditCard.findFirst({
            where: { userId, id: creditCardId },
          })

          if (!creditCard) throw new BadRequestError('Cartão inválido.')
        }

        // -------------------------
        // TRANSFER
        // -------------------------
        if (type === 'TRANSFER') {
          if (!fromAccountId || !toAccountId)
            throw new BadRequestError(
              'Transferência exige conta de origem e conta de destino.',
            )

          if (fromAccountId === toAccountId) {
            throw new BadRequestError(
              'Transferência não pode ser para a mesma conta.',
            )
          }

          await createTransfer(
            userId,
            fromAccountId,
            toAccountId,
            amount,
            date,
            description,
          )

          return reply.status(201).send({
            message: 'Transferência entre contas realizada com sucesso.',
          })
        }

        // -------------------------
        // WITH INSTALLMENTS
        // -------------------------
        if (isInstallment) {
          if (!installments || installments < 2) {
            throw new BadRequestError('Número de parcelas inválido.')
          }

          if (amount <= 0) {
            throw new BadRequestError('Valor não pode ser zero.')
          }

          await createInstallments(
            amount,
            installments,
            description,
            userId,
            type,
            date,
            categoryId,
            accountId,
            creditCardId,
          )

          return reply.status(201).send({
            message: 'Parcelamento criado com sucesso.',
          })
        }

        // -------------------------
        // NORMAL TRANSACTION
        // -------------------------
        if (!isInstallment) {
          if (!accountId && !creditCardId)
            throw new BadRequestError(
              'Transação normal requer conta OU cartão.',
            )

          await prisma.transaction.create({
            data: {
              userId,
              type,
              amount,
              date,
              description,
              categoryId,
              accountId,
              creditCardId,
              isInstallment,
            },
          })

          if (accountId) {
            if (type === 'INCOME') {
              await prisma.account.update({
                where: { id: accountId },
                data: {
                  balance: { increment: amount },
                },
              })
            }

            if (type === 'INCOME') {
              await prisma.account.update({
                where: { id: accountId },
                data: { balance: { increment: amount } },
              })
            }
          }

          return reply
            .status(201)
            .send({ message: 'Transação criada com sucesso.' })
        }
      },
    )
}
