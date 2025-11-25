import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { requireAPIAuth } from "@/utils/access";

type Params = { id: string };
type Ctx = { params: Promise<Params> };

const PatchSchema = z.object({
  label: z.string().optional(),
  answerHtml: z.string().optional(),
  maxScore: z.number().optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: "expectedAnswer.manage",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: { message: "Invalid id" } },
        { status: 400 }
      );
    }

    const data = PatchSchema.parse(await req.json());
    const updated = await prisma.frAnswerExpected.update({
      where: { id },
      data: { ...data, maxScore: data.maxScore as any },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: { message: e.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: "expectedAnswer.manage",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json(
      { error: { message: "Invalid id" } },
      { status: 400 }
    );
  }

  await prisma.frAnswerExpected.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
