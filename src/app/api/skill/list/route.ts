import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { z } from "zod"
import { requireAPIAuth } from "@/utils/access"

const Schema = z.object({
  filter: z.string().optional(),
})

export async function GET(req: NextRequest) {
    await requireAPIAuth({

       emailVerified: true,
       blockSuspended: true,
       blockDeleted: true,
     });
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get("filter") || undefined

    const { filter: validatedFilter } = Schema.parse({ filter })

    const rows = await prisma.skill.findMany({
      where: validatedFilter
        ? { label: { contains: validatedFilter, mode: "insensitive" } }
        : undefined,
      orderBy: { label: "asc" },
    })

    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 })
  }
}
