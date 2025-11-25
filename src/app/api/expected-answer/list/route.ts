import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { z } from "zod"
import {requireAPIAuth} from "@/utils/access"
 
const Schema = z.object({
  questionId: z.coerce.number().int(),
})

export async function GET(req: NextRequest) {
    await requireAPIAuth({
      emailVerified: true,
      blockSuspended: true,
      blockDeleted: true,
    });
  try {
    const { searchParams } = new URL(req.url)
    const questionId = searchParams.get("questionId")

    const { questionId: validatedId } = Schema.parse({ questionId })

    const rows = await prisma.frAnswerExpected.findMany({
      where: { frItemId: validatedId },
      orderBy: { id: "asc" },
    })

    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 })
  }
}
