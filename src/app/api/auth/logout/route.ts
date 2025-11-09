// app/api/auth/logout/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const hdrs = Object.fromEntries((await headers()).entries());

  // Na sua versão, isso NÃO retorna Response — apenas executa o logout no server/DB
  await auth.api.signOut({ headers: hdrs });

  // Devolva um Response explícito para satisfazer o tipo do Next.js
  return new NextResponse(null, { status: 204 });
}
