import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { requireAPIAuth } from "@/utils/access";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const auth = await requireAPIAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  if (!auth.ok) return auth.res;

  const { session } = auth;
  const userId = session.user.id as string;

  // Busca assinatura do usuário (pra pegar stripeCustomerId)
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      {
        error:
          "Nenhum cliente Stripe vinculado. Faça uma assinatura primeiro antes de gerenciar o billing.",
      },
      { status: 400 }
    );
  }

  const returnUrl =
    process.env.NEXT_PUBLIC_APP_URL?.concat("/dashboard/assinatura") ??
    "http://localhost:3000/dashboard/assinatura";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: portalSession.url });
}
