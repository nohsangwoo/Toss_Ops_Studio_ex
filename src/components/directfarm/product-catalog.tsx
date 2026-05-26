"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DirectFarmCheckout, type DirectFarmCheckoutProduct } from "@/components/directfarm/directfarm-checkout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatWon } from "@/lib/directfarm/format";

export type DirectFarmCatalogProduct = DirectFarmCheckoutProduct & {
  slug: string;
};

export function DirectFarmProductCatalog({ products }: { products: DirectFarmCatalogProduct[] }) {
  const [selectedProduct, setSelectedProduct] = useState<DirectFarmCatalogProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const totalAmount = useMemo(
    () => (selectedProduct ? selectedProduct.salePrice * quantity : 0),
    [quantity, selectedProduct],
  );

  function openProduct(product: DirectFarmCatalogProduct) {
    setSelectedProduct(product);
    setQuantity(1);
    setIsCheckoutOpen(false);
  }

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => openProduct(product)}
            className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-xl"
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
          </button>
        ))}
      </div>

      <Dialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[32px] bg-white p-0 sm:max-w-5xl">
          {selectedProduct ? (
            <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="border-b border-neutral-200 lg:border-r lg:border-b-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[32px] lg:rounded-tr-none">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-5 p-6">
                  <DialogHeader>
                    <DialogDescription className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                      {selectedProduct.origin} · {selectedProduct.vendorName}
                    </DialogDescription>
                    <DialogTitle className="text-3xl font-semibold tracking-tight">
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="leading-7 text-neutral-600">{selectedProduct.description}</p>
                  <div className="rounded-3xl bg-neutral-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-500">수량</p>
                        <p className="mt-1 text-sm font-medium">{selectedProduct.unit} 기준</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                        >
                          <Minus />
                        </Button>
                        <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => setQuantity((current) => Math.min(current + 1, 20))}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                      <span className="text-sm text-neutral-500">총 결제 금액</span>
                      <span className="font-mono text-2xl font-semibold">{formatWon(totalAmount)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="h-12 rounded-full bg-[#ff385c] px-6 text-white hover:bg-[#e31c5f]"
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      <ShoppingBag />
                      결제 진행
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-full px-6">
                      <Link href={`/directfarm/products/${selectedProduct.slug}`}>상세 페이지</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[#f7f7f7] p-4 sm:p-6">
                {isCheckoutOpen ? (
                  <DirectFarmCheckout product={selectedProduct} quantity={quantity} variant="inline" />
                ) : (
                  <div className="flex min-h-[520px] flex-col justify-center rounded-[28px] border border-dashed border-neutral-300 bg-white p-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                      Ready to Checkout
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                      수량을 정한 뒤 결제를 진행하세요.
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-neutral-600">
                      결제 진행 버튼을 누르면 이 영역에서 배송지 입력, 보안 인증, 결제위젯이 자연스럽게 확장됩니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
