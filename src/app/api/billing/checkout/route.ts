import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
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

  const body = await req.json();
  const { planKey, couponCode } = body;

  if (!planKey) {
    return NextResponse.json(
      { error: "planKey é obrigatório." },
      { status: 400 }
    );
  }

  // Buscar plano
  const plan = await prisma.plan.findUnique({
    where: { key: planKey },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 404 });
  }

  if (!plan.stripePriceId) {
    return NextResponse.json(
      { error: "Este plano não possui stripePriceId configurado." },
      { status: 500 }
    );
  }

  // Buscar assinatura atual do user
  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  // Se já existir stripeCustomerId, usa
  let customerId = sub?.stripeCustomerId ?? null;

  // Se ainda não existir, cria um customer novo
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name!,
    });
    customerId = customer.id;

    // salvar customerId no banco
    if (sub) {
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          planKey: plan.key,
          status: "ACTIVE",
          stripeCustomerId: customerId,
        },
      });
    }
  }

  // Criar checkout session
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?canceled=true`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
        planKey: plan.key,
      },
    },
    metadata: {
      userId: session.user.id,
      planKey: plan.key,
    },
  };

  if (couponCode) {
    params.discounts = [{ coupon: couponCode }];
  }

  const checkout = await stripe.checkout.sessions.create(params);

  return NextResponse.json({ url: checkout.url });
}
