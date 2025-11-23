// app/api/admin/coupons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";
import type { CouponType, CouponTarget } from "@/generated/prisma";

export async function GET() {
  // Ajuste para sua lógica de permissão: admin, etc.
  await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    // requiredRoles: ["ADMIN"],
  });

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    // requiredRoles: ["ADMIN"],
  });

  const body = await req.json();

  const {
    code,
    type,
    discountValue,
    validFor,
    redeemLimit,
    expiresAt,
  } = body as {
    code: string;
    type: CouponType | string;
    discountValue: number;
    validFor: CouponTarget | string;
    redeemLimit?: number | null;
    expiresAt?: string | null;
  };

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      type: type as CouponType,
      discountValue,
      validFor: validFor as CouponTarget,
      redeemLimit: redeemLimit ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
