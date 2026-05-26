"use client";

import { CreditCard, Loader2, MapPin, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatWon } from "@/lib/directfarm/format";
import { getPaymentSdkErrorMessage, normalizeMobilePhone } from "@/lib/payments/sdk-error";

type TossPaymentsFactory = NonNullable<Window["TossPayments"]>;
type TossWidgets = ReturnType<ReturnType<TossPaymentsFactory>["widgets"]>;

type PreparedDirectFarmOrder = {
  orderId: string;
  orderName: string;
  amount: number;
  currency: "KRW";
  customerKey: string;
  successUrl: string;
  failUrl: string;
};

export type DirectFarmCheckoutProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  origin: string;
  unit: string;
  salePrice: number;
  vendorName: string;
};

function createCustomerKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `directfarm_${crypto.randomUUID()}`;
  }

  return `directfarm_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function loadTossSdk() {
  if (window.TossPayments) {
    return window.TossPayments;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.tosspayments.com/v2/standard"]',
    );

    if (existingScript) {
      if (window.TossPayments) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Toss SDK load failed.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Toss SDK load failed."));
    document.head.appendChild(script);
  });

  if (!window.TossPayments) {
    throw new Error("토스페이먼츠 SDK를 불러오지 못했습니다.");
  }

  return window.TossPayments;
}

function widgetId(prefix: string, id: string) {
  return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

export function DirectFarmCheckout({
  product,
  quantity = 1,
  variant = "full",
}: {
  product: DirectFarmCheckoutProduct;
  quantity?: number;
  variant?: "full" | "inline";
}) {
  const [buyerName, setBuyerName] = useState("홍길동");
  const [buyerPhone, setBuyerPhone] = useState("010-1234-5678");
  const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123");
  const [addressDetail, setAddressDetail] = useState("DirectFarm 테스트 배송지");
  const [customerKey] = useState(createCustomerKey);
  const [widgetMessage, setWidgetMessage] = useState("결제수단 UI를 준비하고 있습니다.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const widgetsRef = useRef<TossWidgets | null>(null);
  const totalAmount = product.salePrice * quantity;

  const paymentMethodsId = useMemo(() => widgetId("directfarm-payment-methods", product.id), [product.id]);
  const agreementId = useMemo(() => widgetId("directfarm-agreement", product.id), [product.id]);

  useEffect(() => {
    let canceled = false;

    async function renderWidget() {
      setErrorMessage(null);
      setWidgetMessage("토스페이먼츠 결제위젯을 불러오는 중입니다.");
      widgetsRef.current = null;

      document.getElementById(paymentMethodsId)?.replaceChildren();
      document.getElementById(agreementId)?.replaceChildren();

      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_ID;

        if (!clientKey) {
          throw new Error("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_ID가 설정되어 있지 않습니다.");
        }

        const TossPayments = await loadTossSdk();
        const widgets = TossPayments(clientKey).widgets({ customerKey });

        await widgets.setAmount({ value: totalAmount, currency: "KRW" });
        await widgets.renderPaymentMethods({ selector: `#${paymentMethodsId}`, variantKey: "DEFAULT" });
        await widgets.renderAgreement({ selector: `#${agreementId}`, variantKey: "AGREEMENT" });

        if (!canceled) {
          widgetsRef.current = widgets;
          setWidgetMessage("결제위젯이 준비되었습니다.");
        }
      } catch (error) {
        if (!canceled) {
          setWidgetMessage("결제위젯 준비 실패");
          setErrorMessage(
            error instanceof Error ? error.message : "결제위젯을 렌더링하는 중 오류가 발생했습니다.",
          );
        }
      }
    }

    renderWidget();

    return () => {
      canceled = true;
    };
  }, [agreementId, customerKey, paymentMethodsId, totalAmount]);

  function requestPayment() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        if (!widgetsRef.current) {
          throw new Error("결제위젯이 아직 준비되지 않았습니다.");
        }

        if (!turnstileToken) {
          throw new Error("보안 인증을 완료해주세요.");
        }

        const response = await fetch("/api/directfarm/orders/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            buyerName,
            buyerPhone,
            address,
            addressDetail,
            quantity,
            customerKey,
            turnstileToken,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          throw new Error(payload.message ?? "주문 생성에 실패했습니다.");
        }

        const prepared = (await response.json()) as PreparedDirectFarmOrder;

        await widgetsRef.current.requestPayment({
          orderId: prepared.orderId,
          orderName: prepared.orderName,
          successUrl: prepared.successUrl,
          failUrl: prepared.failUrl,
          customerName: buyerName,
          customerMobilePhone: normalizeMobilePhone(buyerPhone),
        });
      } catch (error) {
        setTurnstileToken(null);
        setTurnstileResetKey((key) => key + 1);
        setErrorMessage(getPaymentSdkErrorMessage(error, "결제 요청 중 오류가 발생했습니다."));
      }
    });
  }

  const checkoutPanel = (
    <section
      className={
        variant === "inline"
          ? "rounded-[28px] border border-neutral-200 bg-white p-4 sm:p-5"
          : "rounded-[32px] border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6"
      }
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Shipping & Payment
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">배송지 입력 후 QR 결제</h1>
        </div>
        <div className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white">
          {quantity}개 · {formatWon(totalAmount)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buyerName" className="text-base">
            수령인
          </Label>
          <Input
            id="buyerName"
            value={buyerName}
            onChange={(event) => setBuyerName(event.target.value)}
            className="h-14 rounded-2xl text-lg"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buyerPhone" className="text-base">
            연락처
          </Label>
          <Input
            id="buyerPhone"
            value={buyerPhone}
            onChange={(event) => setBuyerPhone(event.target.value)}
            className="h-14 rounded-2xl text-lg"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address" className="text-base">
            주소
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="h-14 rounded-2xl text-lg"
            autoComplete="street-address"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="addressDetail" className="text-base">
            상세주소 / 요청사항
          </Label>
          <Textarea
            id="addressDetail"
            value={addressDetail}
            onChange={(event) => setAddressDetail(event.target.value)}
            className="min-h-24 rounded-2xl text-lg"
          />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-4 text-sm text-neutral-600">
          <ShieldCheck className="h-4 w-4 text-[#ff385c]" />
          {widgetMessage}
        </div>
        <div id={paymentMethodsId} className="min-h-44 px-2 py-3" />
        <div id={agreementId} className="border-t border-neutral-200 px-2 py-3" />
      </div>

      <div className="mt-5 rounded-3xl border border-neutral-200 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-neutral-600">
          <ShieldCheck className="h-4 w-4 text-[#ff385c]" />
          결제 요청 전 보안 인증
        </div>
        <TurnstileWidget
          key={turnstileResetKey}
          action="directfarm_order_prepare"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

      <Button
        type="button"
        className="mt-5 h-14 w-full rounded-2xl bg-[#ff385c] text-lg font-semibold text-white hover:bg-[#e31c5f]"
        onClick={requestPayment}
        disabled={isPending || !turnstileToken}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <CreditCard />}
        QR 간편결제로 결제 요청
      </Button>
    </section>
  );

  if (variant === "inline") {
    return checkoutPanel;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)]">
      <aside className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white">
        <div className="relative aspect-[4/3]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
              Farm Direct Checkout
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h2>
            <p className="mt-3 text-neutral-600">{product.description}</p>
          </div>
          <Separator />
          <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ff385c]" />
              {product.origin}
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#ff385c]" />
              {product.unit} / 산지 직송
            </div>
          </div>
          <div className="rounded-3xl bg-neutral-950 p-5 text-white">
            <p className="text-sm text-white/60">결제 금액</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">{formatWon(totalAmount)}</p>
            <p className="mt-3 text-sm text-white/60">
              {quantity}개 주문 기준입니다. 결제 완료 즉시 {product.vendorName} 담당자에게 Mock 알림 로그가 생성됩니다.
            </p>
          </div>
        </div>
      </aside>

      {checkoutPanel}
    </div>
  );
}
