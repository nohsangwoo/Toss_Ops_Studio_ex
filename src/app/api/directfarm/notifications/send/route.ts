import { NextResponse } from "next/server";
import { z } from "zod";

import { sendDirectFarmOrderNotification } from "@/lib/directfarm/notifications";

const sendNotificationSchema = z.object({
  orderId: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sendNotificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "주문번호가 필요합니다." }, { status: 400 });
  }

  try {
    const order = await sendDirectFarmOrderNotification(parsed.data.orderId);

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      notificationStatus: order.notificationStatus,
      sentAt: order.sentAt,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "알림 발송 처리에 실패했습니다." },
      { status: 400 },
    );
  }
}
