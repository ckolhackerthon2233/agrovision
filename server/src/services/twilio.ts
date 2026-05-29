import { env } from "../env";

// Sends a message through Twilio's REST API using fetch (no SDK dependency).
// Used by both SMS and WhatsApp (WhatsApp just uses a `whatsapp:` prefixed To/From).
export async function twilioSend(to: string, from: string, body: string) {
  const { accountSid, authToken } = env.twilio;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    },
  );

  if (!res.ok) {
    throw new Error(`Twilio error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
