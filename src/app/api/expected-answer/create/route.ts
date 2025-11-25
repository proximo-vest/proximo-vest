import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import {requireAPIAuth} from "@/utils/access"

const Schema = z.object({
  questionId: z.number().int(),        // da questão discursiva
  label: z.string().optional(),        // "a)", "b)" ...
  answerHtml: z.string().optional(),
  maxScore: z.number().optional()
});

export async function POST(req: NextRequest) {
  await requireAPIAuth({
    perm: "expectedAnswer.manage",
     emailVerified: true,
     blockSuspended: true,
     blockDeleted: true,
   });
  try {
    const { questionId, label, answerHtml, maxScore } = Schema.parse(await req.json());
    const fr = await prisma.frItem.findUnique({ where: { questionId } });
    if (!fr) return NextResponse.json({ error: { message: "Discursive FrItem not found" } }, { status: 400 });

    const created = await prisma.frAnswerExpected.create({
      data: { frItemId: questionId, label, answerHtml, maxScore: maxScore as any }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 400 });
  }
}
