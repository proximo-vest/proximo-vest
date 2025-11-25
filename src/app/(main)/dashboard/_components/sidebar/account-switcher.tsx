"use client";

import { useState } from "react";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  }>;
}) {
  const [activeUser, setActiveUser] = useState(users[0]);
  const router = useRouter()
  const handleLogout = async () => {
    try {
      // Se a API estiver no MESMO domínio, isso já funciona.
      // Se estiver em outro domínio/subdomínio, use credentials: "include".
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
        // descomente se sua API for cross-site (outro domínio/subdomínio):
        // credentials: "include",
        headers: { "content-type": "application/json" },
      });

      // /api/auth/logout retorna 204; res.ok cobre isso sem tentar parsear JSON
      if (!res.ok) {
        // fallback (opcional): tenta limpar cookie via client também
        try {
          const { authClient } = await import("@/lib/auth-client");
          await authClient.signOut();
        } catch { }
      }

      // Notifica outras abas (UX)
      try {
        const ch = new BroadcastChannel("auth");
        ch.postMessage("logout");
        ch.close();
      } catch { }

      // Evita “voltar” pro dashboard pelo histórico
      router.replace("/auth/login");
      // Garantir rerender sem sessão
      router.refresh();
    } catch (e) {
      // fallback final — ainda assim redireciona
      router.replace("/auth/login");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
          <AvatarFallback className="rounded-lg">{getInitials(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {users.map((user) => (
          <DropdownMenuItem
            key={user.email}
            className={cn("p-0", user.id === activeUser.id && "bg-accent/50 border-l-primary border-l-2")}
            onClick={() => setActiveUser(user)}
          >
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => {
            router.push("/dashboard/minha-conta")
          }}>
            <BadgeCheck />
            Minha conta
          </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
            router.push("/dashboard/assinatura")
          }}>
            <CreditCard />
            Assinatura
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
