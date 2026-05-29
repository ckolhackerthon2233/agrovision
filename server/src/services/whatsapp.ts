import { env } from "../env";
import { twilioSend } from "./twilio";

// Sends a WhatsApp message via Twilio. Dry-run logs if not configured.
export async function sendWhatsApp(to: string, body: string) {
  const { accountSid, authToken, whatsappFrom } = env.twilio;
  if (!accountSid || !authToken || !whatsappFrom) {
    console.log(`[whatsapp:dry-run] → ${to} | ${body}`);
    return { channel: "whatsapp" as const, to, dryRun: true };
  }
  const toAddr = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  await twilioSend(toAddr, whatsappFrom, body);
  return { channel: "whatsapp" as const, to, dryRun: false };
}
