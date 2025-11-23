import { requirePageAuth } from "@/utils/access";
import { prisma } from "@/lib/prisma";
import { PlansAdminClient } from "./_components/plans-admin-client";

export default async function PlansAdminPage() {
  await requirePageAuth({

    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard",
  });

    const res = await fetch(`${process.env.API_URL}/plans/list`, {});

  if (!res.ok) throw new Error("Falha ao buscar os planos");

  const plans = await res.json();



  return <PlansAdminClient initialPlans={plans} />;
}
