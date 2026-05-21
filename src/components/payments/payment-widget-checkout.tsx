"use client";

import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PRODUCTS } from "@/lib/payments/products";

type TossWidgets = {
  setAmount: (amount: { value: number; currency: "KRW" }) => Promise<void>;
  renderPaymentMethods: (options: { selector: string; variantKey?: string }) => Promise<unknown>;
  renderAgreement: (options: { selector: string; variantKey?: string }) => Promise<unknown>;
  requestPayment: (options: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
    customerEmail?: string;
    customerName?: string;
  }) => Promise<void>;
};

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      widgets: (options: { customerKey: string }) => TossWidgets;
    };
  }
}

type PreparedPayment = {
  orderId: string;
  orderName: string;
  amount: number;
  currency: "KRW";
  customerKey: string;
  successUrl: string;
  failUrl: string;
};

function createCustomerKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `customer_${crypto.randomUUID()}`;
  }

  return `customer_${Date.now()}_${Math.random().toString(16).slice(2)}`;
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

export function PaymentWidgetCheckout({
  initialProductId = "payment-widget",
  allowProductSelect = true,
}: {
  initialProductId?: string;
  allowProductSelect?: boolean;
}) {
  const [productId, setProductId] = useState(initialProductId);
  const [customerName, setCustomerName] = useState("홍길동");
  const [customerEmail, setCustomerEmail] = useState("buyer@example.com");
  const [customerKey] = useState(createCustomerKey);
  const [widgetMessage, setWidgetMessage] = useState("결제위젯을 준비하고 있습니다.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const widgetsRef = useRef<TossWidgets | null>(null);

  const selectedProduct = useMemo(
    () => MOCK_PRODUCTS.find((product) => product.id === productId) ?? MOCK_PRODUCTS[0],
    [productId],
  );

  const paymentMethodsId = `payment-methods-${selectedProduct.id}`;
  const agreementId = `agreement-${selectedProduct.id}`;

  useEffect(() => {
    let canceled = false;

    async function renderWidget() {
      setErrorMessage(null);
      setWidgetMessage("결제수단과 약관 UI를 불러오는 중입니다.");
      widgetsRef.current = null;

      const paymentMethods = document.getElementById(paymentMethodsId);
      const agreement = document.getElementById(agreementId);

      if (paymentMethods) paymentMethods.innerHTML = "";
      if (agreement) agreement.innerHTML = "";

      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_ID;

        if (!clientKey) {
          throw new Error("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_ID가 설정되어 있지 않습니다.");
        }

        const TossPayments = await loadTossSdk();
        const widgets = TossPayments(clientKey).widgets({ customerKey });

        await widgets.setAmount({ value: selectedProduct.price, currency: "KRW" });
        await widgets.renderPaymentMethods({ selector: `#${paymentMethodsId}`, variantKey: "DEFAULT" });
        await widgets.renderAgreement({ selector: `#${agreementId}`, variantKey: "AGREEMENT" });

        if (!canceled) {
          widgetsRef.current = widgets;
          setWidgetMessage("결제위젯이 준비되었습니다.");
        }
      } catch (error) {
        if (!canceled) {
          setErrorMessage(
            error instanceof Error ? error.message : "결제위젯을 렌더링하는 중 오류가 발생했습니다.",
          );
          setWidgetMessage("결제위젯 준비 실패");
        }
      }
    }

    renderWidget();

    return () => {
      canceled = true;
    };
  }, [agreementId, customerKey, paymentMethodsId, selectedProduct.price]);

  function requestPayment() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        if (!widgetsRef.current) {
          throw new Error("결제위젯이 아직 준비되지 않았습니다.");
        }

        const response = await fetch("/api/payments/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: selectedProduct.id,
            customerKey,
            customerName,
            customerEmail,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          throw new Error(payload.message ?? "주문 생성에 실패했습니다.");
        }

        const prepared = (await response.json()) as PreparedPayment;

        await widgetsRef.current.requestPayment({
          orderId: prepared.orderId,
          orderName: prepared.orderName,
          successUrl: prepared.successUrl,
          failUrl: prepared.failUrl,
          customerEmail,
          customerName,
        });
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "결제 요청 중 오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[var(--color-claude-hairline)] bg-[var(--color-claude-card)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-claude-muted)]">
              Checkout summary
            </p>
            <p className="mt-2 text-lg font-medium text-[var(--color-claude-ink)]">
              {selectedProduct.name}
            </p>
          </div>
          <p className="font-mono text-lg text-[var(--color-claude-ink)]">
            {selectedProduct.price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {allowProductSelect ? (
          <div className="space-y-2 md:col-span-2">
            <Label>구매 상품</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="bg-[var(--color-claude-canvas)]">
                <SelectValue placeholder="상품 선택" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PRODUCTS.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label>구매자명</Label>
          <Input
            autoComplete="name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="bg-[var(--color-claude-canvas)]"
          />
        </div>
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input
            type="email"
            autoComplete="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            className="bg-[var(--color-claude-canvas)]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-claude-hairline)] bg-[var(--color-claude-canvas)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-claude-hairline)] px-4 py-3 text-sm text-[var(--color-claude-muted)]">
          <ShieldCheck className="h-4 w-4 text-[var(--color-claude-primary)]" />
          {widgetMessage}
        </div>
        <div id={paymentMethodsId} className="min-h-40 px-2 py-3" />
        <div id={agreementId} className="border-t border-[var(--color-claude-hairline)] px-2 py-3" />
      </div>

      {errorMessage ? <p className="text-sm text-[var(--color-claude-error)]">{errorMessage}</p> : null}

      <Button
        className="h-12 w-full rounded-md bg-[var(--color-claude-primary)] text-white hover:bg-[var(--color-claude-primary-active)]"
        onClick={requestPayment}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <CreditCard />}
        결제위젯으로 결제 요청
      </Button>
    </div>
  );
}
