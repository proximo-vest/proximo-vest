"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SubscribeButton({ planKey }: { planKey: string }) {
  const [isLoading, start] = useTransition();

  async function checkout() {
    start(async () => {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planKey }),
        });

        if (!res.ok) {
          toast.error("Erro ao iniciar checkout");
          return;
        }

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Falha: URL não retornada");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro inesperado");
      }
    });
  }

  return (
    <Button onClick={checkout} disabled={isLoading}>
      {isLoading ? "Carregando..." : "Assinar"}
    </Button>
  );
}
