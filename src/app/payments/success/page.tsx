import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPrisma } from "@/lib/prisma";
import { toPrismaJsonInput } from "@/lib/prisma-json";
import { confirmTossPayment, mapTossStatus } from "@/lib/payments/toss";

type SuccessPageProps = {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const paymentKey = params.paymentKey;
  const orderId = params.orderId;
  const amount = Number(params.amount);
  const prisma = getPrisma();

  if (!paymentKey || !orderId || !amount) {
    return <ResultCard title="결제 승인 실패" description="성공 URL 파라미터가 누락되었습니다." />;
  }

  const payment = await prisma.payment.findUnique({ where: { orderId } });

  if (!payment) {
    return <ResultCard title="결제 승인 실패" description="주문 정보를 찾을 수 없습니다." />;
  }

  if (payment.amount !== amount) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureCode: "AMOUNT_MISMATCH",
        failureMessage: "결제 요청 금액과 저장된 주문 금액이 다릅니다.",
        events: {
          create: {
            type: "AMOUNT_MISMATCH",
            payload: { requestedAmount: amount, expectedAmount: payment.amount, paymentKey },
          },
        },
      },
    });

    return <ResultCard title="결제 승인 실패" description="주문 금액 검증에 실패했습니다." />;
  }

  if (payment.status === "DONE") {
    return (
      <ResultCard
        title="이미 승인된 결제입니다"
        description={`${payment.orderName} 결제는 이미 완료되어 있습니다.`}
        status="DONE"
      />
    );
  }

  let confirmedTitle = "";
  let confirmedDescription = "";
  let confirmedStatus = "";
  let confirmedReceiptUrl: string | undefined;

  try {
    const confirmed = await confirmTossPayment({ paymentKey, orderId, amount });
    const confirmedJson = toPrismaJsonInput(confirmed);

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentKey: confirmed.paymentKey,
        status: mapTossStatus(confirmed.status),
        method: confirmed.method ?? null,
        currency: confirmed.currency ?? "KRW",
        requestedAt: confirmed.requestedAt ? new Date(confirmed.requestedAt) : null,
        approvedAt: confirmed.approvedAt ? new Date(confirmed.approvedAt) : null,
        receiptUrl: confirmed.receipt?.url,
        rawResponse: confirmedJson,
        events: {
          create: {
            type: "PAYMENT_CONFIRMED",
            payload: confirmedJson,
          },
        },
      },
    });

    confirmedTitle = "결제가 완료되었습니다";
    confirmedDescription = `${confirmed.orderName ?? payment.orderName} 승인 결과가 데이터베이스에 저장되었습니다.`;
    confirmedStatus = confirmed.status;
    confirmedReceiptUrl = confirmed.receipt?.url;
  } catch (error) {
    const message = error instanceof Error ? error.message : "결제 승인 중 오류가 발생했습니다.";

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        paymentKey,
        failureCode: "CONFIRM_FAILED",
        failureMessage: message,
        events: {
          create: {
            type: "PAYMENT_CONFIRM_FAILED",
            payload: { message, paymentKey, orderId, amount },
          },
        },
      },
    });

    return <ResultCard title="결제 승인 실패" description={message} />;
  }

  return (
    <ResultCard
      title={confirmedTitle}
      description={confirmedDescription}
      status={confirmedStatus}
      receiptUrl={confirmedReceiptUrl}
    />
  );
}

function ResultCard({
  title,
  description,
  status = "FAILED",
  receiptUrl,
}: {
  title: string;
  description: string;
  status?: string;
  receiptUrl?: string;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-3">
            <Badge variant={status === "DONE" ? "default" : "destructive"}>{status}</Badge>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/">결제 페이지</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/payments">관리자 페이지</Link>
            </Button>
            {receiptUrl ? (
              <Button asChild variant="outline">
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
