"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Permission = {
  id: string;
  resource: string;
  action: string;
  key: string;
  isActive: boolean;
};

type ApiResponse = {
  user: {
    id: string;
    email: string;
  };
  permissionIds: string[];      // granted diretas atuais
  allPermissions: Permission[]; // todas as ativas
};

export function UserPermissionsForm({ userId }: { userId: string }) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch(`/api/users/${userId}/permissions`);
        if (!res.ok) throw new Error("Erro ao carregar permissões do usuário.");
        const data: ApiResponse = await res.json();

        setPermissions(data.allPermissions);
        setSelected(data.permissionIds);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Erro ao carregar permissões do usuário.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  const toggle = (id: string) => {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
    );
  };

  const grouped = permissions.reduce<Record<string, Permission[]>>(
    (acc, perm) => {
      const group = perm.resource || "Outros";
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    },
    {}
  );

  async function handleSave() {
    try {
      setSaving(true);

      const res = await fetch(`/api/users/${userId}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionIds: selected }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || "Erro ao salvar permissões.");
      }

      toast.success("Permissões atualizadas com sucesso!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Erro ao salvar permissões.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Carregando permissões...
      </p>
    );
  }

  if (!permissions.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma permissão ativa cadastrada.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([resource, perms]) => (
        <div key={resource} className="border rounded-md p-4 space-y-2">
          <h2 className="font-semibold text-sm uppercase tracking-wide">
            {resource}
          </h2>

          <div className="space-y-2">
            {perms.map((perm) => (
              <label
                key={perm.id}
                className="flex items-start gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(perm.id)}
                  onCheckedChange={() => toggle(perm.id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium">{perm.key}</div>
                  <div className="text-xs text-muted-foreground">
                    {perm.resource}.{perm.action}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
