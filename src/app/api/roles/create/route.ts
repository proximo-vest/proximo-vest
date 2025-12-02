import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { requireAPIAuth } from "@/utils/access";

export const roleCreateSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});


export async function POST(req: Request) {
  await requireAPIAuth({ perm: "role.manage", emailVerified: true, blockSuspended: true, blockDeleted: true });
  try {
    const body = await req.json();
    const { name, description, isActive } = roleCreateSchema.parse(body);

    const exists = await prisma.role.findUnique({
      where: { name },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Já existe um role com esse nome." },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name,
        description: description || null,
        isActive,
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Erro inesperado ao criar role." },
      { status: 500 }
    );
  }
}
