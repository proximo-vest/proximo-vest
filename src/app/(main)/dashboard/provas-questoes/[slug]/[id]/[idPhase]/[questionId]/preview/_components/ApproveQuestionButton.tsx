"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ApproveQuestionButtonProps = {
  questionId: number;
  initialStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function ApproveQuestionButton({
  questionId,
  initialStatus,
}: ApproveQuestionButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  // Se já não for rascunho, não mostra nada
  if (status !== "DRAFT") return null;

  function handleApprove() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/question/${questionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PUBLISHED" }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.error?.message || "Erro ao aprovar a questão."
          );
        }

        setStatus("PUBLISHED"); // some o botão
        toast.success("Questão aprovada e publicada.");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Não foi possível aprovar a questão.");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handleApprove}
      disabled={isPending}
    >
      {isPending ? "Aprovando..." : "Aprovar questão"}
    </Button>
  );
}
