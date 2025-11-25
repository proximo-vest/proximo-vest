export const runtime = "nodejs"
import { prisma } from "../../../../lib/prisma"
import { NextRequest } from "next/server"
import { z } from "zod"
import { json, tryCatch } from "../../_utils"
import { requireAPIAuth } from "@/utils/access"
const Schema = z.object({
  filter: z.string().optional(),
})

export async function GET(req: NextRequest) {

    await requireAPIAuth({
      perm: "user.read",
      emailVerified: true,
      blockSuspended: true,
      blockDeleted: true,
     });
  return tryCatch(async () => {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get("filter") || undefined
    const { filter: validatedFilter } = Schema.parse({ filter })

    const data = await prisma.user.findMany({
      where: validatedFilter
        ? {
          OR: [
            { name: { contains: validatedFilter, mode: "insensitive" } },
            { id: { contains: validatedFilter, mode: "insensitive" } },
          ],
        }
        : undefined,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        roles: {
          include: { role: true },
        }
      },

    })

    return json(data)
  })
}
