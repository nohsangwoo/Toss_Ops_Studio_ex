import { getPrisma } from "@/lib/prisma";
import { toPrismaJsonInput } from "@/lib/prisma-json";

export async function sendDirectFarmOrderNotification(orderId: string) {
  const prisma = getPrisma();
  const order = await prisma.directFarmOrder.findUnique({
    where: { orderId },
    include: { product: true, vendor: true },
  });

  if (!order) {
    throw new Error("주문을 찾을 수 없습니다.");
  }

  if (order.status !== "PAID") {
    throw new Error("결제 완료 주문만 도매처로 전송할 수 있습니다.");
  }

  if (order.notificationStatus === "SENT") {
    return order;
  }

  const provider = process.env.DIRECTFARM_NOTIFY_PROVIDER ?? "mock";
  const channel = provider === "aligo" || provider === "solapi" ? "ALIMTALK" : "SMS";
  const message = [
    "[DirectFarm 산지직송 주문]",
    `상품: ${order.product.name}`,
    `수량/단위: ${order.product.unit}`,
    `결제금액: ${order.amount.toLocaleString("ko-KR")}원`,
    `수령인: ${order.buyerName}`,
    `연락처: ${order.buyerPhone}`,
    `주소: ${order.address} ${order.addressDetail ?? ""}`.trim(),
    `주문번호: ${order.orderId}`,
  ].join("\n");

  const payload = {
    provider,
    channel,
    to: order.vendor.phone,
    managerName: order.vendor.managerName,
    message,
    mode: provider === "mock" ? "mock_success" : "provider_ready",
  };

  try {
    await prisma.directFarmNotificationLog.create({
      data: {
        orderId: order.id,
        recipientPhone: order.vendor.phone,
        channel,
        provider,
        status: "SENT",
        payload: toPrismaJsonInput(payload),
        sentAt: new Date(),
      },
    });

    return prisma.directFarmOrder.update({
      where: { id: order.id },
      data: {
        notificationStatus: "SENT",
        sentAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.directFarmNotificationLog.create({
      data: {
        orderId: order.id,
        recipientPhone: order.vendor.phone,
        channel,
        provider,
        status: "FAILED",
        payload: toPrismaJsonInput(payload),
        errorMessage: error instanceof Error ? error.message : "알림 발송 실패",
      },
    });

    return prisma.directFarmOrder.update({
      where: { id: order.id },
      data: { notificationStatus: "FAILED" },
    });
  }
}

export function createDirectFarmNotificationSummary(status: string) {
  if (status === "SENT") return "도매처 전송 완료";
  if (status === "FAILED") return "도매처 전송 실패";
  if (status === "SKIPPED") return "전송 제외";
  return "전송 대기";
}
