// src/app/auth/verify-email-result/page.tsx
export default function VerifyEmailResultPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  if (error === "invalid_token") {
    return <p>Link inválido ou expirado. Peça um novo e-mail de verificação.</p>;
  }

  return <p>E-mail verificado com sucesso! Você já pode usar sua conta normalmente.</p>;
}
