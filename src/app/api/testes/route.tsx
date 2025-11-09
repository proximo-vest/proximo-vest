// app/api/exam-board/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";

export async function GET() {
    // Exige login, conta ativa, e-mail verificado e permissão específica
    const guard = await requireAPIAuth({
        emailVerified: true,
        role: "Admin",    
        blockSuspended: true,
        blockDeleted: true,
    });
    if (!guard.ok) return guard.res;

    const board = {
        teste: "ok"
    }
    return NextResponse.json(board);
}