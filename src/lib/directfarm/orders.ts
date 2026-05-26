import { randomUUID } from "node:crypto";

import { getPrisma } from "@/lib/prisma";

export type DirectFarmShippingInput = {
  buyerName: string;
  buyerPhone: string;
  address: string;
  addressDetail?: string;
  customerKey?: string;
};

export async function createDirectFarmOrderDraft(productId: string, input: DirectFarmShippingInput) {
  const prisma = getPrisma();
  const product = await prisma.directFarmProduct.findFirst({
    where: {
      id: productId,
      isActive: true,
      vendor: { isActive: true },
    },
    include: { vendor: true },
  });

  if (!product) {
    throw new Error("판매 중인 상품을 찾을 수 없습니다.");
  }

  const orderId = `df-${randomUUID().replaceAll("-", "").slice(0, 24)}`;
  const customerKey = input.customerKey ?? `directfarm_${randomUUID()}`;

  return prisma.directFarmOrder.create({
    data: {
      orderId,
      productId: product.id,
      vendorId: product.vendorId,
      buyerName: input.buyerName,
      buyerPhone: input.buyerPhone,
      address: input.address,
      addressDetail: input.addressDetail,
      amount: product.salePrice,
      customerKey,
      status: "DRAFT",
      notificationStatus: "PENDING",
    },
    include: {
      product: true,
      vendor: true,
    },
  });
}
