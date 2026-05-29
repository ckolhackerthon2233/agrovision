import nodemailer, { Transporter } from "nodemailer";
import { env } from "../env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.smtp.host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
  }
  return transporter;
}

// Sends an email. Falls back to a dry-run log when SMTP isn't configured, so
// the rest of the app works without credentials during development.
export async function sendEmail(to: string, subject: string, body: string) {
  const t = getTransporter();
  if (!t) {
    console.log(`[email:dry-run] → ${to} | ${subject}`);
    return { channel: "email" as const, to, dryRun: true };
  }
  await t.sendMail({ from: env.smtp.from, to, subject, text: body });
  return { channel: "email" as const, to, dryRun: false };
}
