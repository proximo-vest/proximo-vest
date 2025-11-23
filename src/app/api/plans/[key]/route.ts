import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const auth = await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  if (!auth.ok) return auth.res;

  const { key } = await params;
  const body = await req.json();

  const { label, description, type, monthlyPrice, highlight, isActive } = body;

  const plan = await prisma.plan.update({
    where: { key },
    data: {
      label,
      description,
      type,
      monthlyPrice,
      highlight,
      isActive,
    },
  });

  return NextResponse.json(plan);
}
