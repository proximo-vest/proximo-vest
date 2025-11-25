import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { requireAPIAuth } from "@/utils/access";

type Params = { id: string };
type Ctx = { params: Promise<Params> };

export async function GET(_req: NextRequest, ctx: Ctx) {
    await requireAPIAuth({
      emailVerified: true,
      blockSuspended: true,
      blockDeleted: true,
  
    });
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: { message: "Invalid id" } }, { status: 400 });
  }

  const row = await prisma.examPhase.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });
  return NextResponse.json(row);
}

const PatchSchema = z.object({
  subjectBlock: z.string().nullable().optional(),
  questionCountExpected: z.number().int().nullable().optional(),
  defaultOptionCount: z.number().int().nullable().optional(),
  isDiscursive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: ["examPhase.manage"],
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });
  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: { message: "Invalid id" } }, { status: 400 });
    }

    const data = PatchSchema.parse(await req.json());
    const updated = await prisma.examPhase.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  await requireAPIAuth({
    perm: ["examPhase.manage"],
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: { message: "Invalid id" } }, { status: 400 });
  }

  await prisma.examPhase.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
