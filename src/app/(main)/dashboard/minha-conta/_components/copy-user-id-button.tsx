"use client";

import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CopyUserIdButtonProps = {
  userId: string;
};

export function CopyUserIdButton({ userId }: CopyUserIdButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      toast.success("ID do usuário copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível copiar o ID.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="shrink-0"
      title="Copiar ID do usuário"
    >
      {copied ? (
        <ClipboardCheck className="h-4 w-4" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  );
}
