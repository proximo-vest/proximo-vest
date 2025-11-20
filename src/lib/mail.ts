import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM ?? "No Reply <no-reply@example.com>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    // aqui você pode integrar com algum logger, Sentry, etc
  }
}
