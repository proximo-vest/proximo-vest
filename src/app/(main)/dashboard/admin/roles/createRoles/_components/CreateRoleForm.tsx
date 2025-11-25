"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

// --- Schema ---
const roleCreateSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional(),
  // 🚨 sem default aqui
  isActive: z.boolean(),
});

type RoleCreateSchema = z.infer<typeof roleCreateSchema>;

// --- Componente ---
export function CreateRoleForm() {
  const router = useRouter();
  const form = useForm<RoleCreateSchema>({
    resolver: zodResolver(roleCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      // ✅ default fica aqui
      isActive: true,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RoleCreateSchema) {
    try {
      const res = await fetch("/api/roles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao criar role.");
      }

      toast.success("Role criado com sucesso!");

      form.reset({
        name: "",
        description: "",
        isActive: true,
      });

      router.push("/dashboard/admin/roles");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro inesperado ao criar role.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: admin, professor, corretor..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Ex: Pode gerenciar usuários, provas, correções..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <FormLabel>Role ativo</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Desative para impedir que esse role seja usado em novos usuários.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar role"}
        </Button>
      </form>
    </Form>
  );
}
