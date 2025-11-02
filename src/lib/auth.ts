import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prisma } from "./prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // só intercepta o login por email+senha
      if (ctx.path !== "/sign-in/email") return;

      const email = ctx.body?.email as string | undefined;
      if (!email) return; // deixa o fluxo normal validar

      // busca status do usuário
      const user = await prisma.user.findUnique({
        where: { email },
        select: { status: true, emailVerified: true },
      });

      // bloqueia se não existir ou não estiver "active"
      if (!user || user.status !== "active") {
        throw new APIError("UNAUTHORIZED", {
          message: "Sua conta está desativada. Fale com o suporte.",
        });
      }
    }),
  },
});