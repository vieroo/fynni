import { z } from "zod";

export const categorySchema = z.object({
  id: z.uuid(),
  familyId: z.uuid(),
  name: z.string(),
  createdById: z.uuid(),
});

export type Category = z.infer<typeof categorySchema>;
