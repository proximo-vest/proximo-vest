import { z } from "zod";

export const sectionSchema = z.object({

  id: z.number(),
  name: z.string(),
  slug: z.string(),
 
});
