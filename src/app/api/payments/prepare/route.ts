import { NextResponse } from "next/server";
import { z } from "zod";

import { createPaymentDraft } from "@/lib/payments/orders";

const preparePaymentSchema = z.object({
  productId: z.string().min(1),
  customerKey: z.string().min(2).max(300).optional(),
  customerName: z.string().max(80).optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = preparePaymentSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "결제 요청 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const payment = await createPaymentDraft({
    productId: parsed.data.productId,
    customerKey: parsed.data.customerKey,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail || undefined,
  });

  return NextResponse.json({
    orderId: payment.orderId,
    orderName: payment.orderName,
    amount: payment.amount,
    currency: payment.currency,
    customerKey: payment.customerKey,
    successUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/payments/success`,
    failUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/payments/fail`,
  });
}
