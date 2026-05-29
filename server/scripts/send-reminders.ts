import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { buildReminders, notify } from "../src/services/notify";
import { env } from "../src/env";

// Automation entry point — run on a schedule (cron / Task Scheduler):
//   npm run reminders
// For every user it builds reminders from their data and dispatches them over
// email (to user.email) + SMS + WhatsApp (to REMINDER_TEST_PHONE if set).
// Without credentials each channel logs a dry-run instead of sending.
async function main() {
  const users = await prisma.user.findMany();
  let sent = 0;

  for (const user of users) {
    const lines = await buildReminders(user.id);
    if (lines.length === 0) continue;

    const subject = `🌿 AgroVision: ${lines.length} farm reminder(s)`;
    const body = `Hi${user.name ? ` ${user.name}` : ""},\n\nYour AgroVision reminders:\n\n${lines.join("\n")}\n\n— AgroVision`;

    if (user.email) await notify("email", user.email, subject, body);
    if (env.reminderTestPhone) {
      await notify("sms", env.reminderTestPhone, subject, body);
      await notify("whatsapp", env.reminderTestPhone, subject, body);
    }

    sent++;
    console.log(`✔ ${user.id}: ${lines.length} reminder(s)`);
  }

  console.log(`Reminder run complete — notified ${sent} user(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
