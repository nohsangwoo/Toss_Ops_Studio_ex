import { NextResponse } from "next/server";
import { z } from "zod";

import { createDirectFarmOrderDraft } from "@/lib/directfarm/orders";
import { getClientIp, verifyTurnstileToken } from "@/lib/turnstile";

const prepareDirectFarmOrderSchema = z.object({
  productId: z.string().min(1),
  buyerName: z.string().min(2).max(40),
  buyerPhone: z.string().min(8).max(30),
  address: z.string().min(5).max(160),
  addressDetail: z.string().max(120).optional().or(z.literal("")),
  customerKey: z.string().min(2).max(300).optional(),
  turnstileToken: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = prepareDirectFarmOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "주문 정보가 올바르지 않습니다. 배송지와 연락처를 확인해주세요." },
      { status: 400 },
    );
  }

  const turnstileResult = await verifyTurnstileToken(parsed.data.turnstileToken, {
    action: "directfarm_order_prepare",
    remoteIp: getClientIp(request.headers),
  });

  if (!turnstileResult.success) {
    return NextResponse.json(
      { message: "보안 인증에 실패했습니다. 화면을 새로고침한 뒤 다시 시도해주세요." },
      { status: 403 },
    );
  }

  const order = await createDirectFarmOrderDraft(parsed.data.productId, {
    buyerName: parsed.data.buyerName.trim(),
    buyerPhone: parsed.data.buyerPhone.trim(),
    address: parsed.data.address.trim(),
    addressDetail: parsed.data.addressDetail?.trim() || undefined,
    customerKey: parsed.data.customerKey,
  });

  const origin = new URL(request.url).origin;

  return NextResponse.json({
    orderId: order.orderId,
    orderName: order.product.name,
    amount: order.amount,
    currency: order.currency,
    customerKey: order.customerKey,
    successUrl: `${origin}/directfarm/payment/success`,
    failUrl: `${origin}/directfarm/payment/fail`,
  });
}
