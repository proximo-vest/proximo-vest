import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

import { requireAPIAuth } from "@/utils/access";
const Schema = z.object({
  examEditionId: z.number().int(),
  phaseNumber: z.number().int(),
  dayNumber: z.number().int().nullable().optional(),
  subjectBlock: z.string().nullable().optional(),
  questionCountExpected: z.number().int().nullable().optional(),
  defaultOptionCount: z.number().int().nullable().optional(), // 4 ou 5
  isDiscursive: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  await requireAPIAuth({
    perm: ["examPhase.manage"],
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,

  });
  try {
    const data = Schema.parse(await req.json());
    const created = await prisma.examPhase.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 });
  }
}
