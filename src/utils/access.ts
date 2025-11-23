import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserSubscription } from "@/server/subscription";
import { getPlanLimits, isActiveSubscription } from "@/server/subscription";

import {
  AuthProfile,
  RoleName,
  PermissionKey,
  hasRole,
  hasPermission,
  can,
} from "./access-core"; // 👈 importa do core

// ============================================================================
// SESSÃO (Server only)
// ============================================================================

export async function getSessionOrNull() {
  const hdrs = Object.fromEntries((await headers()).entries());
  return auth.api.getSession({ headers: hdrs });
}

// ============================================================================
// CARREGA PERFIL DE AUTORIZAÇÃO (Server only)
// ============================================================================

export async function getAuthProfile(
  userId: string
): Promise<AuthProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      status: true,
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

  // ----- ROLES -----
  const roleNames = (user.roles ?? [])
    .filter((r) => r.role?.isActive)
    .map((r) => r.role!.name);

  // ----- PERMISSÕES VIA ROLE -----
  const fromRoles: Record<PermissionKey, boolean> = {};

  for (const ur of user.roles ?? []) {
    if (!ur.role?.isActive) continue;

    for (const rp of ur.role.perms ?? []) {
      if (!rp.permission?.isActive) continue;
      fromRoles[rp.permission.key] = rp.granted;
    }
  }

  // ----- PERMISSÕES DIRETAS (override) -----
  const direct: Record<PermissionKey, boolean> = {};

  for (const up of user.directPerms ?? []) {
    if (!up.permission?.isActive) continue;
    direct[up.permission.key] = up.granted;
  }

  // ----- MERGE FINAL -----
  const merged = { ...fromRoles, ...direct };

  const permsArray = Object.entries(merged)
    .filter(([, granted]) => granted)
    .map(([key]) => key);

  return {
    emailVerified: user.emailVerified,
    status: user.status as "active" | "suspended" | "deleted",
    roles: roleNames,
    perms: permsArray,
  };
}

export async function requireAPIAuth(opts?: {
  role?: RoleName | RoleName[];
  perm?: PermissionKey | PermissionKey[];
  emailVerified?: boolean;
  blockSuspended?: boolean;
  blockDeleted?: boolean;
}) {
  const session = await getSessionOrNull();

  if (!session?.user?.id) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profile = await getAuthProfile(session.user.id as string);
  if (!profile) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const blockSuspended = opts?.blockSuspended ?? true;
  const blockDeleted = opts?.blockDeleted ?? true;

  if (blockDeleted && profile.status === "deleted") {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "DeletedAccount" }, { status: 403 }),
    };
  }

  if (blockSuspended && profile.status === "suspended") {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Suspended" }, { status: 403 }),
    };
  }

  if (opts?.emailVerified && !profile.emailVerified) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "EmailNotVerified" }, { status: 403 }),
    };
  }

  if (!can(profile, { role: opts?.role, perm: opts?.perm })) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, session, profile };
}

// ============================================================================
// REQUIRE PAGE AUTH (Server only)
// ============================================================================

// ============================================================================
// REQUIRE PAGE AUTH (Server only) – versão com Assinatura + Limites
// ============================================================================
export async function requirePageAuth(opts?: {
  role?: RoleName | RoleName[];
  perm?: PermissionKey | PermissionKey[];
  emailVerified?: boolean;
  blockSuspended?: boolean;
  blockDeleted?: boolean;

  onUnauthorizedRedirect?: string;
  onUnverifiedRedirect?: string;
  onSuspendedRedirect?: string;
  onDeletedRedirect?: string;
  onForbiddenRedirect?: string;
}) {
  const {
    onUnauthorizedRedirect = "/auth/login",
    onUnverifiedRedirect = "/verify-email",
    onSuspendedRedirect = "/suspended",
    onDeletedRedirect = "/deleted",
    onForbiddenRedirect = "/dashboard",
  } = opts ?? {};

  const session = await getSessionOrNull();
  const { redirect } = await import("next/navigation");

  if (!session?.user?.id) {
    return redirect(onUnauthorizedRedirect);
  }

  const profile = await getAuthProfile(session.user.id as string);
  if (!profile) {
    return redirect(onUnauthorizedRedirect);
  }

  const blockSuspended = opts?.blockSuspended ?? true;
  const blockDeleted = opts?.blockDeleted ?? true;

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

  // -------- ASSINATURA --------
  const subscription = await getUserSubscription(session.user.id as string);
  const subscriptionActive = isActiveSubscription(subscription);
  const limits = getPlanLimits(subscription?.planKey ?? null);

  return {
    session,
    profile,
    subscription,
    subscriptionActive,
    limits,
  };
}