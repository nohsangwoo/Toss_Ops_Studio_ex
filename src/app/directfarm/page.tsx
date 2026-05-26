import { ArrowRight, BadgeCheck, MapPin, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { directFarmHeroAssets } from "@/lib/directfarm/demo-data";
import { formatWon } from "@/lib/directfarm/format";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DirectFarmPage() {
  const products = await getPrisma().directFarmProduct.findMany({
    where: { isActive: true, vendor: { isActive: true } },
    include: { vendor: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const featured = products[0];

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/directfarm" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff385c] text-sm font-bold text-white">
              DF
            </span>
            <span className="text-xl font-semibold tracking-tight">DirectFarm</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
            <a href="#products" className="hover:text-neutral-950">
              상품
            </a>
            <a href="#process" className="hover:text-neutral-950">
              주문 흐름
            </a>
            <Link href="/directfarm/admin" className="hover:text-neutral-950">
              관리자
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
            <MapPin className="h-4 w-4 text-[#ff385c]" />
            야외 태블릿 무인 산지직송 MVP
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            화면에서 바로 고르고, QR로 결제하고, 산지에서 출고합니다.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-neutral-600">
            테이블오더처럼 가볍게 주문하지만, 결제 완료 후 주문 내역은 상품별 도매처로 바로 전달되는 단건 빠른 결제형 키오스크입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full bg-[#ff385c] px-6 text-white hover:bg-[#e31c5f]">
              <a href="#products">
                상품 주문 시작
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6">
              <Link href="/directfarm/admin">관리자 대시보드</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-sm text-neutral-600">
            <KioskMetric label="결제" value="Toss QR" />
            <KioskMetric label="보안" value="Turnstile" />
            <KioskMetric label="전송" value="Mock SMS" />
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[40px] border border-neutral-200 bg-neutral-100 shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={directFarmHeroAssets.hero}
                alt="DirectFarm 무인 주문 키오스크"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="grid gap-3 bg-white p-5 sm:grid-cols-3">
              <FeaturePill icon={<ReceiptText />} label="단건 결제" />
              <FeaturePill icon={<Truck />} label="도매처 전달" />
              <FeaturePill icon={<ShieldCheck />} label="보안 인증" />
            </div>
          </div>
          {featured ? (
            <Link
              href={`/directfarm/products/${featured.slug}`}
              className="absolute -bottom-6 left-6 right-6 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-2xl transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                    추천 상품
                  </p>
                  <p className="mt-1 text-xl font-semibold">{featured.name}</p>
                  <p className="text-sm text-neutral-500">
                    {featured.origin} · {featured.vendor.name}
                  </p>
                </div>
                <p className="font-mono text-lg">{formatWon(featured.salePrice)}</p>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section id="products" className="border-t border-neutral-200 bg-[#f7f7f7] py-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                Product Catalog
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                사진 중심으로 빠르게 고르는 산지 상품
              </h2>
            </div>
            <p className="max-w-xl text-neutral-600">
              장바구니 없이 상품 하나를 선택하고 배송지를 입력하면 바로 결제위젯으로 연결됩니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/directfarm/products/${product.slug}`}
                className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    loading="eager"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      {product.origin}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">{product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                    <span className="font-mono font-semibold">{formatWon(product.salePrice)}</span>
                    <span className="rounded-full bg-neutral-950 px-3 py-1 text-sm font-semibold text-white">
                      주문
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.85fr_1fr]">
        <div className="relative overflow-hidden rounded-[36px] bg-neutral-950">
          <Image
            src={directFarmHeroAssets.packing}
            alt="산지 포장 작업"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            loading="eager"
            className="object-cover opacity-80"
          />
          <div className="relative min-h-[420px] p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Wholesale Dispatch
            </p>
            <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight">
              결제 완료 즉시 도매처 전송 로그까지 남깁니다.
            </h2>
          </div>
        </div>
        <div className="grid gap-4">
          <ProcessStep index="01" title="상품 선택" description="태블릿 화면에서 사진, 원산지, 판매가를 보고 단건 상품을 선택합니다." />
          <ProcessStep index="02" title="배송지 입력" description="큰 입력창과 CTA로 야외 키오스크 터치 환경에 맞췄습니다." />
          <ProcessStep index="03" title="QR 간편결제" description="Toss Payments 결제위젯에서 QR/간편결제를 호출합니다." />
          <ProcessStep index="04" title="도매처 전달" description="결제 승인 후 주문 내역과 배송지를 도매처 알림 로그로 저장합니다." />
        </div>
      </section>
    </main>
  );
}

function KioskMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-700">
      <span className="text-[#ff385c] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {label}
    </div>
  );
}

function ProcessStep({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6">
      <div className="flex items-start gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff385c] font-mono text-sm font-semibold text-white">
          {index}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-[#ff385c]" />
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          </div>
          <p className="mt-2 text-neutral-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
