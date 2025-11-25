"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleHelp } from "lucide-react";

const YEARLY_DISCOUNT = 20;

type ApiPlan = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  type: string; // "student", "school", etc.
  monthlyPrice: number;
  highlight: boolean;
  isActive: boolean;
  stripePriceId: string | null;
};

const tooltipContent = {
  student: "Plano ideal para quem está focado em ENEM e grandes vestibulares.",
  school:
    "Plano pensado para escolas, cursinhos e projetos com vários alunos conectados.",
  default:
    "Acesso aos simulados, relatórios e recursos de estudo do Próximo Vest.",
};

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PricingSection() {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBillingPeriod, setSelectedBillingPeriod] =
    useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/plans/available");
        if (!res.ok) {
          throw new Error("Erro ao carregar planos");
        }

        const data: ApiPlan[] = await res.json();

        // Filtra só ativos e com preço > 0, ordena por highlight primeiro
        const normalized = data
          .filter((plan) => plan.isActive && plan.monthlyPrice > 0)
          .sort((a, b) => Number(b.highlight) - Number(a.highlight));

        setPlans(normalized);
      } catch (err) {
        console.error(err);
        setError(
          "Não foi possível carregar os planos agora. Tente novamente em alguns instantes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  const hasPlans = plans.length > 0;
  const highlightedPlanId = plans.find((p) => p.highlight)?.id ?? plans[0]?.id;

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center py-12 md:py-16"
    >
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-400/40">
          Comece com o plano que cabe no seu momento
        </Badge>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          Planos para te acompanhar até a aprovação
        </h2>
        <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300 mx-auto">
          Ajuste os planos direto no painel de administração. Esta seção lê tudo
          da API{" "}
          <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-200 border border-slate-700">
            /api/plans/available
          </code>{" "}
          em tempo real.
        </p>
      </div>

      <Tabs
        value={selectedBillingPeriod}
        onValueChange={(value) =>
          setSelectedBillingPeriod(value as "monthly" | "yearly")
        }
        className="mt-8"
      >
        <TabsList className="h-11 px-1.5 rounded-full bg-slate-900/80 border border-slate-700">
          <TabsTrigger value="monthly" className="py-1.5 rounded-full">
            Mensal
          </TabsTrigger>
          <TabsTrigger value="yearly" className="py-1.5 rounded-full">
            Anual (economize {YEARLY_DISCOUNT}%)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-10 w-full max-w-5xl mx-auto">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl p-6 bg-slate-900/60 animate-pulse space-y-4"
              >
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-8 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-40 bg-slate-800 rounded" />
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <Separator className="my-6 bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-slate-800 rounded" />
                  <div className="h-4 w-32 bg-slate-800 rounded" />
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-sm text-red-300 mt-4">
            {error}
          </div>
        )}

        {!loading && !error && !hasPlans && (
          <div className="text-center text-sm text-slate-300 mt-4 space-y-2">
            <p>Nenhum plano ativo encontrado.</p>
            <p className="text-slate-400">
              Crie planos no painel de administração para que eles apareçam
              aqui automaticamente.
            </p>
          </div>
        )}

        {!loading && !error && hasPlans && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 mt-4">
            {plans.map((plan) => {
              const isHighlighted = plan.id === highlightedPlanId;

              const basePrice = plan.monthlyPrice;
              const effectivePrice =
                selectedBillingPeriod === "monthly"
                  ? basePrice
                  : basePrice * ((100 - YEARLY_DISCOUNT) / 100);

              const tooltip =
                tooltipContent[
                  plan.type as keyof typeof tooltipContent
                ] ?? tooltipContent.default;

              const isStudent = plan.type === "student";

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative border rounded-2xl p-6 bg-slate-900/70 flex flex-col h-full",
                    "border-slate-800",
                    isHighlighted &&
                      "border-emerald-400 bg-linear-to-b from-emerald-500/10 via-slate-900 to-slate-950 shadow-xl shadow-emerald-500/30"
                  )}
                >
                  {isHighlighted && (
                    <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-900">
                      Mais escolhido
                    </Badge>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold tracking-tight">
                        {plan.label}
                      </h3>
                      <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                        {isStudent ? "Para estudantes" : "Plano Próximo Vest"}
                      </span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <CircleHelp className="h-4 w-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        {tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <p className="mt-4 text-3xl font-semibold">
                    R$ {formatPrice(effectivePrice)}
                    <span className="ml-1.5 text-xs text-slate-400 font-normal">
                      /mês
                    </span>
                  </p>

                  {selectedBillingPeriod === "yearly" && (
                    <p className="text-[11px] text-emerald-300 mt-1">
                      Equivalente a R$ {formatPrice(basePrice)} por mês (com{" "}
                      {YEARLY_DISCOUNT}% de desconto no anual)
                    </p>
                  )}

                  <p className="mt-4 text-sm text-slate-300 line-clamp-3">
                    {plan.description || "Acesso completo ao plano selecionado."}
                  </p>

                  <Button
                    size="lg"
                    className={cn(
                      "w-full mt-6 text-sm font-medium",
                      isHighlighted
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "bg-slate-800 hover:bg-slate-700"
                    )}
                    asChild
                  >
                    <a href={`/auth/sign-in?plan=${plan.key}`}>
                      Começar com este plano
                    </a>
                  </Button>

                  <Separator className="my-6 bg-slate-800" />

                  <ul className="space-y-2 text-sm text-slate-200 flex-1">
                    <li className="flex items-start gap-2">
                      <CircleCheck className="h-4 w-4 mt-1 text-emerald-400" />
                      <span>
                        Acesso aos simulados de ENEM e vestibulares disponíveis
                        na plataforma.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="h-4 w-4 mt-1 text-emerald-400" />
                      <span>Relatórios de desempenho por área e matéria.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheck className="h-4 w-4 mt-1 text-emerald-400" />
                      <span>
                        Histórico de simulados para acompanhar sua evolução até
                        a prova.
                      </span>
                    </li>
                    {isStudent && (
                      <li className="flex items-start gap-2">
                        <CircleCheck className="h-4 w-4 mt-1 text-emerald-400" />
                        <span>
                          Pensado para a rotina de quem está se preparando para
                          o vestibular.
                        </span>
                      </li>
                    )}
                  </ul>

                  <p className="mt-4 text-[11px] text-slate-500">
                    O pagamento, cobrança recorrente e cancelamento são
                    gerenciados pelo Stripe via portal de assinaturas.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
