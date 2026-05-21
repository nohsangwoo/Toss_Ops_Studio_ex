import { randomUUID } from "node:crypto";

import { getPrisma } from "@/lib/prisma";
import { getProduct } from "@/lib/payments/products";

export async function createPaymentDraft(input: {
  productId: string;
  customerName?: string;
  customerEmail?: string;
  customerKey?: string;
}) {
  const product = getProduct(input.productId);
  const orderId = `order-${randomUUID().replaceAll("-", "").slice(0, 24)}`;
  const customerKey = input.customerKey ?? `customer_${randomUUID()}`;
  const prisma = getPrisma();

  const payment = await prisma.payment.create({
    data: {
      orderId,
      orderName: product.name,
      amount: product.price,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerKey,
      status: "READY",
      events: {
        create: {
          type: "PAYMENT_DRAFT_CREATED",
          payload: {
            productId: product.id,
            amount: product.price,
            orderName: product.name,
          },
        },
      },
    },
  });

  return payment;
}
