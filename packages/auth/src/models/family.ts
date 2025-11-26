import { z } from "zod";

export const familySchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),
});

export type Family = z.infer<typeof familySchema>;
