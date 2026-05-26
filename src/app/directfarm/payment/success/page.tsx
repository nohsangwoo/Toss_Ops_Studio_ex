import Link from "next/link";

import { DirectFarmAutoReset } from "@/components/directfarm/auto-reset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendDirectFarmOrderNotification } from "@/lib/directfarm/notifications";
import { confirmTossPayment } from "@/lib/payments/toss";
import { getPrisma } from "@/lib/prisma";
import { toPrismaJsonInput } from "@/lib/prisma-json";

export const dynamic = "force-dynamic";

type DirectFarmPaymentSuccessPageProps = {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
};

type ResultCardProps = {
  status: string;
  title: string;
  description: string;
  receiptUrl?: string;
};

export default async function DirectFarmPaymentSuccessPage({
  searchParams,
}: DirectFarmPaymentSuccessPageProps) {
  const params = await searchParams;
  const paymentKey = params.paymentKey;
  const orderId = params.orderId;
  const amount = Number(params.amount);
  const prisma = getPrisma();

  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    return <ResultCard status="FAILED" title="결제 승인 실패" description="성공 URL 정보가 올바르지 않습니다." />;
  }

  const order = await prisma.directFarmOrder.findUnique({
    where: { orderId },
    include: { product: true, vendor: true },
  });

  if (!order) {
    return <ResultCard status="FAILED" title="결제 승인 실패" description="주문 초안을 찾을 수 없습니다." />;
  }

  if (order.amount !== amount) {
    await prisma.directFarmOrder.update({
      where: { id: order.id },
      data: {
        status: "FAILED",
        paymentKey,
        failureCode: "AMOUNT_MISMATCH",
        failureMessage: "DB 상품 가격과 결제 요청 금액이 다릅니다.",
      },
    });

    return <ResultCard status="FAILED" title="결제 승인 실패" description="결제 금액 검증에 실패했습니다." />;
  }

  if (order.status === "PAID") {
    if (order.notificationStatus !== "SENT") {
      await sendDirectFarmOrderNotification(order.orderId);
    }

    return (
      <ResultCard
        status="PAID"
        title="이미 승인된 주문입니다"
        description={`${order.product.name} 주문이 결제 완료 상태로 저장되어 있습니다.`}
        receiptUrl={order.receiptUrl ?? undefined}
      />
    );
  }

  let result: ResultCardProps;

  try {
    const confirmed = await confirmTossPayment({ paymentKey, orderId, amount });
    const confirmedJson = toPrismaJsonInput(confirmed);
    const isPaid = confirmed.status === "DONE";

    const updatedOrder = await prisma.directFarmOrder.update({
      where: { id: order.id },
      data: {
        paymentKey: confirmed.paymentKey,
        status: isPaid ? "PAID" : "PAYMENT_PENDING",
        method: confirmed.method ?? null,
        currency: confirmed.currency ?? "KRW",
        requestedAt: confirmed.requestedAt ? new Date(confirmed.requestedAt) : null,
        approvedAt: confirmed.approvedAt ? new Date(confirmed.approvedAt) : null,
        receiptUrl: confirmed.receipt?.url,
        rawResponse: confirmedJson,
      },
      include: { product: true, vendor: true },
    });

    if (isPaid) {
      await sendDirectFarmOrderNotification(updatedOrder.orderId);
    }

    result = {
      status: isPaid ? "PAID" : confirmed.status,
      title: isPaid ? "주문과 결제가 완료되었습니다" : "결제 승인 대기 상태입니다",
      description: isPaid
        ? `${updatedOrder.vendor.name}으로 전송할 주문 로그를 생성했습니다.`
        : "Toss 응답이 완료 상태가 아니어서 알림 전송은 보류했습니다.",
      receiptUrl: confirmed.receipt?.url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다.";

    await prisma.directFarmOrder.update({
      where: { id: order.id },
      data: {
        status: "FAILED",
        paymentKey,
        failureCode: "CONFIRM_FAILED",
        failureMessage: message,
      },
    });

    result = {
      status: "FAILED",
      title: "결제 승인 실패",
      description: message,
    };
  }

  return <ResultCard {...result} />;
}

function ResultCard({ status, title, description, receiptUrl }: ResultCardProps) {
  const isSuccess = status === "PAID";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6 py-12">
      <Card className="w-full max-w-xl rounded-[32px] border-neutral-200 bg-white">
        <CardHeader>
          <Badge className={isSuccess ? "w-fit bg-[#ff385c] text-white" : "w-fit"} variant={isSuccess ? "default" : "destructive"}>
            {status}
          </Badge>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <DirectFarmAutoReset />
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full bg-[#ff385c] text-white hover:bg-[#e31c5f]">
              <Link href="/directfarm">주문 화면</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/directfarm/admin">관리자</Link>
            </Button>
            {receiptUrl ? (
              <Button asChild variant="outline" className="rounded-full">
                <a href={receiptUrl} target="_blank" rel="noreferrer">
                  영수증
                </a>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
