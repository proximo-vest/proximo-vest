import { z } from "zod";

export const sectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: z.enum(["active", "suspended", "deleted"]).default("active"),

  roles: z
    .array(
      z.object({
        userId: z.string(),
        roleId: z.string(),
        // se você incluir o nome do cargo (include: { role: true })
        role: z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable().optional(),
          })
          .optional(),
      })
    )
    .default([]),
});
