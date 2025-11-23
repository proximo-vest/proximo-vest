"use client";

import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { can as canServer, AuthProfile } from "@/utils/access-core";

export function Can({
  role,
  perm,
  children,
}: {
  role?: string | string[];
  perm?: string | string[];
  children: ReactNode;
}) {
  const { data } = authClient.useSession();

  // A sessão do BetterAuth precisa conter o profile
  const profile = (data as any)?.profile as AuthProfile | undefined;

  if (!profile) return null;

  const granted = canServer(profile, { role, perm });

  if (!granted) return null;

  return <>{children}</>;
}
