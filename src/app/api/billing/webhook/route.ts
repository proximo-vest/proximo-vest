import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Use uma apiVersion real e estável (ou remova para usar a do dashboard)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️ Erro webhook:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("🔔 Stripe webhook recebido:", event.type);

  switch (event.type) {
    //
    // 1) Checkout finalizado com sucesso
    //
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const planKey = session.metadata?.planKey;

      if (!userId || !planKey) {
        console.warn(
          "checkout.session.completed sem userId/planKey na metadata"
        );
        break;
      }

      const stripeSubscriptionId = session.subscription as string | null;

      let expiresAt: Date | null = null;
      if (stripeSubscriptionId) {
        try {
          const sub: any = await stripe.subscriptions.retrieve(
            stripeSubscriptionId
          );
          const periodEndUnix: number | undefined =
            sub.current_period_end ??
            sub.current_period?.end ??
            undefined;

          if (periodEndUnix) {
            expiresAt = new Date(periodEndUnix * 1000);
          }
        } catch (err) {
          console.warn("Não foi possível buscar subscription no Stripe:", err);
        }
      }

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          planKey,
          status: "ACTIVE",
          stripeSubscriptionId: stripeSubscriptionId ?? undefined,
          expiresAt,
        },
        create: {
          userId,
          planKey,
          status: "ACTIVE",
          stripeSubscriptionId: stripeSubscriptionId ?? undefined,
          expiresAt,
        },
      });

      console.log("✅ Subscription criada/atualizada após checkout", {
        userId,
        planKey,
        stripeSubscriptionId,
      });

      break;
    }

    //
    // 2) Criação / atualização da assinatura (inclui cancelamento ao fim do período)
    //
 case "customer.subscription.created":
case "customer.subscription.updated": {
  const rawSub: any = event.data.object;
  const stripeSubscriptionId: string = rawSub.id;

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  let userId: string | null =
    existing?.userId ?? rawSub.metadata?.userId ?? null;
  const planKey: string | null =
    rawSub.metadata?.planKey ?? existing?.planKey ?? null;

  if (!userId) {
    console.warn(
      "subscription.created/updated sem userId (nem no DB nem na metadata)",
      { stripeSubscriptionId }
    );
    break;
  }

  const status: string = rawSub.status;

  const isActiveStripe =
    status === "active" || status === "trialing";

  const cancelAtPeriodEnd: boolean =
    rawSub.cancel_at_period_end ?? false;

  const cancelAtUnix: number | undefined = rawSub.cancel_at; // NOVO: cancel_at

  // pega o "fim" da assinatura na seguinte ordem:
  // 1) cancel_at (se existir)
  // 2) current_period_end
  // 3) current_period.end
  const periodEndUnix: number | undefined =
    cancelAtUnix ??
    rawSub.current_period_end ??
    rawSub.current_period?.end ??
    undefined;

  const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

  // se tiver cancelamento agendado (via cancel_at OU cancel_at_period_end)
  const hasScheduledCancel =
    !!cancelAtUnix || cancelAtPeriodEnd;

  let localStatus:
    | "ACTIVE"
    | "CANCEL_AT_PERIOD_END"
    | "CANCELED"
    | "EXPIRED";

  if (status === "canceled") {
    // já acabou no Stripe
    localStatus = "CANCELED";
  } else if (hasScheduledCancel) {
    // ainda ativo no Stripe, mas com cancelamento programado
    localStatus = "CANCEL_AT_PERIOD_END";
  } else if (isActiveStripe) {
    localStatus = "ACTIVE";
  } else {
    localStatus = "EXPIRED";
  }

  const resolvedPlanKey: string | undefined =
  planKey ?? existing?.planKey ?? undefined;
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planKey: resolvedPlanKey,
      status: localStatus,
      stripeSubscriptionId,
      expiresAt: periodEnd,
    },
    create: {
      userId,
      planKey: planKey ?? "unknown",
      status: localStatus,
      stripeSubscriptionId,
      expiresAt: periodEnd,
    },
  });

  console.log("✅ Subscription atualizada (created/updated)", {
    eventType: event.type,
    userId,
    planKey: planKey ?? existing?.planKey,
    stripeSubscriptionId,
    localStatus,
    expiresAt: periodEnd,
  });

  break;
}


    //
    // 3) Assinatura deletada (caso extremo)
    //
    case "customer.subscription.deleted": {
      const rawSub: any = event.data.object;
      const stripeSubscriptionId: string = rawSub.id;

      const existing = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId },
      });

      let userId: string | null =
        existing?.userId ?? rawSub.metadata?.userId ?? null;

      if (!userId) {
        console.warn(
          "customer.subscription.deleted sem userId (nem no DB nem na metadata)",
          { stripeSubscriptionId }
        );
        break;
      }

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: "CANCELED",
          expiresAt: new Date(),
        },
      });

      console.log("✅ Subscription marcada como CANCELED (deleted)", {
        userId,
        stripeSubscriptionId,
      });

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
