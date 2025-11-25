// src/app/page.tsx

import { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Sparkles,
  BarChart3,
  Brain,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import PricingSection from "../../components/landing-page/pricing";

export const metadata: Metadata = {
  title: "Próximo Vest – Simulados inteligentes para ENEM e vestibulares",
  description:
    "Simulados inteligentes, correção com IA e análise de desempenho para você chegar mais preparado aos principais vestibulares do Brasil.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-400/40">
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight text-slate-50">
                Próximo Vest
              </span>
              <span className="text-[11px] text-slate-400">
                ENEM • Fuvest • Unicamp • +++
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a
              href="#como-funciona"
              className="hover:text-slate-50 transition-colors"
            >
              Como funciona
            </a>
            {/* aponta pro mesmo bloco de como funciona / vantagens */}
            <a
              href="#como-funciona"
              className="hover:text-slate-50 transition-colors"
            >
              Vantagens
            </a>
            <a
              href="#planos"
              className="hover:text-slate-50 transition-colors"
            >
              Planos
            </a>
            <a href="#faq" className="hover:text-slate-50 transition-colors">
              Dúvidas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/auth/sign-in" className="text-slate-200">
                Entrar
              </a>
            </Button>
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              <a href="#planos">
                Começar agora
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1">
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
            <div className="space-y-6">
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-400/40">
                Novo • Plataforma focada em vestibulares
              </Badge>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-50">
                  Simulados inteligentes para levar você{" "}
                  <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                    do agora até a aprovação
                  </span>
                  .
                </h1>
                <p className="text-sm md:text-base text-slate-200 max-w-xl">
                  O Próximo Vest reúne simulados de ENEM e grandes vestibulares,
                  correção com IA e análise de desempenho para você estudar com
                  estratégia, não no escuro.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <a href="#planos">
                    Ver planos disponíveis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-100 hover:bg-slate-900/60"
                  asChild
                >
                  <a href="#como-funciona">Ver como funciona</a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Correção com apoio de IA
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Focado em ENEM e vestibulares
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Relatórios de desempenho
                </div>
              </div>
            </div>

            {/* “Mock” do dashboard */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-emerald-500/20 -z-10" />
              <Card className="bg-slate-900/80 border-slate-700/70 shadow-xl shadow-emerald-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm text-slate-50">
                    <span>Seu painel Próximo Vest</span>
                    <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      visão estratégica
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Acompanhe seus simulados, evolução por área e próximos
                    passos sugeridos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-3">
                      <p className="text-slate-400">Simulados feitos</p>
                      <p className="mt-1 text-lg font-semibold text-slate-50">
                        12
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-3">
                      <p className="text-slate-400">% acerto geral</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-300">
                        74%
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-3">
                      <p className="text-slate-400">Redações</p>
                      <p className="mt-1 text-lg font-semibold text-sky-300">
                        +8
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-slate-100">
                      Próximo passo sugerido
                    </p>
                    <p className="text-slate-400">
                      Refaça um simulado de Linguagens focando em interpretação
                      de texto. Seus últimos acertos ficaram abaixo da média
                      nessa área.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section
          id="como-funciona"
          className="border-b border-white/5 bg-slate-950"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
                Como o Próximo Vest te ajuda a estudar com estratégia
              </h2>
              <p className="text-sm md:text-base text-slate-200">
                Mais do que “só resolver questões”: você entende onde está
                errando, ajusta o foco e acompanha sua evolução até o dia da
                prova.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-slate-900/60 border-slate-700/70">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-emerald-300" />
                    </div>
                    <CardTitle className="text-sm text-slate-50">
                      Simulados focados em vestibular
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300">
                    Simulados com cara de prova real: ENEM, grandes vestibulares
                    e simulados proprietários organizados por área.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-700/70">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-sky-500/15 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-sky-300" />
                    </div>
                    <CardTitle className="text-sm text-slate-50">
                      Análises e relatórios claros
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300">
                    Veja seus pontos fortes e fracos por área, matéria e
                    habilidade – com recomendações de próximos passos.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-700/70">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    </div>
                    <CardTitle className="text-sm text-slate-50">
                      Rotina sob controle
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300">
                    Acompanhe tudo em um só lugar: simulados feitos, acertos,
                    tempo de prova e histórico de evolução.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* PLANOS – integra com /api/plans/available */}
        <section
          id="planos"
          className="border-b border-white/5 bg-slate-950/70"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
                Escolha o plano que te acompanha até a aprovação
              </h2>
              <p className="text-sm md:text-base text-slate-200">
                Os planos abaixo são carregados automaticamente da API{" "}
                <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-emerald-200 border border-slate-700">
                  /api/plans/available
                </code>
                . Ajuste os valores direto no painel e tudo aparece aqui.
              </p>
            </div>

            <PricingSection />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
                Dúvidas frequentes
              </h2>
              <p className="text-sm md:text-base text-slate-200">
                Algumas perguntas que costumam aparecer antes de começar a usar
                o Próximo Vest.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-200">
              <div className="space-y-1.5">
                <p className="font-medium text-slate-50">
                  O Próximo Vest é focado em qual prova?
                </p>
                <p>
                  O foco principal é ENEM e os vestibulares mais concorridos,
                  mas a plataforma é flexível para você treinar por edição,
                  área ou simulado específico.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-slate-50">
                  Preciso assinar para testar a plataforma?
                </p>
                <p>
                  Isso depende de como você configurar os planos, mas você pode
                  ter um plano com período de teste gratuito. A lógica de planos
                  é toda centralizada na API de billing.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-slate-50">
                  Posso cancelar a qualquer momento?
                </p>
                <p>
                  Sim. O cancelamento é feito pelo portal de assinaturas e o
                  acesso permanece até o fim do período já pago.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-slate-50">
                  A correção usa IA? Ela substitui o professor?
                </p>
                <p>
                  A IA ajuda a dar feedback rápido e apontar padrões. A ideia é
                  somar ao seu estudo, não substituir o olhar de um professor ou
                  de uma banca oficial.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Próximo Vest. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Termos de uso
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
