// app/api/auth/logout/route.ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST() {
  // passe os headers atuais para o Better Auth
  const hdrs = Object.fromEntries((await headers()).entries());

  // o próprio Better Auth devolve uma Response com os cookies de logout
  return auth.api.signOut({ headers: hdrs });
}
