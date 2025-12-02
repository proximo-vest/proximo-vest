// app/api/exam-board/[id]/route.ts
import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
import { json, readBody, tryCatch, notFound, badRequest } from "../../_utils";
import { requireAPIAuth } from "@/utils/access";

type Params = { id: string };
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
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) return badRequest("Invalid id");

    const found = await prisma.examBoard.findUnique({ where: { id } });
    if (!found) return notFound("ExamBoard not found");
    return json(found);
  });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: "examBoard.manage",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });
  return tryCatch(async () => {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) return badRequest("Invalid id");

    const parsed = PatchSchema.safeParse(await readBody(req));
    if (!parsed.success) return badRequest(parsed.error.message);

    const updated = await prisma.examBoard.update({
      where: { id },
      data: parsed.data,
    });
    return json(updated);
  });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: "examBoard.manage",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });
  return tryCatch(async () => {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) return badRequest("Invalid id");

    await prisma.examBoard.delete({ where: { id } });
    return json({ ok: true });
  });
}
