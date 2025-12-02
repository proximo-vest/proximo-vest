// app/api/teacher-lists/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";

const updateTeacherListSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  teacherName: z.string().min(2).optional(),
  // se mandar questionIds, a lista de questões é reescrita nessa ordem
  questionIds: z.array(z.number().int()).optional(),
});

type RouteContext = {
  params: { id: string };
};

type Params = { id: string };
type Ctx = { params: Promise<Params> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { session } = await requireAPIAuth();

  const { id } = await ctx.params;

  const list = await prisma.teacherList.findFirst({
    where: {
      id: id,
      teacherId: session?.user.id,
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          question: {
            include: {
              mcq: {
                include: { options: true },
              },
              fr: true,
              subjects: {
                include: { subject: true },
              },
            },
          },
        },
      },
    },
  });

  if (!list) {
    return NextResponse.json(
      { error: "Lista não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(list);
}



export async function PUT(req: NextRequest, ctx: Ctx) {
  const { session } = await requireAPIAuth();

  const { id } = await ctx.params;

  const existing = await prisma.teacherList.findFirst({
    where: {
      id: id,
      teacherId: session?.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Lista não encontrada" },
      { status: 404 }
    );
  }

  const json = await req.json();
  const parsed = updateTeacherListSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, teacherName, questionIds } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    const list = await tx.teacherList.update({
      where: { id: existing.id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        teacherName: teacherName ?? existing.teacherName,
      },
    });

    if (questionIds) {
      await tx.teacherListQuestion.deleteMany({
        where: { listId: list.id },
      });

      await tx.teacherListQuestion.createMany({
        data: questionIds.map((questionId, index) => ({
          listId: list.id,
          questionId,
          order: index + 1,
        })),
      });
    }

    return list;
  });

  return NextResponse.json(updated);
}


export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { session } = await requireAPIAuth();

  const { id } = await ctx.params;

  const existing = await prisma.teacherList.findFirst({
    where: {
      id: id,
      teacherId: session?.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Lista não encontrada" },
      { status: 404 }
    );
  }

  await prisma.teacherList.delete({
    where: { id: existing.id },
  });

  return NextResponse.json({ success: true });
}
