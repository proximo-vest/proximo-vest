import { z } from "zod";

export const permissionsCreateSchema = z.object({
  id: z.string(),
  resource: z.string(), // "exam"
  action: z.string(), // "publish"
  isActive: z.boolean().default(true), 
  key: z.string(), // "exam.publish"


});
