// app/dashboard/provas-questoes/[slug]/board-view-client.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Board = { id: number; name: string; slug: string; error?: any };

export function BoardViewClient({ board }: { board: Board }) {
  const router = useRouter();
  if (board?.error) {
    toast.error("Vestibular não encontrado.");
    router.push("/dashboard/provas-questoes");
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Vestibular: {board.name}</h1>
    </>
  );
}
