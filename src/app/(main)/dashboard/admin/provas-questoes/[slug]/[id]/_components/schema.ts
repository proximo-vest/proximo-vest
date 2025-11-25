import { z } from "zod";

export const sectionSchema = z.object({
  id: z.number(),
  examEditionId: z.number(),
  phaseNumber: z.number(),
  dayNumber: z.number().nullable(),

  subjectBlock: z.string().nullable(),

  questionCountExpected: z.number().nullable(),
  defaultOptionCount: z.number().nullable(),
  isDiscursive: z.boolean,
});
