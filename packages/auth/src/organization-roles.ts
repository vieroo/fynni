import { z } from "zod";

export const organizationRoleSchema = z.union([
  z.literal("OWNER"),
  z.literal("ADMIN"),
  z.literal("MEMBER"),
  z.literal("VIEWER"),
]);

export type organizationRoles = z.infer<typeof organizationRoleSchema>;
