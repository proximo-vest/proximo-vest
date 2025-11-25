import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
import { json, readBody, tryCatch, badRequest } from "../../_utils";
import { requireAPIAuth } from "@/utils/access";

const Schema = z.object({
  questionId: z.number().int(),
  criterion: z.string(),
  levelsJson: z.record(z.string(), z.string()),
});

export async function POST(req: NextRequest) {
    await requireAPIAuth({
      perm: "rubric.manage",
       emailVerified: true,
       blockSuspended: true,
       blockDeleted: true,
     });
  return tryCatch(async () => {
    const parsed = Schema.safeParse(await readBody(req));
    if (!parsed.success) return badRequest(parsed.error.message);
    const { questionId, criterion, levelsJson } = parsed.data;

    // garante que a questão é discursiva
    const q = await prisma.question.findUnique({ where: { id: questionId } });
    if (!q || !q.isDiscursive) return badRequest("Rubrics only for discursive questions");

    const r = await prisma.frRubric.create({ data: { questionId, criterion, levelsJson: levelsJson as any } });
    return json(r, 201);
  });
}
