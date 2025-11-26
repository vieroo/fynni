import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),
});

export type Organization = z.infer<typeof organizationSchema>;
