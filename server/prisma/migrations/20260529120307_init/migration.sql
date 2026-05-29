-- CreateEnum
CREATE TYPE "FarmType" AS ENUM ('CROP', 'LIVESTOCK', 'MIXED', 'AQUACULTURE', 'POULTRY');

-- CreateEnum
CREATE TYPE "GrowthStage" AS ENUM ('SEEDLING', 'VEGETATIVE', 'FLOWERING', 'MATURING', 'HARVESTED');

-- CreateEnum
CREATE TYPE "LivestockType" AS ENUM ('CATTLE', 'GOAT', 'SHEEP', 'POULTRY', 'PIG', 'FISH');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'MONITORING', 'SICK');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('PRODUCE', 'INPUT', 'EQUIPMENT', 'LIVESTOCK');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SOLD');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('SOIL_SENSOR', 'WEATHER_STATION', 'IRRIGATION', 'CAMERA', 'OTHER');

-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('BLUETOOTH', 'WIFI');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PAIRING');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'SENT', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('OPEN', 'FUNDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TenderStatus" AS ENUM ('OPEN', 'CLOSED', 'AWARDED');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MEMBER', 'ADMIN', 'CHAIR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sizeHectares" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" "FarmType" NOT NULL DEFAULT 'MIXED',
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "areaHectares" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "growthStage" "GrowthStage" NOT NULL DEFAULT 'SEEDLING',
    "healthScore" INTEGER NOT NULL DEFAULT 100,
    "plantingDate" TIMESTAMP(3),
    "expectedHarvestDate" TIMESTAMP(3),
    "notes" TEXT,
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livestock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LivestockType" NOT NULL DEFAULT 'CATTLE',
    "breed" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "healthStatus" "HealthStatus" NOT NULL DEFAULT 'HEALTHY',
    "notes" TEXT,
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livestock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "cropId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ListingCategory" NOT NULL DEFAULT 'PRODUCE',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "buyerName" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "ownerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL DEFAULT 'SOIL_SENSOR',
    "connection" "ConnectionType" NOT NULL DEFAULT 'BLUETOOTH',
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "address" TEXT,
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorReading" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT '',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiseaseScan" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "result" TEXT,
    "confidence" DOUBLE PRECISION,
    "status" "ScanStatus" NOT NULL DEFAULT 'PENDING',
    "ownerId" TEXT NOT NULL,
    "cropId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseaseScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'EXPENSE',
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'unit',
    "reorderLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,
    "warehouseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "type" "MovementType" NOT NULL DEFAULT 'IN',
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reason" TEXT,
    "ownerId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "carrier" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedReturn" DOUBLE PRECISION,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'OPEN',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "status" "TenderStatus" NOT NULL DEFAULT 'OPEN',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "bidderName" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "ownerId" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cooperative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cooperative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "ownerId" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sizeHectares" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "ownerId" TEXT NOT NULL,
    "farmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Farm_ownerId_idx" ON "Farm"("ownerId");

-- CreateIndex
CREATE INDEX "Crop_ownerId_idx" ON "Crop"("ownerId");

-- CreateIndex
CREATE INDEX "Livestock_ownerId_idx" ON "Livestock"("ownerId");

-- CreateIndex
CREATE INDEX "Task_ownerId_idx" ON "Task"("ownerId");

-- CreateIndex
CREATE INDEX "MarketListing_ownerId_idx" ON "MarketListing"("ownerId");

-- CreateIndex
CREATE INDEX "Order_ownerId_idx" ON "Order"("ownerId");

-- CreateIndex
CREATE INDEX "Order_listingId_idx" ON "Order"("listingId");

-- CreateIndex
CREATE INDEX "Device_ownerId_idx" ON "Device"("ownerId");

-- CreateIndex
CREATE INDEX "SensorReading_ownerId_idx" ON "SensorReading"("ownerId");

-- CreateIndex
CREATE INDEX "SensorReading_deviceId_idx" ON "SensorReading"("deviceId");

-- CreateIndex
CREATE INDEX "DiseaseScan_ownerId_idx" ON "DiseaseScan"("ownerId");

-- CreateIndex
CREATE INDEX "Transaction_ownerId_idx" ON "Transaction"("ownerId");

-- CreateIndex
CREATE INDEX "Warehouse_ownerId_idx" ON "Warehouse"("ownerId");

-- CreateIndex
CREATE INDEX "InventoryItem_ownerId_idx" ON "InventoryItem"("ownerId");

-- CreateIndex
CREATE INDEX "StockMovement_ownerId_idx" ON "StockMovement"("ownerId");

-- CreateIndex
CREATE INDEX "StockMovement_itemId_idx" ON "StockMovement"("itemId");

-- CreateIndex
CREATE INDEX "Supplier_ownerId_idx" ON "Supplier"("ownerId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_ownerId_idx" ON "PurchaseOrder"("ownerId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");

-- CreateIndex
CREATE INDEX "Shipment_ownerId_idx" ON "Shipment"("ownerId");

-- CreateIndex
CREATE INDEX "Investment_ownerId_idx" ON "Investment"("ownerId");

-- CreateIndex
CREATE INDEX "Tender_ownerId_idx" ON "Tender"("ownerId");

-- CreateIndex
CREATE INDEX "Bid_ownerId_idx" ON "Bid"("ownerId");

-- CreateIndex
CREATE INDEX "Bid_tenderId_idx" ON "Bid"("tenderId");

-- CreateIndex
CREATE INDEX "Cooperative_ownerId_idx" ON "Cooperative"("ownerId");

-- CreateIndex
CREATE INDEX "Membership_ownerId_idx" ON "Membership"("ownerId");

-- CreateIndex
CREATE INDEX "Membership_cooperativeId_idx" ON "Membership"("cooperativeId");

-- CreateIndex
CREATE INDEX "GrowArea_ownerId_idx" ON "GrowArea"("ownerId");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livestock" ADD CONSTRAINT "Livestock_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livestock" ADD CONSTRAINT "Livestock_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketListing" ADD CONSTRAINT "MarketListing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseScan" ADD CONSTRAINT "DiseaseScan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseScan" ADD CONSTRAINT "DiseaseScan_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperative" ADD CONSTRAINT "Cooperative_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowArea" ADD CONSTRAINT "GrowArea_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowArea" ADD CONSTRAINT "GrowArea_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
