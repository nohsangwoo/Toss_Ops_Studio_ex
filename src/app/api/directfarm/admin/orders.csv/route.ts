import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { formatDateTime } from "@/lib/directfarm/format";
import { getPrisma } from "@/lib/prisma";

function csvCell(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const orders = await getPrisma().directFarmOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, vendor: true },
  });

  const rows = [
    [
      "주문번호",
      "상품",
      "도매처",
      "구매자",
      "연락처",
      "주소",
      "수량",
      "금액",
      "결제상태",
      "도매처전송",
      "주문일",
      "승인일",
    ],
    ...orders.map((order) => [
      order.orderId,
      order.product.name,
      order.vendor.name,
      order.buyerName,
      order.buyerPhone,
      `${order.address} ${order.addressDetail ?? ""}`.trim(),
      order.quantity,
      order.amount,
      order.status,
      order.notificationStatus,
      formatDateTime(order.createdAt),
      formatDateTime(order.approvedAt),
    ]),
  ];

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="directfarm-orders.csv"',
    },
  });
}
