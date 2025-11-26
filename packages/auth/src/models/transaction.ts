import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  accountId: z.uuid(),
  createdById: z.uuid(),
});

export type Transaction = z.infer<typeof transactionSchema>;
