import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";       // sua instância server do Better Auth
import { prisma } from "@/lib/prisma";   // seu Prisma client

type RoleName = string; // ex.: "admin", "editor"
type PermissionKey = string; // ex.: "exam.publish"

// ========================
// Sessão a partir do request
// ========================
export async function getSessionOrNull() {
  const hdrs = Object.fromEntries((await headers()).entries());
  return auth.api.getSession({ headers: hdrs });
}

// ========================
// Carrega dados de autorização do usuário
// - status, emailVerified
// - roles (por nome) e permissões efetivas (Role + User overrides)
// ========================
async function getAuthProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      status: true, // "active" | "suspended" | "deleted"
      roles: {
        select: {
          role: {
            select: {
              name: true,
              isActive: true,
              perms: {
                select: {
                  granted: true,
                  permission: { select: { key: true, isActive: true } },
                },
              },
            },
          },
        },
      },
      directPerms: {
        select: {
          granted: true,
          permission: { select: { key: true, isActive: true } },
        },
      },
    },
  });

  if (!user) return null;

  // roles ativos
  const roleNames = (user.roles ?? [])
    .filter(r => r.role?.isActive)
    .map(r => r.role!.name);

  // permissões via roles (só ativas)
  const fromRoles: Record<PermissionKey, boolean> = {};
  for (const ur of user.roles ?? []) {
    if (!ur.role?.isActive) continue;
    for (const rp of ur.role.perms ?? []) {
      if (!rp.permission?.isActive) continue;
      const key = rp.permission.key;
      // granted=true liga, granted=false desliga
      fromRoles[key] = rp.granted;
    }
  }

  // permissões diretas (sobrescrevem)
  const direct: Record<PermissionKey, boolean> = {};
  for (const up of user.directPerms ?? []) {
    if (!up.permission?.isActive) continue;
    direct[up.permission.key] = up.granted;
  }

  // merge efetivo: direto > role
  const effective: Record<PermissionKey, boolean> = { ...fromRoles, ...direct };

  return {
    emailVerified: user.emailVerified,
    status: user.status, // "active" | "suspended" | "deleted"
    roles: roleNames,
    perms: effective, // { "exam.publish": true/false, ... }
  };
}

// ========================
// Predicados
// ========================
export function hasRole(profile: { roles: string[] }, role: RoleName) {
  return profile.roles.includes(role);
}

export function hasPermission(profile: { perms: Record<string, boolean> }, key: PermissionKey) {
  return !!profile.perms[key];
}

/** Pode aceitar role OU permission (ou ambos). Se ambos forem passados, exige ambos. */
export function can(
  profile: { roles: string[]; perms: Record<string, boolean> },
  opts?: { role?: RoleName; perm?: PermissionKey }
) {
  if (!opts) return true;
  const roleOk = opts.role ? hasRole(profile, opts.role) : true;
  const permOk = opts.perm ? hasPermission(profile, opts.perm) : true;
  return roleOk && permOk;
}

// ========================
// Guard para API (JSON)
// ========================
export async function requireAPIAuth(opts?: {
  role?: RoleName;          // ex.: "admin"
  perm?: PermissionKey;     // ex.: "exam.publish"
  emailVerified?: boolean;  // default: false
  blockSuspended?: boolean; // default: true
  blockDeleted?: boolean;   // default: true
}) {
  const session = await getSessionOrNull();
  if (!session?.user?.id) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const profile = await getAuthProfile(session.user.id as string);
  if (!profile) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Status
  const blockSuspended = opts?.blockSuspended ?? true;
  const blockDeleted = opts?.blockDeleted ?? true;

  if (blockDeleted && profile.status === "deleted") {
    return { ok: false as const, res: NextResponse.json({ error: "DeletedAccount" }, { status: 403 }) };
  }
  if (blockSuspended && profile.status === "suspended") {
    return { ok: false as const, res: NextResponse.json({ error: "Suspended" }, { status: 403 }) };
  }

  // Email verificado
  if (opts?.emailVerified && !profile.emailVerified) {
    return { ok: false as const, res: NextResponse.json({ error: "EmailNotVerified" }, { status: 403 }) };
  }

  // Role/perm
  if (!can(profile, { role: opts?.role, perm: opts?.perm })) {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, session, profile };
}

// ========================
// Guard para páginas (redirect)
// ========================
export async function requirePageAuth(opts?: {
  role?: RoleName;
  perm?: PermissionKey;
  emailVerified?: boolean;
  blockSuspended?: boolean;
  blockDeleted?: boolean;
  onUnauthorizedRedirect?: string;  // default: "/auth/sign-in"
  onUnverifiedRedirect?: string;    // default: "/verify-email"
  onSuspendedRedirect?: string;     // default: "/suspended"
  onDeletedRedirect?: string;       // default: "/deleted"
  onForbiddenRedirect?: string;     // default: "/dashboard"
}) {
  const {
    onUnauthorizedRedirect = "/auth/login",
    onUnverifiedRedirect = "/verify-email",
    onSuspendedRedirect = "/suspended",
    onDeletedRedirect = "/deleted",
    onForbiddenRedirect = "/dashboard",
  } = opts ?? {};

  const session = await getSessionOrNull();
  if (!session?.user?.id) {
    const { redirect } = await import("next/navigation");
    return redirect(onUnauthorizedRedirect);
  }

  const profile = await getAuthProfile(session.user.id as string);
  if (!profile) {
    const { redirect } = await import("next/navigation");
    return redirect(onUnauthorizedRedirect);
  }

  // Status
  const blockSuspended = opts?.blockSuspended ?? true;
  const blockDeleted = opts?.blockDeleted ?? true;

  const { redirect } = await import("next/navigation");
  if (blockDeleted && profile.status === "deleted") {
    return redirect(onDeletedRedirect);
  }
  if (blockSuspended && profile.status === "suspended") {
    return redirect(onSuspendedRedirect);
  }

  if (opts?.emailVerified && !profile.emailVerified) {
    return redirect(onUnverifiedRedirect);
  }

  if (!can(profile, { role: opts?.role, perm: opts?.perm })) {
    return redirect(onForbiddenRedirect);
  }

  return { session, profile };
}
