import "dotenv/config";
import bcrypt from "bcryptjs";

import { directFarmProducts, directFarmVendors } from "../src/lib/directfarm/demo-data";
import { getPrisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding Neon PostgreSQL database...");
  const prisma = getPrisma();
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);
  console.log("Upserting admin user...");

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      name: "Demo Admin",
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      name: "Demo Admin",
    },
  });

  const existingCount = await prisma.payment.count();
  console.log(`Existing payment logs: ${existingCount}`);

  if (existingCount === 0) {
    await prisma.payment.createMany({
      data: [
        {
          orderId: "order-demo-ready-001",
          orderName: "스타터 통합 점검",
          customerName: "김민준",
          customerEmail: "minjun@example.com",
          customerKey: "customer_demo-ready-001",
          amount: 49000,
          status: "READY",
        },
        {
          orderId: "order-demo-done-001",
          orderName: "토스페이먼츠 PG 연동",
          customerName: "이서연",
          customerEmail: "seoyeon@example.com",
          customerKey: "customer_demo-done-001",
          amount: 299000,
          status: "DONE",
          method: "카드",
          paymentKey: "demo_payment_key_not_cancelable",
          approvedAt: new Date(),
          requestedAt: new Date(),
        },
      ],
    });
  }

  console.log("Upserting DirectFarm vendors and products...");
  const vendorIdByName = new Map<string, string>();

  for (const vendor of directFarmVendors) {
    const existingVendor = await prisma.directFarmVendor.findFirst({
      where: { name: vendor.name },
    });

    const savedVendor = existingVendor
      ? await prisma.directFarmVendor.update({
          where: { id: existingVendor.id },
          data: {
            managerName: vendor.managerName,
            phone: vendor.phone,
            isActive: true,
          },
        })
      : await prisma.directFarmVendor.create({
          data: {
            name: vendor.name,
            managerName: vendor.managerName,
            phone: vendor.phone,
            isActive: true,
          },
        });

    vendorIdByName.set(savedVendor.name, savedVendor.id);
  }

  for (const product of directFarmProducts) {
    const vendorId = vendorIdByName.get(product.vendorName);

    if (!vendorId) {
      throw new Error(`DirectFarm vendor not found: ${product.vendorName}`);
    }

    await prisma.directFarmProduct.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        origin: product.origin,
        unit: product.unit,
        salePrice: product.salePrice,
        wholesalePrice: product.wholesalePrice,
        sortOrder: product.sortOrder,
        vendorId,
        isActive: true,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        origin: product.origin,
        unit: product.unit,
        salePrice: product.salePrice,
        wholesalePrice: product.wholesalePrice,
        sortOrder: product.sortOrder,
        vendorId,
        isActive: true,
      },
    });
  }

  await prisma.$disconnect();
  console.log("Seed complete.");
  process.exit(0);
}

main().catch(async (error) => {
  console.error(error);
  await getPrisma().$disconnect();
  process.exit(1);
});
