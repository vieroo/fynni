import { z } from "zod";

export const accountSchema = z.object({
  id: z.uuid(),
  familyId: z.uuid(),
  name: z.string(),
  ownerId: z.uuid(),
});

export type Account = z.infer<typeof accountSchema>;
