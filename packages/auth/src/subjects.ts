import { z } from "zod";

export const subjects = z.union([
  z.literal("User"),
  z.literal("Family"),
  z.literal("FamilyMember"),
  z.literal("Account"),
  z.literal("Transaction"),
  z.literal("Category"),
  z.literal("Installment"),
  z.literal("Invite"),
  z.literal("all"), // Para permissões globais
]);

export type Subjects = z.infer<typeof subjects>;
