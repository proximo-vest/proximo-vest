import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { requireAPIAuth } from "@/utils/access";

const Schema = z.object({
  code: z.string().nullable().optional(),
  label: z.string()
});

export async function POST(req: NextRequest) {
    await requireAPIAuth({
    perm: "skill.manage",
     emailVerified: true,
     blockSuspended: true,
     blockDeleted: true,
   });
  try {
    const data = Schema.parse(await req.json());
    const created = await prisma.skill.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 });
  }
}
