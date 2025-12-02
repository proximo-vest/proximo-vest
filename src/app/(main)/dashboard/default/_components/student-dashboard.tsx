"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  BarChart3,
  Clock,
  FileText,
  CalendarDays,
} from "lucide-react";

type RecentSimulado = {
  id: string;
  title: string;
  date: string;
  scorePercent?: number | null;
};

type UpcomingExam = {
  id: string;
  name: string;
  date: string;
  board?: string | null;
};

type StudentDashboardProps = {
  name: string;
  overallProgressPercent: number;
  recentSimulados: RecentSimulado[];
  upcomingExams: UpcomingExam[];
};

export function StudentDashboard({
  name,
  overallProgressPercent,
  recentSimulados,
  upcomingExams,
}: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, {name} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe seus simulados, veja seu progresso e continue treinando
            para os vestibulares.
          </p>
        </div>

        <Button size="lg" className="gap-2">
          <FileText className="h-4 w-4" />
          Fazer simulado
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Progresso geral */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Progresso geral
                </CardTitle>
                <CardDescription>
                  Baseado nos simulados realizados na plataforma.
                </CardDescription>
              </div>
              <span className="text-sm font-medium">
                {overallProgressPercent.toFixed(0)}%
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={overallProgressPercent} />
              <p className="text-xs text-muted-foreground">
                Continue fazendo simulados para melhorar ainda mais seu
                desempenho.
              </p>
            </CardContent>
          </Card>

          {/* Últimos simulados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Últimos simulados feitos
              </CardTitle>
              <CardDescription>
                Veja como você foi nos simulados mais recentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSimulados.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Você ainda não fez nenhum simulado. Comece agora mesmo!
                </p>
              ) : (
                <div className="space-y-2">
                  {recentSimulados.map((sim) => (
                    <div
                      key={sim.id}
                      className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{sim.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {sim.date}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        {sim.scorePercent != null && (
                          <span className="text-sm font-semibold">
                            {sim.scorePercent.toFixed(0)}%
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita (1/3) */}
        <div className="space-y-6">
          {/* Próximas provas / vestibulares */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Próximas provas / vestibulares
              </CardTitle>
              <CardDescription>
                Fique de olho nas datas importantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma prova cadastrada por enquanto.
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="rounded-md border bg-card px-3 py-2 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{exam.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {exam.date}
                        </span>
                      </div>
                      {exam.board && (
                        <p className="text-xs text-muted-foreground">
                          {exam.board}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assinatura / upgrade – trocar pelo componente real depois */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sua assinatura</CardTitle>
              <CardDescription>
                Gerencie seu plano e faça upgrade quando precisar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* TODO: Substituir por componente real de assinatura */}
              <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <p>Plano atual: <span className="font-medium">Aluno Mensal</span></p>
                <p>Renova em: 12/12/2025</p>
              </div>
              <Separator />
              <Button variant="outline" className="w-full justify-between">
                Gerenciar assinatura
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
