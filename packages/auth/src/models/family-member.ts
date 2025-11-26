import { z } from "zod";
import { familyRoleSchema } from "../family-roles";

export const familyMemberSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  familyId: z.uuid(),
  role: familyRoleSchema,
});

export type FamilyMember = z.infer<typeof familyMemberSchema>;
