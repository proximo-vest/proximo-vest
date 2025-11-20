// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await authClient.requestPasswordReset({
      email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    // Better Auth SEMPRE responde ok, mesmo se o e-mail não existir
    setSent(true);
  }

  if (sent) {
    return (
      <p>
        Se este e-mail estiver cadastrado, você receberá um link para redefinir a senha nos próximos minutos.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">E-mail</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit">Enviar link de redefinição</Button>
    </form>
  );
}
