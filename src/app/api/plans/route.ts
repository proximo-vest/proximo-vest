import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";

export async function GET() {
  const auth = await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  if (!auth.ok) return auth.res;

  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: "asc" },
  });

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const auth = await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  if (!auth.ok) return auth.res;

  const body = await req.json();
  const { key, label, description, type, monthlyPrice, highlight } = body;

  if (!key || !label || !description || !type) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando" },
      { status: 400 }
    );
  }

  const plan = await prisma.plan.create({
    data: {
      key,
      label,
      description,
      type,
      monthlyPrice: monthlyPrice ?? null,
      highlight: !!highlight,
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
