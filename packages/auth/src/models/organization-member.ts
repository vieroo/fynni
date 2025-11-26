import { z } from 'zod';
import { organizationRoleSchema } from '../organization-roles';

export const organizationMemberSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  organizationId: z.uuid(),
  role: organizationRoleSchema,
});

export type OrganizationMember = z.infer<typeof organizationMemberSchema>;
