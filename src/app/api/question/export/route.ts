import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { requireAPIAuth } from "@/utils/access";

const Schema = z.object({ examPhaseId: z.number().int() });

export async function POST(req: NextRequest) {
  await requireAPIAuth({
    perm: "question.batch",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });
  const { examPhaseId } = Schema.parse(await req.json());
  const items = await prisma.question.findMany({
    where: { examPhaseId },
    orderBy: { numberLabel: "asc" },
    include: {
      stimulus: { include: { assets: true } },
      subjects: { include: { subject: true } },
      skills: { include: { skill: true } },
      mcq: { include: { options: true } },
      fr: { include: { expectedAnswers: true, rubrics: true } },
    },
  });
  return NextResponse.json({ examPhaseId, items });
}
