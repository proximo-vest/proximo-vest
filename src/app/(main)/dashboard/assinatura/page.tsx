import { requirePageAuth } from "@/utils/access";
import { isActiveSubscription } from "@/server/subscription";
import type { Plan } from "@/generated/prisma";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 👇 importa o client component novo
import { PlansGridClient } from "./_components/plans-grid-client";

export default async function AssinaturaPage() {
  const { session, subscription, limits } = await requirePageAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
  });

  const subscriptionActive = isActiveSubscription(subscription);
  const currentPlanKey = subscription?.planKey ?? null;
  const currentPlanType = subscription?.plan?.type ?? "student";
  const billingInterval = (subscription as any)?.billingInterval ?? "MONTH";

  const res = await fetch(`${process.env.API_URL}/plans/available`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao carregar planos disponíveis.");
  }

  const plans = (await res.json()) as Plan[];

  const currentPlanConfig = currentPlanKey
    ? plans.find((p) => p.key === currentPlanKey) ?? null
    : null;

  const currentPrice =
    billingInterval === "YEAR"
      ? currentPlanConfig?.yearlyPrice ?? currentPlanConfig?.monthlyPrice ?? null
      : currentPlanConfig?.monthlyPrice ?? currentPlanConfig?.yearlyPrice ?? null;

  const currentPriceSuffix = billingInterval === "YEAR" ? "/ano" : "/mês";



  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground">
          Gerencie seu plano do Próximo Vest e veja os benefícios disponíveis
          para você.
        </p>
      </section>

      {/* Plano atual */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Seu plano atual</CardTitle>
            <CardDescription>
              Informações da sua assinatura vinculada a{" "}
              <span className="font-medium">{session.user.email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {subscription ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">
                    {currentPlanConfig?.label ?? "Plano desconhecido"}
                  </span>

                  {subscription.status === "ACTIVE" && (
                    <Badge variant="outline">Ativo</Badge>
                  )}
                  {subscription.status === "CANCEL_AT_PERIOD_END" && (
                    <Badge variant="destructive">
                      Cancelado ao fim do período
                    </Badge>
                  )}
                  {subscription.status === "CANCELED" && (
                    <Badge variant="destructive">Cancelado</Badge>
                  )}
                  {subscription.status === "EXPIRED" && (
                    <Badge variant="destructive">Expirado</Badge>
                  )}

                  <Badge variant="outline">
                    {billingInterval === "YEAR" ? "Plano anual" : "Plano mensal"}
                  </Badge>
                </div>

                {currentPlanConfig &&
                currentPlanConfig.monthlyPrice === null &&
                currentPlanConfig.yearlyPrice === null ? (
                  <p className="text-sm text-muted-foreground">
                    Este é um plano gratuito.
                  </p>
                ) : currentPrice != null ? (
                  <p className="text-sm text-muted-foreground">
                    Valor: R$ {currentPrice.toFixed(2)}
                    {currentPriceSuffix}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Não foi possível determinar o valor deste plano.
                  </p>
                )}

                {currentPlanConfig?.description && (
                  <p className="text-sm text-muted-foreground">
                    {currentPlanConfig.description}
                  </p>
                )}

                {subscription.status === "CANCEL_AT_PERIOD_END" &&
                  subscription.expiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Sua assinatura foi cancelada, mas continuará ativa até{" "}
                      <span className="font-medium">
                        {subscription.expiresAt.toLocaleDateString("pt-BR")}
                      </span>
                      .
                    </p>
                  )}

                {subscription.status === "ACTIVE" &&
                  subscription.expiresAt &&
                  subscription.expiresAt > new Date() && (
                    <p className="text-xs text-muted-foreground">
                      Renovação prevista para{" "}
                      <span className="font-medium">
                        {subscription.expiresAt.toLocaleDateString("pt-BR")}
                      </span>
                      .
                    </p>
                  )}

                {limits && (
                  <p className="text-xs text-muted-foreground">
                    Limites deste plano:{" "}
                    {currentPlanType === "student" ? (
                      <>
                        <span className="font-medium">
                          {limits.essayCreditsPerMonth} redações/mês
                        </span>{" "}
                        •{" "}
                        {limits.unlimitedQuestions
                          ? "questões ilimitadas"
                          : "questões limitadas"}
                      </>
                    ) : currentPlanType === "teacher" ? (
                      <>
                        <span className="font-medium">
                          {limits.unlimitedLists
                            ? "listas/simulados ilimitados"
                            : `${limits.listLimitPerMonth} listas/simulados por mês`}
                        </span>{" "}
                        •{" "}
                        {limits.unlimitedQuestions
                          ? "questões ilimitadas"
                          : "questões limitadas"}
                      </>
                    ) : (
                      <>Plano institucional / personalizado</>
                    )}
                  </p>
                )}

                {subscriptionActive && (
                  <div className="pt-2">
                    <ManageSubscriptionButton>
                      Gerenciar assinatura (Stripe)
                    </ManageSubscriptionButton>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Você ainda não possui uma assinatura ativa. Atualmente, está
                no plano padrão gratuito ou sem plano vinculado.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Lista de planos disponíveis + TOGGLE mensal/anual */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Escolha um plano</h2>

        {/* 👇 aqui entra o client component com o toggle + SubscribeButton */}
        <PlansGridClient
          plans={plans}
          currentPlanKey={currentPlanKey}
            userType={currentPlanType as "student" | "teacher" | "school"}
        />
      </section>
    </div>
  );
}
