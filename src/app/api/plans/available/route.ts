import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rota pública para listar planos disponíveis (somente ativos).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // "student" | "teacher" | "school" | null

  const where: any = { isActive: true };

  if (type) {
    where.type = type;
  }

  const plans = await prisma.plan.findMany({
    where,
    orderBy: {
      monthlyPrice: "asc",
    },
  });

  return NextResponse.json(plans);
}
