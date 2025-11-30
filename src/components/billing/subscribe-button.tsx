"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type BillingInterval = "MONTH" | "YEAR";

type SubscribeButtonProps = {
  planKey: string;
  interval?: BillingInterval; // opcional, default MONTH
};

export function SubscribeButton({ planKey, interval = "MONTH" }: SubscribeButtonProps) {
  const [isLoading, start] = useTransition();

  async function checkout() {
    start(async () => {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planKey,
            interval, // <-- agora vai junto
          }),
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

  const label =
    interval === "YEAR"
      ? "Assinar plano anual"
      : "Assinar plano mensal";

  return (
    <Button onClick={checkout} disabled={isLoading}>
      {isLoading ? "Carregando..." : label}
    </Button>
  );
}
