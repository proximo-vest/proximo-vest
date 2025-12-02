import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { requireAPIAuth } from "@/utils/access";

export async function GET(req: NextRequest) {
  await requireAPIAuth({ perm: "perm.read", emailVerified: true, blockSuspended: true, blockDeleted: true });
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get("onlyActive");
    const resource = searchParams.get("resource"); // opcional, filtrar por "exam"

    const where: any = {};
    if (onlyActive === "true") where.isActive = true;
    if (resource) where.resource = resource;

    const rows = await prisma.permission.findMany({
      where,
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });

    return NextResponse.json(rows);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: { message: e.message } },
      { status: 400 }
    );
  }
}
