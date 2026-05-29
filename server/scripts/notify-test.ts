import "dotenv/config";
import { sendEmail } from "../src/services/email";
import { sendSms } from "../src/services/sms";
import { sendWhatsApp } from "../src/services/whatsapp";
import { env } from "../src/env";

// Verifies the notification toolkit WITHOUT touching the database.
//   npm run notify:test -- you@example.com
// Sends a test over all three channels (dry-run logs unless creds are set).
async function main() {
  const email = process.argv[2] ?? "test@example.com";
  const phone = env.reminderTestPhone || "+10000000000";

  console.log("Sending test notifications (dry-run unless creds configured)…\n");
  console.log("email   :", await sendEmail(email, "AgroVision test", "Hello from AgroVision 🌿"));
  console.log("sms     :", await sendSms(phone, "AgroVision SMS test 🌿"));
  console.log("whatsapp:", await sendWhatsApp(phone, "AgroVision WhatsApp test 🌿"));
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
