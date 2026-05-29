import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/async-handler";
import { notify, buildReminders } from "../../services/notify";

const router = Router();

const testSchema = z.object({
  channel: z.enum(["email", "sms", "whatsapp"]),
  to: z.string().min(1),
  subject: z.string().default("AgroVision"),
  message: z.string().min(1),
});

// Send a one-off notification on any channel.
router.post(
  "/test",
  asyncHandler(async (req, res) => {
    const { channel, to, subject, message } = testSchema.parse(req.body);
    const result = await notify(channel, to, subject, message);
    res.json({ ok: true, ...result });
  }),
);

// Preview the signed-in user's current reminders (what the cron job would send).
router.get(
  "/reminders",
  asyncHandler(async (req, res) => {
    const reminders = await buildReminders(req.userId!);
    res.json({ count: reminders.length, reminders });
  }),
);

// Build the signed-in user's reminders and dispatch them over a channel now.
const runSchema = z.object({
  channel: z.enum(["email", "sms", "whatsapp"]).default("email"),
  to: z.string().min(1),
});
router.post(
  "/reminders/run",
  asyncHandler(async (req, res) => {
    const { channel, to } = runSchema.parse(req.body);
    const reminders = await buildReminders(req.userId!);
    if (reminders.length === 0) {
      return res.json({ ok: true, count: 0, sent: false });
    }
    const body = `Your AgroVision reminders:\n\n${reminders.join("\n")}`;
    const result = await notify(channel, to, `🌿 ${reminders.length} farm reminder(s)`, body);
    res.json({ ok: true, count: reminders.length, sent: true, ...result });
  }),
);

export default router;
