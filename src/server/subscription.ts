import { prisma } from "@/lib/prisma";
import {Plan, Subscription} from "../generated/prisma";

// Status como string union (banco guarda string)
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED" | "CANCEL_AT_PERIOD_END";

export type SubscriptionWithPlan = Subscription & {
  plan: Plan;
};

// --------------------------------------
// GET SUBSCRIPTION + PLAN
// --------------------------------------

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });
}

// --------------------------------------
// CHECKS UTILS
// --------------------------------------

export function isActiveSubscription(
  sub?: { status: string; expiresAt: Date | null } | null
) {
  if (!sub) return false;

  const now = new Date();

  // Ativo normal
  if (sub.status === "ACTIVE") {
    if (sub.expiresAt && sub.expiresAt < now) return false;
    return true;
  }

  // Cancelada, mas ainda válida até o fim do período
  if (sub.status === "CANCEL_AT_PERIOD_END") {
    if (!sub.expiresAt) return true; // sem data, considera ativo
    return sub.expiresAt > now;
  }

  return false;
}

export function hasPlan(
  sub:
    | {
        status: string;
        planKey: string;
        expiresAt: Date | null;
      }
    | null
    | undefined,
  planKey: string
) {
  if (!sub) return false;
  return isActiveSubscription(sub) && sub.planKey === planKey;
}

// --------------------------------------
// UPSERT (CREATE OR UPDATE)
// --------------------------------------

type UpsertSubscriptionInput = {
  userId: string;
  planKey: string;
  status: SubscriptionStatus;
  expiresAt?: Date | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

export async function upsertSubscription(input: UpsertSubscriptionInput) {
  const { userId, ...data } = input;

  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: {
      ...data,
    },
  });
}

// --------------------------------------
// CANCEL SUBSCRIPTION (LOCAL)
// --------------------------------------

export async function cancelSubscriptionLocal(userId: string) {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status: "CANCELED",
      expiresAt: new Date(),
    },
  });
}

// --------------------------------------
// GIVE FREE PLAN / MANUAL PLAN
// --------------------------------------

export async function giveFreePlan(
  userId: string,
  planKey: string,
  days: number
) {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return upsertSubscription({
    userId,
    planKey,
    status: "ACTIVE",
    expiresAt,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  });
}

// --------------------------------------
// PLAN LIMITS (EX: REDAÇÕES POR MÊS)
// --------------------------------------
// Use a chave do plano (plan.key)
// --------------------------------------

export function getPlanLimits(planKey?: string | null) {
  switch (planKey) {
    case "STUDENT_PREMIUM":
      return { essayCredits: 3, unlimitedQuestions: true };

    case "STUDENT_ELITE":
      return { essayCredits: 20, unlimitedQuestions: true };

    case "TEACHER_PREMIUM":
      return { essayCredits: 50, unlimitedQuestions: true };

    default:
      return { essayCredits: 0, unlimitedQuestions: false };
  }
}
