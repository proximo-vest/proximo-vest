import { prisma } from "@/lib/prisma";

export async function getAllPlans(includeInactive = false) {
  return prisma.plan.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { monthlyPrice: "asc" },
  });
}

export async function getPlanByKey(key: string) {
  return prisma.plan.findUnique({ where: { key } });
}

export async function createPlan(data: {
  key: string;
  label: string;
  description: string;
  type: string;
  monthlyPrice: number | null;
  highlight?: boolean;
}) {
  return prisma.plan.create({ data });
}

export async function updatePlan(key: string, data: Partial<{
  label: string;
  description: string;
  type: string;
  monthlyPrice: number | null;
  highlight: boolean;
  isActive: boolean;
}>) {
  return prisma.plan.update({ where: { key }, data });
}

export async function togglePlanActive(key: string, isActive: boolean) {
  return prisma.plan.update({
    where: { key },
    data: { isActive },
  });
}
