"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Filter,
  ListChecks,
  ListPlus,
  Search,
  Trash2,
} from "lucide-react";
import { questionBank, type QuestionBankItem } from "@/data/question-bank";

const DIFFICULTIES: QuestionBankItem["difficulty"][] = [
  "Fácil",
  "Médio",
  "Difícil",
];

export function ListBuilder() {
  const [search, setSearch] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    QuestionBankItem["difficulty"][]
  >([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [listTitle, setListTitle] = useState("Lista de exercícios do professor");
  const [notes, setNotes] = useState(
    "Inclua instruções rápidas para os alunos. Ex: responder no caderno e fotografar."
  );

  const subjects = useMemo(
    () => Array.from(new Set(questionBank.map((q) => q.subject))).sort(),
    []
  );

  const filteredQuestions = useMemo(() => {
    return questionBank.filter((question) => {
      const matchesSearch =
        search.trim().length === 0 ||
        [
          question.subject,
          question.skill,
          question.source,
          question.tags?.join(" ") ?? "",
          question.numberLabel,
          question.year.toString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(question.difficulty);

      const matchesSubject =
        selectedSubjects.length === 0 ||
        selectedSubjects.includes(question.subject);

      return matchesSearch && matchesDifficulty && matchesSubject;
    });
  }, [search, selectedDifficulties, selectedSubjects]);

  const selectedQuestions = useMemo(
    () => questionBank.filter((q) => selectedIds.has(q.id)),
    [selectedIds]
  );

  const toggleDifficulty = (difficulty: QuestionBankItem["difficulty"]) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleQuestion = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addSuggested = (count = 5) => {
    const available = filteredQuestions.filter((q) => !selectedIds.has(q.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    if (picked.length === 0) {
      toast.warning("Nenhuma questão disponível com os filtros atuais.");
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      picked.forEach((q) => next.add(q.id));
      return next;
    });
    toast.success(`${picked.length} questões sugeridas foram adicionadas.`);
  };

  const removeQuestion = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const groupedBySubject = useMemo(() => {
    return selectedQuestions.reduce<Record<string, QuestionBankItem[]>>(
      (acc, question) => {
        if (!acc[question.subject]) acc[question.subject] = [];
        acc[question.subject].push(question);
        return acc;
      },
      {}
    );
  }, [selectedQuestions]);

  const handleSave = () => {
    if (selectedQuestions.length === 0) {
      toast.error("Escolha pelo menos uma questão para gerar a lista.");
      return;
    }
    toast.success(
      `Lista "${listTitle}" criada com ${selectedQuestions.length} questões.`
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gerar lista de exercícios
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Combine questões do seu banco para montar uma lista personalizada para
            a turma. Use os filtros para refinar os assuntos e nivele a
            dificuldade.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/default">Voltar ao painel</Link>
          </Button>
          <Button className="gap-2" onClick={handleSave}>
            <ListPlus className="h-4 w-4" />
            Salvar lista
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-muted-foreground/20">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-primary" />
              Banco de questões
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por assunto, fonte ou palavra-chave"
                  className="pl-8"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" size="sm">
                    <Filter className="h-4 w-4" /> Dificuldade
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {DIFFICULTIES.map((difficulty) => (
                    <DropdownMenuCheckboxItem
                      key={difficulty}
                      checked={selectedDifficulties.includes(difficulty)}
                      onCheckedChange={() => toggleDifficulty(difficulty)}
                    >
                      {difficulty}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" size="sm">
                    <Filter className="h-4 w-4" /> Disciplinas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {subjects.map((subject) => (
                    <DropdownMenuCheckboxItem
                      key={subject}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    >
                      {subject}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="secondary" onClick={() => addSuggested()} size="sm">
                Sugestão automática
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma questão encontrada com os filtros atuais.
              </p>
            ) : (
              <ScrollArea className="h-[420px] pr-4">
                <div className="space-y-2">
                  {filteredQuestions.map((question) => {
                    const isSelected = selectedIds.has(question.id);
                    return (
                      <div
                        key={question.id}
                        className="flex flex-col gap-2 rounded-lg border px-3 py-2 bg-card/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-semibold">
                                {question.subject}
                              </Label>
                              <Badge variant="secondary">{question.difficulty}</Badge>
                              <Badge variant="outline">{question.source}</Badge>
                              <Badge variant="outline">{question.year}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {question.skill} — {question.phase} • Q{question.numberLabel}
                            </p>
                            {question.tags?.length ? (
                              <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                                {question.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="font-normal">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <Button
                            variant={isSelected ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => toggleQuestion(question.id)}
                            className="whitespace-nowrap"
                          >
                            {isSelected ? "Remover" : "Adicionar"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Minha lista (preview)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título da lista</Label>
              <Input
                value={listTitle}
                onChange={(event) => setListTitle(event.target.value)}
                placeholder="Ex.: Lista de revisão de Matemática"
              />
            </div>

            <div className="space-y-2">
              <Label>Orientações para os alunos</Label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedQuestions.length} questões selecionadas
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Limpar lista
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Gerar lista
                </Button>
              </div>
            </div>

            <Separator />
            {selectedQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Selecione questões no painel à esquerda para visualizar aqui.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedBySubject).map(([subject, questions]) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{subject}</h3>
                      <span className="text-xs text-muted-foreground">
                        {questions.length} questões
                      </span>
                    </div>
                    <div className="space-y-2">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className="flex items-start justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">
                              {question.skill} ({question.difficulty})
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {question.source} {question.year} — {question.phase} • Q{question.numberLabel}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
