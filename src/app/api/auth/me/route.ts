// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { requireAPIAuth } from "@/utils/access";

export async function GET() {
  const guard = await requireAPIAuth({
    // não exige permissão específica, apenas login
    blockSuspended: false, // queremos ver o status mesmo suspenso
    blockDeleted: false,
  });
  if (!guard.ok) return guard.res;

  const { profile, session } = guard;

  return NextResponse.json({
    userId: session.user.id,
    emailVerified: profile.emailVerified,
    status: profile.status,         // "active" | "suspended" | "deleted"
    roles: profile.roles,           // ["admin", ...]
    perms: Object.keys(profile.perms).filter(k => profile.perms[k]),
  });
}
