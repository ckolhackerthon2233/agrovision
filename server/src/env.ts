export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  // Email (SMTP) — leave host empty to run in dry-run (logs instead of sends).
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "AgroVision <no-reply@agrovision.app>",
  },

  // Twilio — used for both SMS and WhatsApp. Empty creds → dry-run.
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
    authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
    smsFrom: process.env.TWILIO_SMS_FROM ?? "", // e.g. +14155551234
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM ?? "", // e.g. whatsapp:+14155238886
  },

  // Optional phone for reminder/test scripts (SMS + WhatsApp).
  reminderTestPhone: process.env.REMINDER_TEST_PHONE ?? "",
};
