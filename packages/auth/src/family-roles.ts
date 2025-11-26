import { z } from "zod";

export const familyRoleSchema = z.union([
  z.literal("OWNER"),
  z.literal("ADMIN"),
  z.literal("MEMBER"),
  z.literal("VIEWER"),
]);

export type FamilyRoles = z.infer<typeof familyRoleSchema>;
