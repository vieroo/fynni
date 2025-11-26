import { z } from 'zod';

export const categorySchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  isDefault: z.boolean(),
  createdById: z.uuid(),
});

export type Category = z.infer<typeof categorySchema>;
