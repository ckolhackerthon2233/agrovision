import { z } from "zod";
import { prisma } from "./lib/prisma";
import type { ResourceConfig } from "./lib/crud";

// Zod create schemas for every entity (update = `.partial()`, handled by the
// CRUD factory). Relations are set via scalar FK ids (e.g. listingId, farmId).

const taskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).nullish(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.coerce.date().nullish(),
  farmId: z.string().nullish(),
  cropId: z.string().nullish(),
});

const listingSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000).nullish(),
  category: z.enum(["PRODUCE", "INPUT", "EQUIPMENT", "LIVESTOCK"]).default("PRODUCE"),
  price: z.coerce.number().min(0).default(0),
  unit: z.string().max(20).default("kg"),
  quantity: z.coerce.number().min(0).default(0),
  status: z.enum(["DRAFT", "ACTIVE", "SOLD"]).default("ACTIVE"),
});

const orderSchema = z.object({
  listingId: z.string(),
  quantity: z.coerce.number().min(0).default(1),
  totalPrice: z.coerce.number().min(0).default(0),
  buyerName: z.string().max(120).nullish(),
  status: z.enum(["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"]).default("PENDING"),
});

const deviceSchema = z.object({
  name: z.string().min(1).max(80),
  type: z.enum(["SOIL_SENSOR", "WEATHER_STATION", "IRRIGATION", "CAMERA", "OTHER"]).default("SOIL_SENSOR"),
  connection: z.enum(["BLUETOOTH", "WIFI"]).default("BLUETOOTH"),
  status: z.enum(["ONLINE", "OFFLINE", "PAIRING"]).default("OFFLINE"),
  address: z.string().max(120).nullish(),
  farmId: z.string().nullish(),
});

const sensorReadingSchema = z.object({
  deviceId: z.string(),
  metric: z.string().min(1).max(40),
  value: z.coerce.number(),
  unit: z.string().max(20).default(""),
  recordedAt: z.coerce.date().optional(),
});

const diseaseScanSchema = z.object({
  imageUrl: z.string().max(500).nullish(),
  result: z.string().max(200).nullish(),
  confidence: z.coerce.number().min(0).max(1).nullish(),
  status: z.enum(["PENDING", "COMPLETE", "FAILED"]).default("PENDING"),
  cropId: z.string().nullish(),
});

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
  category: z.string().min(1).max(60),
  amount: z.coerce.number().min(0).default(0),
  note: z.string().max(500).nullish(),
  occurredAt: z.coerce.date().optional(),
  farmId: z.string().nullish(),
});

const warehouseSchema = z.object({
  name: z.string().min(1).max(80),
  location: z.string().max(120).nullish(),
});

const inventoryItemSchema = z.object({
  name: z.string().min(1).max(80),
  sku: z.string().max(40).nullish(),
  quantity: z.coerce.number().min(0).default(0),
  unit: z.string().max(20).default("unit"),
  reorderLevel: z.coerce.number().min(0).default(0),
  warehouseId: z.string().nullish(),
});

const stockMovementSchema = z.object({
  itemId: z.string(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]).default("IN"),
  quantity: z.coerce.number().default(0),
  reason: z.string().max(200).nullish(),
});

const supplierSchema = z.object({
  name: z.string().min(1).max(120),
  contact: z.string().max(120).nullish(),
  phone: z.string().max(40).nullish(),
  email: z.string().email().max(120).nullish(),
});

const purchaseOrderSchema = z.object({
  supplierId: z.string(),
  reference: z.string().max(60).nullish(),
  status: z.enum(["DRAFT", "SENT", "RECEIVED", "CANCELLED"]).default("DRAFT"),
  total: z.coerce.number().min(0).default(0),
});

const shipmentSchema = z.object({
  reference: z.string().max(60).nullish(),
  origin: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  carrier: z.string().max(80).nullish(),
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"]).default("PENDING"),
});

const investmentSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000).nullish(),
  amount: z.coerce.number().min(0).default(0),
  expectedReturn: z.coerce.number().nullish(),
  status: z.enum(["OPEN", "FUNDED", "CLOSED"]).default("OPEN"),
});

const tenderSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000).nullish(),
  budget: z.coerce.number().min(0).default(0),
  deadline: z.coerce.date().nullish(),
  status: z.enum(["OPEN", "CLOSED", "AWARDED"]).default("OPEN"),
});

const bidSchema = z.object({
  tenderId: z.string(),
  bidderName: z.string().max(120).nullish(),
  amount: z.coerce.number().min(0).default(0),
  note: z.string().max(500).nullish(),
});

const cooperativeSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).nullish(),
  location: z.string().max(120).nullish(),
});

const membershipSchema = z.object({
  cooperativeId: z.string(),
  memberName: z.string().min(1).max(120),
  role: z.enum(["MEMBER", "ADMIN", "CHAIR"]).default("MEMBER"),
});

const growAreaSchema = z.object({
  name: z.string().min(1).max(80),
  sizeHectares: z.coerce.number().min(0).default(0),
  notes: z.string().max(500).nullish(),
  farmId: z.string().nullish(),
});

// Every resource → /api/<path>, full CRUD, scoped to the authenticated owner.
// (farms / crops / livestock keep their dedicated hand-written modules.)
export const resources: ResourceConfig[] = [
  { path: "tasks", delegate: prisma.task, schema: taskSchema },
  { path: "market-listings", delegate: prisma.marketListing, schema: listingSchema },
  { path: "orders", delegate: prisma.order, schema: orderSchema },
  { path: "devices", delegate: prisma.device, schema: deviceSchema },
  { path: "sensor-readings", delegate: prisma.sensorReading, schema: sensorReadingSchema, orderBy: { recordedAt: "desc" } },
  { path: "disease-scans", delegate: prisma.diseaseScan, schema: diseaseScanSchema },
  { path: "transactions", delegate: prisma.transaction, schema: transactionSchema },
  { path: "warehouses", delegate: prisma.warehouse, schema: warehouseSchema },
  { path: "inventory-items", delegate: prisma.inventoryItem, schema: inventoryItemSchema },
  { path: "stock-movements", delegate: prisma.stockMovement, schema: stockMovementSchema },
  { path: "suppliers", delegate: prisma.supplier, schema: supplierSchema },
  { path: "purchase-orders", delegate: prisma.purchaseOrder, schema: purchaseOrderSchema },
  { path: "shipments", delegate: prisma.shipment, schema: shipmentSchema },
  { path: "investments", delegate: prisma.investment, schema: investmentSchema },
  { path: "tenders", delegate: prisma.tender, schema: tenderSchema },
  { path: "bids", delegate: prisma.bid, schema: bidSchema },
  { path: "cooperatives", delegate: prisma.cooperative, schema: cooperativeSchema },
  { path: "memberships", delegate: prisma.membership, schema: membershipSchema },
  { path: "grow-areas", delegate: prisma.growArea, schema: growAreaSchema },
];
