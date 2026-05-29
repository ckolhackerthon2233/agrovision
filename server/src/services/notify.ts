import { prisma } from "../lib/prisma";
import { sendEmail } from "./email";
import { sendSms } from "./sms";
import { sendWhatsApp } from "./whatsapp";

export type Channel = "email" | "sms" | "whatsapp";

// Single entry point — routes a message to the chosen channel.
export async function notify(channel: Channel, to: string, subject: string, body: string) {
  switch (channel) {
    case "email":
      return sendEmail(to, subject, body);
    case "sms":
      return sendSms(to, body);
    case "whatsapp":
      return sendWhatsApp(to, body);
  }
}

const HOURS_48 = 1000 * 60 * 60 * 48;

// Builds a user's reminder lines from their live data: tasks due soon,
// inventory at/below reorder level, and crops ready to harvest.
export async function buildReminders(ownerId: string): Promise<string[]> {
  const soon = new Date(Date.now() + HOURS_48);

  const [dueTasks, items, crops] = await Promise.all([
    prisma.task.findMany({
      where: { ownerId, status: { not: "DONE" }, dueDate: { not: null, lte: soon } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.inventoryItem.findMany({ where: { ownerId } }),
    prisma.crop.findMany({ where: { ownerId } }),
  ]);

  const lines: string[] = [];

  for (const task of dueTasks) {
    const when = task.dueDate ? ` (due ${new Date(task.dueDate).toLocaleDateString()})` : "";
    lines.push(`📋 Task: ${task.title}${when}`);
  }
  for (const item of items) {
    if (item.reorderLevel > 0 && item.quantity <= item.reorderLevel) {
      lines.push(`📦 Low stock: ${item.name} — ${item.quantity} ${item.unit} left`);
    }
  }
  for (const crop of crops) {
    if (crop.growthStage === "MATURING") {
      lines.push(`🌾 Harvest soon: ${crop.name}`);
    }
  }

  return lines;
}
