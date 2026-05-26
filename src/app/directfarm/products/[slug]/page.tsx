import { ArrowLeft, ArrowRight, Building2, MapPin, PackageCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatWon } from "@/lib/directfarm/format";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DirectFarmProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DirectFarmProductPage({ params }: DirectFarmProductPageProps) {
  const { slug } = await params;
  const product = await getPrisma().directFarmProduct.findFirst({
    where: { slug, isActive: true, vendor: { isActive: true } },
    include: { vendor: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/directfarm">
            <ArrowLeft />
            상품 목록
          </Link>
        </Button>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-[40px] border border-neutral-200 bg-neutral-100">
          <div className="relative aspect-[4/3]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <aside className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
            {product.origin}
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-xl leading-8 text-neutral-600">{product.description}</p>

          <div className="mt-8 rounded-[32px] border border-neutral-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">판매가</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight">{formatWon(product.salePrice)}</p>
              </div>
              <Button asChild className="h-14 rounded-full bg-[#ff385c] px-7 text-white hover:bg-[#e31c5f]">
                <Link href={`/directfarm/checkout/${product.id}`}>
                  주문하기
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoTile icon={<MapPin />} label="원산지" value={product.origin} />
            <InfoTile icon={<PackageCheck />} label="단위" value={product.unit} />
            <InfoTile icon={<Building2 />} label="도매처" value={product.vendor.name} />
            <InfoTile icon={<Truck />} label="배송" value="결제 후 산지 직송" />
          </div>

          <Separator className="my-8" />
          <p className="text-sm leading-6 text-neutral-500">
            결제 금액은 서버에서 DB 상품 가격 기준으로 다시 검증합니다. 결제 완료 후 주문번호,
            배송지, 연락처가 도매처 전송 로그에 남습니다.
          </p>
        </aside>
      </section>
    </main>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
      <div className="text-[#ff385c] [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <p className="mt-4 text-sm text-neutral-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
