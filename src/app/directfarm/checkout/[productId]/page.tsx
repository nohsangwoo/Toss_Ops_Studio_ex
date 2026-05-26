import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DirectFarmCheckout } from "@/components/directfarm/directfarm-checkout";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DirectFarmCheckoutPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function DirectFarmCheckoutPage({ params }: DirectFarmCheckoutPageProps) {
  const { productId } = await params;
  const product = await getPrisma().directFarmProduct.findFirst({
    where: { id: productId, isActive: true, vendor: { isActive: true } },
    include: { vendor: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <Button asChild variant="ghost" className="rounded-full">
          <Link href={`/directfarm/products/${product.slug}`}>
            <ArrowLeft />
            상품 상세
          </Link>
        </Button>
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 pb-12">
        <DirectFarmCheckout
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            origin: product.origin,
            unit: product.unit,
            salePrice: product.salePrice,
            vendorName: product.vendor.name,
          }}
        />
      </section>
    </main>
  );
}
