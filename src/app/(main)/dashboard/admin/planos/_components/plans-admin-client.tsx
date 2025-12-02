"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Plan = {
  id: string;
  key: string;
  label: string;
  description: string;
  type: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;          // NOVO
  highlight: boolean;
  isActive: boolean;
  stripePriceId: string | null;        // mensal
  stripeYearlyPriceId: string | null;  // NOVO: anual
  createdAt: string;
  updatedAt: string;
};

type Props = {
  initialPlans: Plan[];
};

export function PlansAdminClient({ initialPlans }: Props) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    key: "",
    label: "",
    description: "",
    type: "student",
    monthlyPrice: "",
    yearlyPrice: "", // NOVO
    stripePriceId: "",
    stripeYearlyPriceId: "", // NOVO
    highlight: false,
  });

  async function refreshPlans() {
    const res = await fetch("/api/plans");
    if (!res.ok) {
      toast.error("Erro ao atualizar planos");
      return;
    }
    const data = await res.json();
    setPlans(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: form.key.trim(),
          label: form.label.trim(),
          description: form.description.trim(),
          type: form.type,
          monthlyPrice:
            form.monthlyPrice === "" ? null : Number(form.monthlyPrice),
          yearlyPrice:
            form.yearlyPrice === "" ? null : Number(form.yearlyPrice),
          stripePriceId:
            form.stripePriceId.trim() === ""
              ? null
              : form.stripePriceId.trim(),
          stripeYearlyPriceId:
            form.stripeYearlyPriceId.trim() === ""
              ? null
              : form.stripeYearlyPriceId.trim(),
          highlight: form.highlight,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao criar plano");
      }

      toast.success("Plano criado com sucesso!");
      setForm({
        key: "",
        label: "",
        description: "",
        type: "student",
        monthlyPrice: "",
        yearlyPrice: "",
        stripePriceId: "",
        stripeYearlyPriceId: "",
        highlight: false,
      });
      await refreshPlans();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao criar plano");
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(plan: Plan) {
    try {
      const res = await fetch(`/api/plans/${plan.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar plano");

      toast.success("Plano atualizado!");
      await refreshPlans();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar plano");
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">
          Planos da Plataforma
        </h1>
        <p className="text-muted-foreground">
          Gerencie os planos de assinatura disponíveis para alunos, professores
          e escolas.
        </p>
      </section>

      {/* Form de criação */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Criar novo plano</CardTitle>
            <CardDescription>
              Defina um identificador interno (key), nome, tipo e preços.
              Use key em caixa alta, ex:{" "}
              <code>STUDENT_START</code>, <code>TEACHER_EDU</code>.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreate}>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="key">Key interna</Label>
                <Input
                  id="key"
                  placeholder="STUDENT_START"
                  value={form.key}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      key: e.target.value.toUpperCase(),
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (título do plano)</Label>
                <Input
                  id="label"
                  placeholder="Plano Start (Aluno)"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição breve dos benefícios do plano."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  className="border rounded-md px-2 py-1 text-sm bg-background"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  <option value="student">Aluno</option>
                  <option value="teacher">Professor</option>
                  <option value="school">Escola</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyPrice">Preço mensal (R$)</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  step="0.01"
                  placeholder="Deixe vazio para não ter plano mensal"
                  value={form.monthlyPrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthlyPrice: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearlyPrice">Preço anual (R$)</Label>
                <Input
                  id="yearlyPrice"
                  type="number"
                  step="0.01"
                  placeholder="Deixe vazio para não ter plano anual"
                  value={form.yearlyPrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, yearlyPrice: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripePriceId">
                  Stripe Price ID (mensal)
                </Label>
                <Input
                  id="stripePriceId"
                  placeholder="price_xxx (mensal)"
                  value={form.stripePriceId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stripePriceId: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripeYearlyPriceId">
                  Stripe Price ID (anual)
                </Label>
                <Input
                  id="stripeYearlyPriceId"
                  placeholder="price_xxx (anual)"
                  value={form.stripeYearlyPriceId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stripeYearlyPriceId: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <Switch
                  id="highlight"
                  checked={form.highlight}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, highlight: checked }))
                  }
                />
                <Label htmlFor="highlight">Destacar plano (Recomendado)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={creating}>
                {creating ? "Criando..." : "Criar plano"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </section>

      {/* Lista de planos */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Planos cadastrados</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlight ? "border-primary shadow-sm" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <span>{plan.label}</span>
                  {!plan.isActive && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Inativo
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  <span className="font-mono text-[11px]">{plan.key}</span>{" "}
                  • Tipo: {plan.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="space-y-1">
                  {plan.monthlyPrice === null &&
                  plan.yearlyPrice === null ? (
                    <p className="text-lg font-semibold">Gratuito</p>
                  ) : (
                    <>
                      {plan.monthlyPrice !== null && (
                        <p className="text-sm">
                          Mensal:{" "}
                          <span className="font-semibold">
                            R$ {plan.monthlyPrice.toFixed(2)}/mês
                          </span>
                        </p>
                      )}
                      {plan.yearlyPrice !== null && (
                        <p className="text-sm">
                          Anual:{" "}
                          <span className="font-semibold">
                            R$ {plan.yearlyPrice.toFixed(2)}/ano
                          </span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(plan)}
                >
                  {plan.isActive ? "Desativar" : "Ativar"}
                </Button>
                {/* depois dá pra colocar botão de editar */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
