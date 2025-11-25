import { prisma } from "../../../../../lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  json,
  readBody,
  tryCatch,
  notFound,
  badRequest,
} from "../../../_utils";
import { requireAPIAuth } from "@/utils/access";

type Params = { slug: string };
type Ctx = { params: Promise<Params> };

const PatchSchema = z.object({
  slug: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
});

export async function GET(req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  return tryCatch(async () => {
    const { slug } = await ctx.params;

    const found = await prisma.examBoard.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!found) return notFound("ExamBoard not found");
    return json(found);
  });
}
