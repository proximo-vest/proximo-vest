// app/api/teacher-lists/[id]/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";


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
      },
    },
  });

  if (!list) {
    return NextResponse.json({ error: "Lista não encontrada" }, { status: 404 });
  }

  const duplicated = await prisma.$transaction(async (tx) => {
    const newList = await tx.teacherList.create({
      data: {
        name: `${list.name} (cópia)`,
        description: list.description,
        teacherId: list.teacherId,
        teacherName: list.teacherName,
      },
    });

    if (list.questions.length > 0) {
      await tx.teacherListQuestion.createMany({
        data: list.questions.map((item) => ({
          listId: newList.id,
          questionId: item.questionId,
          order: item.order,
        })),
      });
    }

    return newList;
  });

  return NextResponse.json(duplicated, { status: 201 });
}
