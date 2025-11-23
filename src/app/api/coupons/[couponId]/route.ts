// app/api/admin/coupons/[couponId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";
import type { CouponType, CouponTarget } from "@/generated/prisma";


export async function PUT(req: Request,  { params }: { params: Promise<{ couponId: string }> }) {
  const { couponId } =  await params;

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
    code?: string;
    type?: CouponType | string;
    discountValue?: number;
    validFor?: CouponTarget | string;
    redeemLimit?: number | null;
    expiresAt?: string | null;
  };

  const coupon = await prisma.coupon.update({
    where: { id: couponId },
    data: {
      code: code ? code.trim().toUpperCase() : undefined,
      type: type as CouponType | undefined,
      discountValue,
      validFor: validFor as CouponTarget | undefined,
      redeemLimit,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : expiresAt === null
          ? null
          : undefined,
    },
  });

  return NextResponse.json(coupon);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ couponId: string }> }) {
  const { couponId } = await params;

  await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    // requiredRoles: ["ADMIN"],
  });

  await prisma.coupon.delete({
    where: { id: couponId },
  });

  return NextResponse.json({ ok: true });
}
