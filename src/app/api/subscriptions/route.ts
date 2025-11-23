// app/api/admin/subscriptions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";

export async function GET(req: Request) {
  await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    // requiredRoles: ["ADMIN"], // encaixa com seu sistema depois
  });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status") || "";

  const subscriptions = await prisma.subscription.findMany({
    where: {
      AND: [
        status
          ? {
              status: status as any,
            }
          : {},
        q
          ? {
              OR: [
                {
                  user: {
                    email: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  user: {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  stripeSubscriptionId: {
                    contains: q,
                  },
                },
                {
                  planKey: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      ],
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(subscriptions);
}
