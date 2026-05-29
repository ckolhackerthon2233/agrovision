import { env } from "../env";
import { twilioSend } from "./twilio";

// Sends an SMS via Twilio. Dry-run logs if Twilio isn't configured.
export async function sendSms(to: string, body: string) {
  const { accountSid, authToken, smsFrom } = env.twilio;
  if (!accountSid || !authToken || !smsFrom) {
    console.log(`[sms:dry-run] → ${to} | ${body}`);
    return { channel: "sms" as const, to, dryRun: true };
  }
  await twilioSend(to, smsFrom, body);
  return { channel: "sms" as const, to, dryRun: false };
}
