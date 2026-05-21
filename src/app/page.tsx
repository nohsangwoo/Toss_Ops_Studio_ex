import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Check,
  CreditCard,
  ReceiptText,
} from "lucide-react";

import { PaymentWidgetCheckout } from "@/components/payments/payment-widget-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/payments/products";

export default function Home() {
  const featuredProduct = MOCK_PRODUCTS.find((product) => product.id === "payment-widget") ?? MOCK_PRODUCTS[0];

  return (
    <main className="min-h-screen bg-[var(--color-claude-canvas)] text-[var(--color-claude-ink)]">
      <TopNav />

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_520px] lg:py-24">
        <div className="flex flex-col justify-center">
          <Badge className="w-fit rounded-full bg-[var(--color-claude-card)] px-3 py-1 text-[var(--color-claude-ink)]">
            Next.js 15 · Prisma · PGlite · Toss Payments
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.035em] text-[var(--color-claude-ink)] md:text-7xl">
            결제 연동을 제품처럼 완성하는 주문서와 운영 화면
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-claude-body)]">
            토스페이먼츠 결제위젯, 서버 승인, 결제 로그, 관리자 환불 기능을 하나의
            구매 경험으로 묶었습니다. 제안용 목업이지만 실제 구현 흐름을 그대로
            따라갈 수 있게 구성했습니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-10 rounded-md bg-[var(--color-claude-primary)] px-5 text-white hover:bg-[var(--color-claude-primary-active)]"
            >
              <Link href="/products/payment-widget">
                결제위젯 보기
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-md border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)] px-5"
            >
              <Link href="/admin/payments">관리자 대시보드</Link>
            </Button>
          </div>

          <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            <ProofPoint label="서버 승인" value="Confirm API" />
            <ProofPoint label="결제 로그" value="Prisma ORM" />
            <ProofPoint label="운영 액션" value="Cancel API" />
          </div>
        </div>

        <div className="rounded-xl bg-[var(--color-claude-dark)] p-4 text-[var(--color-claude-on-dark)]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[var(--color-claude-dark-soft)]">
            <Image
              src={featuredProduct.image}
              alt={`${featuredProduct.name} 이미지`}
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full object-cover"
              priority
            />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-claude-on-dark-soft)]">
                    Featured checkout
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.02em]">
                    {featuredProduct.shortName}
                  </h2>
                </div>
                <p className="rounded-full bg-[var(--color-claude-primary)] px-3 py-1 text-sm">
                  위젯형
                </p>
              </div>
              <p className="leading-7 text-[var(--color-claude-on-dark-soft)]">
                주문서 안에서 결제수단과 약관 UI를 직접 렌더링하고, 성공 리다이렉트 이후
                서버가 최종 승인합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="border-y border-[var(--color-claude-hairline)] bg-[var(--color-claude-soft)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-claude-primary)]">
                Product catalog
              </p>
              <h2 className="mt-4 font-display text-5xl font-medium leading-none tracking-[-0.03em]">
                제안 범위를 그대로 상품화했습니다
              </h2>
              <p className="mt-5 leading-7 text-[var(--color-claude-body)]">
                각 상품은 상세 페이지, 산출물, 예상 기간, 결제 위젯 주문서를 갖습니다.
                제안서 설명과 시연 흐름을 같은 화면에서 해결할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <Card className="h-full overflow-hidden rounded-lg border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)] shadow-none transition-transform duration-200 group-hover:-translate-y-1">
                    <Image
                      src={product.image}
                      alt={`${product.name} 상품 이미지`}
                      width={1536}
                      height={1024}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <CardContent className="flex h-[320px] flex-col p-6">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-claude-muted)]">
                        {product.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-3xl font-medium leading-none tracking-[-0.025em]">
                        {product.shortName}
                      </h3>
                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--color-claude-body)]">
                        {product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-[var(--color-claude-hairline)] pt-5">
                        <p className="font-mono text-sm">{product.price.toLocaleString("ko-KR")}원</p>
                        <ArrowRight className="h-4 w-4 text-[var(--color-claude-primary)]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1fr_480px]">
        <div className="rounded-xl bg-[var(--color-claude-dark)] p-6 text-[var(--color-claude-on-dark)]">
          <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-claude-on-dark-soft)]">
            <span className="h-3 w-3 rounded-full bg-[var(--color-claude-primary)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-claude-amber)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--color-claude-teal)]" />
            <span className="ml-2 font-mono">server/payment-flow.ts</span>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-[var(--color-claude-dark-soft)] p-5 font-mono text-sm leading-7 text-[var(--color-claude-on-dark-soft)]">
            <code>{`const widgets = tossPayments.widgets({ customerKey })
await widgets.setAmount({ value, currency: "KRW" })
await widgets.renderPaymentMethods({ selector })
await widgets.renderAgreement({ selector })

// successUrl 이후 서버에서 금액 검증
await confirmPayment({ paymentKey, orderId, amount })`}</code>
          </pre>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-claude-primary)]">
            Checkout widget
          </p>
          <h2 className="mt-4 font-display text-5xl font-medium leading-none tracking-[-0.03em]">
            결제수단 UI를 직접 그리지 않습니다
          </h2>
          <p className="mt-5 leading-7 text-[var(--color-claude-body)]">
            토스페이먼츠 결제위젯은 결제수단과 약관 UI를 SDK가 렌더링합니다. 클라이언트는
            인증만 시작하고, 서버는 저장된 주문 금액으로 최종 승인합니다.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[var(--color-claude-body)]">
            {["Payment Widget 기본 채택", "서버 권위 금액 검증", "관리자 환불 API 연결"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[var(--color-claude-primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="grid gap-8 rounded-xl bg-[var(--color-claude-primary)] p-8 text-white lg:grid-cols-[1fr_480px] lg:p-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/75">
              Live checkout
            </p>
            <h2 className="mt-4 font-display text-5xl font-medium leading-none tracking-[-0.03em]">
              이 화면에서 바로 결제위젯을 테스트하세요
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/80">
              테스트 키를 사용하면 실제 과금 없이 결제 인증 흐름을 확인할 수 있습니다.
              성공 URL에서는 서버가 결제 금액을 다시 검증한 뒤 승인 API를 호출합니다.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-claude-canvas)] p-4 text-[var(--color-claude-ink)]">
            <PaymentWidgetCheckout initialProductId="payment-widget" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 font-medium">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-claude-ink)] text-[var(--color-claude-canvas)]">
            ✣
          </span>
          Toss Ops Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-claude-muted)] md:flex">
          <a href="#products">상품</a>
          <Link href="/showcase">시연</Link>
          <Link href="/products/payment-widget">결제위젯</Link>
          <Link href="/admin/payments">어드민</Link>
        </nav>
      </div>
    </header>
  );
}

function ProofPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[var(--color-claude-hairline)] pl-4">
      <p className="text-sm text-[var(--color-claude-muted)]">{label}</p>
      <p className="mt-1 font-mono text-sm text-[var(--color-claude-ink)]">{value}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--color-claude-dark)] px-6 py-12 text-[var(--color-claude-on-dark-soft)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-[var(--color-claude-on-dark)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-claude-canvas)] text-[var(--color-claude-dark)]">
              ✣
            </span>
            Toss Ops Studio
          </div>
          <p className="mt-4 max-w-md text-sm leading-6">
            토스페이먼츠 PG 연동, 결제위젯, 관리자 환불 기능을 제안용 목업에서 실제
            구현 흐름으로 보여주는 Next.js 프로젝트입니다.
          </p>
        </div>
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <FooterLink icon={<CreditCard />} label="결제위젯" href="/products/payment-widget" />
          <FooterLink icon={<ReceiptText />} label="운영 어드민" href="/admin/payments" />
          <FooterLink icon={<Braces />} label="Toss 문서" href="https://docs.tosspayments.com/guides/v2/get-started/llms-guide" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  const isExternal = href.startsWith("http");

  const content = (
    <>
      {icon}
      {label}
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-2">
      {content}
    </Link>
  );
}
