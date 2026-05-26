-- CreateEnum
CREATE TYPE "DirectFarmOrderStatus" AS ENUM ('DRAFT', 'PAYMENT_PENDING', 'PAID', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DirectFarmNotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "DirectFarmVendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectFarmVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectFarmProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "wholesalePrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectFarmProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectFarmOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressDetail" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "status" "DirectFarmOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "notificationStatus" "DirectFarmNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "customerKey" TEXT NOT NULL,
    "paymentKey" TEXT,
    "method" TEXT,
    "receiptUrl" TEXT,
    "requestedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rawResponse" JSONB,
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectFarmOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectFarmNotificationLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "status" "DirectFarmNotificationStatus" NOT NULL,
    "payload" JSONB NOT NULL,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectFarmNotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DirectFarmVendor_isActive_idx" ON "DirectFarmVendor"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DirectFarmProduct_slug_key" ON "DirectFarmProduct"("slug");

-- CreateIndex
CREATE INDEX "DirectFarmProduct_isActive_sortOrder_idx" ON "DirectFarmProduct"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "DirectFarmProduct_vendorId_idx" ON "DirectFarmProduct"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectFarmOrder_orderId_key" ON "DirectFarmOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectFarmOrder_paymentKey_key" ON "DirectFarmOrder"("paymentKey");

-- CreateIndex
CREATE INDEX "DirectFarmOrder_productId_idx" ON "DirectFarmOrder"("productId");

-- CreateIndex
CREATE INDEX "DirectFarmOrder_vendorId_idx" ON "DirectFarmOrder"("vendorId");

-- CreateIndex
CREATE INDEX "DirectFarmOrder_status_createdAt_idx" ON "DirectFarmOrder"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DirectFarmOrder_notificationStatus_idx" ON "DirectFarmOrder"("notificationStatus");

-- CreateIndex
CREATE INDEX "DirectFarmNotificationLog_orderId_idx" ON "DirectFarmNotificationLog"("orderId");

-- CreateIndex
CREATE INDEX "DirectFarmNotificationLog_status_idx" ON "DirectFarmNotificationLog"("status");

-- AddForeignKey
ALTER TABLE "DirectFarmProduct" ADD CONSTRAINT "DirectFarmProduct_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "DirectFarmVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectFarmOrder" ADD CONSTRAINT "DirectFarmOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "DirectFarmProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectFarmOrder" ADD CONSTRAINT "DirectFarmOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "DirectFarmVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectFarmNotificationLog" ADD CONSTRAINT "DirectFarmNotificationLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "DirectFarmOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
