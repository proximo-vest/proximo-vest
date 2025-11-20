import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAPIAuth } from "@/utils/access";

// Lista sessões ativas do usuário logado
export async function GET() {
  const authResult = await requireAPIAuth({});
  if (!authResult.ok) return authResult.res;

  const hdrs = Object.fromEntries((await headers()).entries());

  const sessions = await auth.api.listSessions({
    headers: hdrs,
  });

  return NextResponse.json(sessions);
}

// Revoga TODAS as sessões do usuário logado (incluindo a atual)
export async function POST() {
  const authResult = await requireAPIAuth({
    
  });
  console.log(authResult)
  if (!authResult.ok) return authResult.res;

  const hdrs = Object.fromEntries((await headers()).entries());

  await auth.api.revokeSessions({
    headers: hdrs,
  });

  return NextResponse.json({ ok: true });
}
