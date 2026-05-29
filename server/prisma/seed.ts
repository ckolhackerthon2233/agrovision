import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Matches the DEV_USER_ID the mobile client sends as `x-user-id` in dev mode,
// so seeded data shows up immediately in Expo Go.
const DEMO_USER_ID = "user_demo";

async function main() {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: { id: DEMO_USER_ID, email: "demo@agrovision.app", name: "Demo Farmer" },
  });

  // ── Farms ──────────────────────────────────────────────────────────────
  if ((await prisma.farm.count({ where: { ownerId: DEMO_USER_ID } })) === 0) {
    await prisma.farm.createMany({
      data: [
        { name: "Green Valley Maize", location: "Nakuru, Kenya", sizeHectares: 12.5, type: "CROP", description: "Rain-fed maize and beans rotation.", ownerId: DEMO_USER_ID },
        { name: "Sunrise Dairy", location: "Eldoret, Kenya", sizeHectares: 8, type: "LIVESTOCK", description: "32 dairy cows on a zero-grazing system.", ownerId: DEMO_USER_ID },
        { name: "Riverside Mixed Farm", location: "Kisumu, Kenya", sizeHectares: 20, type: "MIXED", description: "Horticulture, poultry and tilapia ponds.", ownerId: DEMO_USER_ID },
      ],
    });
  }
  const farm = await prisma.farm.findFirst({ where: { ownerId: DEMO_USER_ID } });

  // ── Everything else (only once) ──────────────────────────────────────────
  if ((await prisma.task.count({ where: { ownerId: DEMO_USER_ID } })) > 0) {
    console.log("Seed complete (module data already present)");
    return;
  }

  const own = { ownerId: DEMO_USER_ID };

  const crop = await prisma.crop.create({
    data: { ...own, name: "Maize", variety: "DK 8031", areaHectares: 5, growthStage: "VEGETATIVE", healthScore: 88, farmId: farm?.id ?? null },
  });

  await prisma.task.createMany({
    data: [
      { ...own, title: "Top-dress maize with CAN", priority: "HIGH", status: "TODO", farmId: farm?.id ?? null, cropId: crop.id },
      { ...own, title: "Repair north fence", priority: "MEDIUM", status: "IN_PROGRESS", farmId: farm?.id ?? null },
      { ...own, title: "Order seedlings", priority: "LOW", status: "DONE" },
    ],
  });

  const listing = await prisma.marketListing.create({
    data: { ...own, title: "Fresh tomatoes (Grade A)", category: "PRODUCE", price: 80, unit: "kg", quantity: 500, status: "ACTIVE" },
  });
  await prisma.order.create({
    data: { ...own, listingId: listing.id, quantity: 50, totalPrice: 4000, buyerName: "Mama Mboga Co-op", status: "CONFIRMED" },
  });

  const device = await prisma.device.create({
    data: { ...own, name: "Soil Sensor SS-100", type: "SOIL_SENSOR", connection: "BLUETOOTH", status: "ONLINE", farmId: farm?.id ?? null },
  });
  await prisma.sensorReading.createMany({
    data: [
      { ...own, deviceId: device.id, metric: "moisture", value: 42, unit: "%" },
      { ...own, deviceId: device.id, metric: "temperature", value: 24.5, unit: "°C" },
    ],
  });

  await prisma.diseaseScan.create({
    data: { ...own, cropId: crop.id, result: "Healthy", confidence: 0.96, status: "COMPLETE" },
  });

  await prisma.transaction.createMany({
    data: [
      { ...own, type: "INCOME", category: "Produce sales", amount: 4000, farmId: farm?.id ?? null },
      { ...own, type: "EXPENSE", category: "Fertiliser", amount: 1500, farmId: farm?.id ?? null },
    ],
  });

  const warehouse = await prisma.warehouse.create({ data: { ...own, name: "Main Store", location: "Nakuru" } });
  const item = await prisma.inventoryItem.create({
    data: { ...own, name: "CAN Fertiliser", sku: "FERT-CAN-50", quantity: 12, unit: "bag", reorderLevel: 5, warehouseId: warehouse.id },
  });
  await prisma.stockMovement.create({ data: { ...own, itemId: item.id, type: "IN", quantity: 20, reason: "Initial stock" } });

  const supplier = await prisma.supplier.create({ data: { ...own, name: "AgroInputs Ltd", phone: "+254700000001" } });
  await prisma.purchaseOrder.create({ data: { ...own, supplierId: supplier.id, reference: "PO-1001", status: "SENT", total: 30000 } });

  await prisma.shipment.create({
    data: { ...own, reference: "SHP-2001", origin: "Nakuru", destination: "Nairobi", carrier: "FarmLogix", status: "IN_TRANSIT" },
  });

  await prisma.investment.create({
    data: { ...own, title: "Greenhouse expansion", amount: 250000, expectedReturn: 18, status: "OPEN" },
  });

  const tender = await prisma.tender.create({
    data: { ...own, title: "Supply 2 tonnes potatoes", budget: 120000, status: "OPEN" },
  });
  await prisma.bid.create({ data: { ...own, tenderId: tender.id, bidderName: "Highland Growers", amount: 110000 } });

  const coop = await prisma.cooperative.create({ data: { ...own, name: "Rift Valley Farmers Co-op", location: "Nakuru" } });
  await prisma.membership.create({ data: { ...own, cooperativeId: coop.id, memberName: "Demo Farmer", role: "CHAIR" } });

  await prisma.growArea.create({ data: { ...own, name: "Block A", sizeHectares: 2.5, farmId: farm?.id ?? null } });

  console.log("Seed complete (full module data)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
