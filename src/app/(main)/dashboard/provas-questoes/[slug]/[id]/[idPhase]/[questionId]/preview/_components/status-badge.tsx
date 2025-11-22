"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export function QuestionStatusBadge({
  initialStatus,
}: {
  initialStatus: StatusType;
}) {
  const [status, setStatus] = useState<StatusType>(initialStatus);

  // Evento customizado para atualizar status de fora
  useEffect(() => {
    function handleStatusChange(e: any) {
      if (e.detail?.status) {
        setStatus(e.detail.status);
      }
    }
    window.addEventListener("question-status-changed", handleStatusChange);
    return () =>
      window.removeEventListener(
        "question-status-changed",
        handleStatusChange
      );
  }, []);

  const getVariant = (s: StatusType) => {
    switch (s) {
      case "PUBLISHED":
        return "default";
      case "ARCHIVED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Badge className="uppercase" variant={getVariant(status)}>
      {status}
    </Badge>
  );
}
