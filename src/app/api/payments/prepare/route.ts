import { NextResponse } from "next/server";
import { z } from "zod";

import { getClientIp, verifyTurnstileToken } from "@/lib/turnstile";
import { createPaymentDraft } from "@/lib/payments/orders";

const preparePaymentSchema = z.object({
  productId: z.string().min(1),
  customerKey: z.string().min(2).max(300).optional(),
  customerName: z.string().max(80).optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  turnstileToken: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = preparePaymentSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "결제 요청 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const turnstileResult = await verifyTurnstileToken(parsed.data.turnstileToken, {
    action: "payment_prepare",
    remoteIp: getClientIp(request.headers),
  });

  if (!turnstileResult.success) {
    return NextResponse.json(
      { message: "보안 인증에 실패했습니다. 다시 시도해주세요." },
      { status: 403 },
    );
  }

  const payment = await createPaymentDraft({
    productId: parsed.data.productId,
    customerKey: parsed.data.customerKey,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail || undefined,
  });
  const origin = new URL(request.url).origin;

  return NextResponse.json({
    orderId: payment.orderId,
    orderName: payment.orderName,
    amount: payment.amount,
    currency: payment.currency,
    customerKey: payment.customerKey,
    successUrl: `${origin}/payments/success`,
    failUrl: `${origin}/payments/fail`,
  });
}
