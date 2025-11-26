import { z } from 'zod';

export const accountSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  isShared: z.boolean(),
  ownerId: z.uuid(),
});

export type Account = z.infer<typeof accountSchema>;
