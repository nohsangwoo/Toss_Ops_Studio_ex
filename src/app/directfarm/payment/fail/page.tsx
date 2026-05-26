import Link from "next/link";

import { DirectFarmAutoReset } from "@/components/directfarm/auto-reset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DirectFarmPaymentFailPageProps = {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
};

export default async function DirectFarmPaymentFailPage({ searchParams }: DirectFarmPaymentFailPageProps) {
  const params = await searchParams;

  if (params.orderId) {
    const order = await getPrisma().directFarmOrder.findUnique({ where: { orderId: params.orderId } });

    if (order) {
      await getPrisma().directFarmOrder.update({
        where: { id: order.id },
        data: {
          status: "FAILED",
          failureCode: params.code ?? "PAYMENT_FAILED",
          failureMessage: params.message ?? "결제가 중단되었거나 실패했습니다.",
        },
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6 py-12">
      <Card className="w-full max-w-xl rounded-[32px] border-neutral-200 bg-white">
        <CardHeader>
          <Badge variant="destructive" className="w-fit">
            FAILED
          </Badge>
          <CardTitle className="text-3xl">결제가 완료되지 않았습니다</CardTitle>
          <CardDescription className="text-base">
            {params.message ?? "사용자가 결제를 중단했거나 인증 과정에서 실패했습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <DirectFarmAutoReset />
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full bg-[#ff385c] text-white hover:bg-[#e31c5f]">
              <Link href="/directfarm">다시 주문</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/directfarm/admin">관리자</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
