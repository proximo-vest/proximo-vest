// src/app/auth/reset-password/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    confirmPassword: z
      .string()
      .min(6, { message: "A confirmação deve ter pelo menos 6 caracteres." }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }
  );

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const isSubmitting = form.formState.isSubmitting;

  // Se o token veio inválido/expirado na URL
  if (urlError === "INVALID_TOKEN" || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Link inválido</CardTitle>
            <CardDescription>
              O link de redefinição de senha é inválido ou já foi usado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Solicite uma nova redefinição de senha para continuar.
            </p>
            <Button
              className="w-full"
              variant="default"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Solicitar novo link
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    if (!token) {
      toast.error("Link de redefinição inválido ou expirado.");
      return;
    }

    const { error } = await authClient.resetPassword({
      token,
      newPassword: values.password,
    });

    if (error) {
      toast.error(error.message ?? "Erro ao redefinir senha.");
      return;
    }

    toast.success("Senha redefinida com sucesso! Faça login novamente.");
    router.push("/auth/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Redefinir senha</CardTitle>
          <CardDescription>
            Defina uma nova senha segura para continuar acessando o Próximo Vest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repita a nova senha"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Redefinir senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
