"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Role = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

type Response = {
  user: {
    id: string;
    email: string;
  };
  roles: string[];
  allRoles: Role[];
};

export function UserRolesForm({ userId }: { userId: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/users/${userId}/roles`);
        const data: Response = await res.json();

        setRoles(data.allRoles);
        setSelected(data.roles);
      } catch (e) {
        toast.error("Erro ao carregar roles do usuário.");
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

  async function handleSave() {
    try {
      setSaving(true);

      const res = await fetch(`/api/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleIds: selected }),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar roles.");
      }

      toast.success("Roles atualizadas!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <label key={role.id} className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={selected.includes(role.id)}
            onCheckedChange={() => toggle(role.id)}
          />
          <div>
            <div className="font-medium">{role.name}</div>
            <div className="text-xs text-muted-foreground">
              {role.description || ""}
            </div>
          </div>
        </label>
      ))}

      <Button disabled={saving} onClick={handleSave}>
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
