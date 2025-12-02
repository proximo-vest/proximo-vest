"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  FileText,
  Users2,
  ListChecks,
  BarChart3,
} from "lucide-react";

type TeacherList = {
  id: string;
  title: string;
  questionsCount: number;
  createdAt: string;
};

type TeacherClass = {
  id: string;
  name: string;
  studentsCount: number;
};

type TeacherOverview = {
  averageScore?: number | null;
  totalStudents?: number | null;
  totalSimulados?: number | null;
};

type TeacherDashboardProps = {
  name: string;
  lists: TeacherList[];
  classes: TeacherClass[];
  overview: TeacherOverview;
};

export function TeacherDashboard({
  name,
  lists,
  classes,
  overview,
}: TeacherDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, professor(a) {name} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie simulados, acompanhe o desempenho das suas turmas e gerencie
            seus alunos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Criar simulado / lista
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Desempenho geral dos alunos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Desempenho geral dos alunos
              </CardTitle>
              <CardDescription>
                Visão rápida dos resultados das suas turmas nos simulados.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Média geral dos alunos
                </p>
                <p className="text-xl font-semibold">
                  {overview.averageScore != null
                    ? `${overview.averageScore.toFixed(0)}%`
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Alunos acompanhados
                </p>
                <p className="text-xl font-semibold">
                  {overview.totalStudents ?? "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Simulados aplicados
                </p>
                <p className="text-xl font-semibold">
                  {overview.totalSimulados ?? "--"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Minhas listas criadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Minhas listas / simulados
              </CardTitle>
              <CardDescription>
                Acompanhe e reutilize as listas que você já criou.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lists.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Você ainda não criou nenhuma lista. Comece criando a primeira.
                </p>
              ) : (
                <div className="space-y-2">
                  {lists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{list.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {list.questionsCount} questões • Criado em{" "}
                          {list.createdAt}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita (1/3) */}
        <div className="space-y-6">
          {/* Minhas turmas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users2 className="h-4 w-4 text-primary" />
                Minhas turmas
              </CardTitle>
              <CardDescription>
                Gestão das turmas vinculadas ao seu perfil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {classes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma turma cadastrada ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {classes.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {c.studentsCount} alunos
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
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
                Gerencie seu plano de professor e faça upgrade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* TODO: Substituir pelo componente real de assinatura */}
              <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <p>
                  Plano atual:{" "}
                  <span className="font-medium">Professor Mensal</span>
                </p>
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
