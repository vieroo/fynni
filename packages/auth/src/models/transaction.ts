import { z } from "zod";

export const transactionSchema = z.object({
  id: z.uuid(),
  familyId: z.uuid(),
  accountId: z.uuid(),
  categoryId: z.uuid(),
  type: z.enum(["INCOME", "EXPENSE"]),
  createdById: z.uuid(),
});

export type Transaction = z.infer<typeof transactionSchema>;
