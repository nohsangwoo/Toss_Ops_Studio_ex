import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, PackageCheck } from "lucide-react";

import { PaymentWidgetCheckout } from "@/components/payments/payment-widget-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_PRODUCTS, getProductBySlug } from "@/lib/payments/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--color-claude-canvas)] text-[var(--color-claude-ink)]">
      <header className="border-b border-[var(--color-claude-hairline)]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[var(--color-claude-muted)]">
            <ArrowLeft className="h-4 w-4" />
            상품 목록
          </Link>
          <Button
            asChild
            variant="outline"
            className="rounded-md border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)]"
          >
            <Link href="/admin/payments">관리자 대시보드</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_440px]">
        <div>
          <Badge className="rounded-full bg-[var(--color-claude-card)] px-3 py-1 text-[var(--color-claude-ink)]">
            {product.eyebrow}
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-none tracking-[-0.035em] md:text-7xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--color-claude-body)]">
            {product.detail}
          </p>

          <div className="mt-10 overflow-hidden rounded-xl border border-[var(--color-claude-hairline)]">
            <Image
              src={product.image}
              alt={`${product.name} 상품 이미지`}
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full object-cover"
              priority
            />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <InfoCard label="상품 금액" value={`${product.price.toLocaleString("ko-KR")}원`} />
            <InfoCard label="예상 기간" value={product.period} />
            <InfoCard label="추천 대상" value="운영 중 서비스" />
          </div>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="rounded-lg border-[var(--color-claude-hairline)] bg-[var(--color-claude-card)] shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-claude-primary)]">
                  <PackageCheck className="h-4 w-4" />
                  포함 범위
                </div>
                <Separator className="my-5 bg-[var(--color-claude-hairline)]" />
                <ul className="space-y-3 text-sm leading-6 text-[var(--color-claude-body)]">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-claude-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)] shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-claude-primary)]">
                  <Clock className="h-4 w-4" />
                  산출물
                </div>
                <Separator className="my-5 bg-[var(--color-claude-hairline)]" />
                <ul className="space-y-3 text-sm leading-6 text-[var(--color-claude-body)]">
                  {product.outputs.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-claude-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)] p-5">
            <div className="mb-5">
              <p className="text-sm text-[var(--color-claude-muted)]">주문서</p>
              <h2 className="mt-2 font-display text-4xl font-medium leading-none tracking-[-0.03em]">
                결제위젯으로 구매하기
              </h2>
            </div>
            <PaymentWidgetCheckout initialProductId={product.id} allowProductSelect={false} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-claude-hairline)] bg-[var(--color-claude-soft)] p-5">
      <p className="text-sm text-[var(--color-claude-muted)]">{label}</p>
      <p className="mt-2 font-medium text-[var(--color-claude-ink)]">{value}</p>
    </div>
  );
}
