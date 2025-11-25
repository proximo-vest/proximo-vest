import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { requireAPIAuth } from "@/utils/access";


const Schema = z.object({ name: z.string(), slug: z.string() });

export async function POST(req: NextRequest) {
      await requireAPIAuth({
      perm: "subject.manage",
       emailVerified: true,
       blockSuspended: true,
       blockDeleted: true,
     });
  try {
    const data = Schema.parse(await req.json());
    const created = await prisma.subject.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 });
  }
}
