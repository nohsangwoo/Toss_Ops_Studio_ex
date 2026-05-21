import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

type FailPageProps = {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
};

export default async function PaymentFailPage({ searchParams }: FailPageProps) {
  const params = await searchParams;

  if (params.orderId) {
    const prisma = getPrisma();
    const payment = await prisma.payment.findUnique({ where: { orderId: params.orderId } });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failureCode: params.code ?? "PAYMENT_FAILED",
          failureMessage: params.message ?? "결제가 실패하거나 중단되었습니다.",
          events: {
            create: {
              type: "PAYMENT_FAILED",
              payload: params,
            },
          },
        },
      });
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>결제가 완료되지 않았습니다</CardTitle>
          <CardDescription>
            {params.message ?? "사용자가 결제를 취소했거나 인증 과정에서 오류가 발생했습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">다시 결제하기</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
