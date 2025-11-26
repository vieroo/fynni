import { z } from "zod";

export const installmentSchema = z.object({
  id: z.uuid(),
  transactionId: z.uuid(),
  familyId: z.uuid(),
  dueDate: z.date(),
  status: z.enum(["PENDING", "PAID"]),
});

export type Installment = z.infer<typeof installmentSchema>;
