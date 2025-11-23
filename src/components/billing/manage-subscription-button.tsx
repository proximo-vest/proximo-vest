"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  children?: React.ReactNode;
};

export function ManageSubscriptionButton({ children }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/billing/customer-portal", {
          method: "POST",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(
            data.error ||
              "Não foi possível abrir o portal de cobrança. Tente novamente."
          );
          return;
        }

        const data = await res.json();

        if (!data.url) {
          toast.error("Resposta inválida do servidor.");
          return;
        }

        window.location.href = data.url;
      } catch (err) {
        console.error(err);
        toast.error("Erro inesperado ao abrir o portal.");
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} variant="outline">
      {isPending ? "Abrindo portal..." : children ?? "Gerenciar assinatura"}
    </Button>
  );
}
