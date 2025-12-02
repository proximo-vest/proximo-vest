"use client";

import { useState, useMemo } from "react";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BillingInterval = "MONTH" | "YEAR";

type Plan = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  type: string; // "student" | "teacher" | "school"
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  highlight: boolean;
  isActive: boolean;
};

type Props = {
  plans: Plan[];
  currentPlanKey: string | null;
  userType: "student" | "teacher" | "school";
};

export function PlansGridClient({ plans, currentPlanKey, userType }: Props) {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("MONTH");

  // 🔒 Filtra planos de acordo com o tipo do usuário
  const visiblePlans = useMemo(() => {
    if (userType === "student") {
      return plans.filter((p) => p.type === "student");
    }
    if (userType === "teacher") {
      return plans.filter((p) => p.type === "teacher");
    }
    // se for "school" ou algo diferente, por enquanto mostra tudo
    return plans;
  }, [plans, userType]);

  const hasPlans = visiblePlans.length > 0;

  if (!hasPlans) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum plano disponível para o seu perfil no momento.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle Mensal/Anual */}
      <Tabs
        value={billingInterval}
        onValueChange={(value) =>
          setBillingInterval(value as BillingInterval)
        }
        className="w-full md:w-auto"
      >
        <TabsList className="h-9 px-1 rounded-full bg-muted border border-border">
          <TabsTrigger
            value="MONTH"
            className="py-1 px-4 rounded-full text-xs"
          >
            Mensal
          </TabsTrigger>
          <TabsTrigger
            value="YEAR"
            className="py-1 px-4 rounded-full text-xs"
          >
            Anual
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visiblePlans.map((plan) => {
          const isCurrent = plan.key === currentPlanKey;
          const isFree =
            plan.monthlyPrice === null && plan.yearlyPrice === null;

          let price: number | null = null;
          let suffix = "";

          if (!isFree) {
            if (billingInterval === "YEAR") {
              price = plan.yearlyPrice ?? plan.monthlyPrice ?? null;
              suffix = plan.yearlyPrice !== null ? "/ano" : "/mês";
            } else {
              price = plan.monthlyPrice ?? plan.yearlyPrice ?? null;
              suffix = plan.monthlyPrice !== null ? "/mês" : "/ano";
            }
          }

          return (
            <Card
              key={plan.id}
              className={plan.highlight ? "border-primary shadow-sm" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {plan.label}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {plan.highlight && <Badge>Recomendado</Badge>}
                    {isCurrent && (
                      <Badge variant="outline">Seu plano</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isFree ? (
                    "Gratuito"
                  ) : price !== null ? (
                    <>
                      R$ {price.toFixed(2)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {suffix}
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tipo:{" "}
                  {plan.type === "student"
                    ? "Aluno"
                    : plan.type === "teacher"
                    ? "Professor"
                    : "Escola"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {isCurrent ? (
                  <Badge variant="outline">Plano atual</Badge>
                ) : (
                  <SubscribeButton
                    planKey={plan.key}
                    interval={billingInterval}
                  />
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
