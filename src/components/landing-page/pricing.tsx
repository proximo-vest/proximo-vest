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

type BillingPeriod = "monthly" | "yearly";
type Audience = "student" | "teacher" | "school";

type ApiPlan = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  type: string; // "student", "teacher", "school"
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  highlight: boolean;
  isActive: boolean;
  stripePriceId: string | null;
};

const tooltipContent: Record<string, string> = {
  student:
    "Plano ideal para quem está focado em ENEM e grandes vestibulares.",
  teacher:
    "Plano pensado para professores que criam simulados e listas para seus alunos.",
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
    useState<BillingPeriod>("monthly");
  const [selectedAudience, setSelectedAudience] =
    useState<Audience>("student");

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

        const normalized = data
          .filter(
            (plan) =>
              plan.isActive &&
              (plan.monthlyPrice !== null || plan.yearlyPrice !== null)
          )
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

  const isSchoolAudience = selectedAudience === "school";

  const audiencePlans = plans.filter(
    (plan) => plan.type === selectedAudience
  );
  const hasPlans = audiencePlans.length > 0;

  const highlightedPlanId =
    audiencePlans.find((p) => p.highlight)?.id ?? audiencePlans[0]?.id;

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center py-12 md:py-16"
    >
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-400/15 text-emerald-200 border-emerald-400/50">
          Comece com o plano que cabe no seu momento
        </Badge>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
          Planos para te acompanhar até a aprovação
        </h2>
        <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300 mx-auto">
          Ajuste os planos direto no painel de administração. Esta seção lê tudo
          da API{" "}
          <code className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] text-slate-100 border border-slate-700">
            /api/plans/available
          </code>{" "}
          em tempo real.
        </p>
      </div>

      {/* Tabs por tipo: alunos / professores / escolas */}
      <Tabs
        value={selectedAudience}
        onValueChange={(value) => setSelectedAudience(value as Audience)}
        className="mt-6"
      >
        <TabsList className="h-11 px-1.5 rounded-full bg-slate-900/70 border border-slate-700/80">
          <TabsTrigger value="student" className="py-1.5 rounded-full">
            Para estudantes
          </TabsTrigger>
          <TabsTrigger value="teacher" className="py-1.5 rounded-full">
            Para professores
          </TabsTrigger>
          <TabsTrigger value="school" className="py-1.5 rounded-full">
            Para escolas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tabs de período só fazem sentido para aluno/professor */}
      {!isSchoolAudience && (
        <Tabs
          value={selectedBillingPeriod}
          onValueChange={(value) =>
            setSelectedBillingPeriod(value as BillingPeriod)
          }
          className="mt-4"
        >
          <TabsList className="h-11 px-1.5 rounded-full bg-slate-900/70 border border-slate-700/80">
            <TabsTrigger value="monthly" className="py-1.5 rounded-full">
              Mensal
            </TabsTrigger>
            <TabsTrigger value="yearly" className="py-1.5 rounded-full">
              Anual
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="mt-10 w-full max-w-4xl mx-auto">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-slate-700/80 rounded-2xl p-6 bg-slate-900/50 backdrop-blur-sm animate-pulse space-y-4"
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

        {!loading && !error && isSchoolAudience && (
          <div className="mt-6 max-w-xl mx-auto text-center border border-slate-700/80 rounded-2xl p-6 bg-slate-900/60 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-50">
              Planos para escolas e instituições
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              Os planos para escolas, cursinhos e projetos educacionais são
              personalizados e definidos sob conversa, de acordo com o número
              de alunos, turmas e necessidades da instituição.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Entre em contato com nossa equipe para montar uma proposta
              completa de parceria para sua escola.
            </p>
          </div>
        )}

        {!loading && !error && !isSchoolAudience && !hasPlans && (
          <div className="text-center text-sm text-slate-200 mt-4 space-y-2">
            <p>Nenhum plano ativo encontrado para esse tipo.</p>
            <p className="text-slate-400">
              Crie planos no painel de administração para que eles apareçam
              aqui automaticamente.
            </p>
          </div>
        )}

        {!loading && !error && !isSchoolAudience && hasPlans && (
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-6 mt-4">
            {audiencePlans.map((plan) => {
              const isHighlighted = plan.id === highlightedPlanId;

              const monthlyPrice = plan.monthlyPrice ?? null;
              const yearlyPrice = plan.yearlyPrice ?? null;

              let displayPrice: number | null;
              let displaySuffix: "/mês" | "/ano";

              if (selectedBillingPeriod === "monthly") {
                displayPrice = monthlyPrice ?? yearlyPrice;
                displaySuffix = monthlyPrice !== null ? "/mês" : "/ano";
              } else {
                displayPrice = yearlyPrice ?? monthlyPrice;
                displaySuffix = yearlyPrice !== null ? "/ano" : "/mês";
              }

              let effectiveMonthlyFromYearly: number | null = null;
              let discountPercent: number | null = null;

              if (
                selectedBillingPeriod === "yearly" &&
                yearlyPrice !== null &&
                monthlyPrice !== null &&
                yearlyPrice > 0 &&
                monthlyPrice > 0
              ) {
                effectiveMonthlyFromYearly = yearlyPrice / 12;
                const discount =
                  100 - (effectiveMonthlyFromYearly / monthlyPrice) * 100;
                discountPercent = Math.round(discount);
              }

              const tooltip =
                tooltipContent[plan.type] ?? tooltipContent.default;

              let audienceLabel = "Plano Próximo Vest";
              if (plan.type === "student") audienceLabel = "Para estudantes";
              if (plan.type === "teacher") audienceLabel = "Para professores";
              if (plan.type === "school") audienceLabel = "Para escolas";

              const isStudent = plan.type === "student";

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative border rounded-2xl p-6 flex flex-col h-full",
                    "border-slate-700/80 bg-slate-900/60 backdrop-blur-sm shadow-sm",
                    isHighlighted &&
                      "border-emerald-400/90 bg-linear-to-b from-emerald-500/18 via-slate-900 to-slate-950 shadow-xl shadow-emerald-500/25"
                  )}
                >
                  {isHighlighted && (
                    <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-400 text-slate-950">
                      Mais escolhido
                    </Badge>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold tracking-tight text-slate-50">
                        {plan.label}
                      </h3>
                      <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                        {audienceLabel}
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

                  {displayPrice !== null ? (
                    <p className="mt-4 text-3xl font-semibold text-slate-50">
                      R$ {formatPrice(displayPrice)}
                      <span className="ml-1.5 text-xs text-slate-300 font-normal">
                        {displaySuffix}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-4 text-lg font-semibold text-slate-100">
                      Sob consulta
                    </p>
                  )}

                  {selectedBillingPeriod === "yearly" &&
                    effectiveMonthlyFromYearly !== null &&
                    discountPercent !== null && (
                      <p className="text-[11px] text-emerald-300 mt-1">
                        Equivalente a R$ {formatPrice(effectiveMonthlyFromYearly)} por
                        mês (economia de {discountPercent}% em relação ao mensal).
                      </p>
                    )}

                  <p className="mt-4 text-sm text-slate-200 line-clamp-3">
                    {plan.description ||
                      "Acesso completo ao plano selecionado."}
                  </p>

                  <Button
                    size="lg"
                    className={cn(
                      "w-full mt-6 text-sm font-medium",
                      isHighlighted
                        ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                        : "bg-slate-800/80 text-slate-50 hover:bg-slate-700"
                    )}
                    asChild
                  >
                    <a href={`/auth/sign-in?plan=${plan.key}`}>
                      Começar com este plano
                    </a>
                  </Button>

                  <Separator className="my-6 bg-slate-800" />

                  <ul className="space-y-2 text-sm text-slate-100 flex-1">
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

                  <p className="mt-4 text-[11px] text-slate-400">
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
