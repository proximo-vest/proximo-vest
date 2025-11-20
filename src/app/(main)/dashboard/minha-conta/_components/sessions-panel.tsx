"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type SessionInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  ip?: string;
  userAgent?: string;
};

export function SessionsPanel() {
  const [sessions, setSessions] = useState<SessionInfo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sessions");
      if (!res.ok) throw new Error("Erro ao carregar sessões");
      setSessions(await res.json());
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function closeOtherSessions() {
    setClosing(true);
    try {
      const res = await fetch("/api/auth/sessions", { method: "POST" });
      if (!res.ok) throw new Error("Erro ao encerrar sessões");
      toast.success("Outras sessões foram encerradas.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setClosing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessões Ativas</CardTitle>
        <CardDescription>Gerencie sessões abertas em outros dispositivos.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && <p>Carregando...</p>}

        {!loading && sessions && sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma sessão ativa.</p>
        )}

        {!loading && sessions && sessions.map((session) => (
          <div key={session.id} className="border p-3 rounded-md text-xs space-y-1">
            <p><strong>ID:</strong> {session.id}</p>
            <p><strong>IP:</strong> {session.ip ?? "Não disponível"}</p>
            <p><strong>Último uso:</strong> {new Date(session.updatedAt).toLocaleString("pt-BR")}</p>
            <p><strong>User Agent:</strong> {session.userAgent ?? "—"}</p>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full"
          disabled={closing}
          onClick={closeOtherSessions}
        >
          {closing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Encerrar outras sessões"}
        </Button>
      </CardContent>
    </Card>
  );
}
