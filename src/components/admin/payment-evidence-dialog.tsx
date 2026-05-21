"use client";

import { FileSearch, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export type PaymentCancelEvidence = {
  transactionKey?: string | null;
  cancelAmount?: number | null;
  cancelReason?: string | null;
  canceledAt?: string | null;
  receiptKey?: string | null;
};

export type PaymentEvidence = {
  status: string;
  orderId: string;
  orderName: string;
  customerName?: string | null;
  customerEmail?: string | null;
  amount: number;
  canceledAmount: number;
  method?: string | null;
  approvedAt?: string | null;
  canceledAt?: string | null;
  cancelReason?: string | null;
  receiptUrl?: string | null;
  paymentKey?: string | null;
  latestEventType?: string | null;
  traceId?: string | null;
  cancels: PaymentCancelEvidence[];
  rawResponse?: unknown;
};

export function PaymentEvidenceDialog({ evidence }: { evidence: PaymentEvidence }) {
  const isCanceled = evidence.status.includes("CANCELED");
  const title = isCanceled ? "환불 증빙" : "결제 증빙";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isCanceled ? "secondary" : "ghost"} size="sm">
          <FileSearch />
          {isCanceled ? "환불 증빙" : "증빙"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[86vh] max-w-3xl overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            관리자 확인용 거래 요약입니다. 민감한 결제 식별자는 화면 표시용으로 일부 마스킹했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <EvidenceMetric label="상태" value={evidence.status} strong />
          <EvidenceMetric label="결제 금액" value={`${evidence.amount.toLocaleString("ko-KR")}원`} />
          <EvidenceMetric label="취소 금액" value={`${evidence.canceledAmount.toLocaleString("ko-KR")}원`} />
        </div>

        <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <EvidenceRow label="주문명" value={evidence.orderName} />
          <EvidenceRow label="주문번호" value={evidence.orderId} mono />
          <EvidenceRow label="구매자" value={evidence.customerName ?? "-"} />
          <EvidenceRow label="이메일" value={evidence.customerEmail ?? "-"} mono />
          <EvidenceRow label="결제수단" value={evidence.method ?? "-"} />
          <EvidenceRow label="최근 이벤트" value={evidence.latestEventType ?? "-"} mono />
          <EvidenceRow label="승인일" value={formatDateTime(evidence.approvedAt)} />
          <EvidenceRow label="취소일" value={formatDateTime(evidence.canceledAt)} />
          <EvidenceRow label="취소 사유" value={evidence.cancelReason ?? "-"} />
          <EvidenceRow label="paymentKey" value={maskIdentifier(evidence.paymentKey)} mono />
          <EvidenceRow label="Trace ID" value={maskIdentifier(evidence.traceId)} mono />
        </div>

        {evidence.cancels.length > 0 ? (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ReceiptText className="h-4 w-4" />
                취소 거래 내역
              </div>
              <div className="grid gap-3">
                {evidence.cancels.map((cancel, index) => (
                  <div
                    key={`${cancel.transactionKey ?? "cancel"}-${index}`}
                    className="rounded-lg border border-[var(--color-claude-hairline)] bg-[var(--color-claude-soft)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Badge variant="secondary">취소 #{index + 1}</Badge>
                      <span className="font-mono text-sm">
                        {(cancel.cancelAmount ?? 0).toLocaleString("ko-KR")}원
                      </span>
                    </div>
                    <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                      <EvidenceRow label="취소일" value={formatDateTime(cancel.canceledAt)} />
                      <EvidenceRow label="취소 사유" value={cancel.cancelReason ?? "-"} />
                      <EvidenceRow label="transactionKey" value={maskIdentifier(cancel.transactionKey)} mono />
                      <EvidenceRow label="receiptKey" value={maskIdentifier(cancel.receiptKey)} mono />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {evidence.receiptUrl ? (
            <Button asChild>
              <a href={evidence.receiptUrl} target="_blank" rel="noreferrer">
                <ReceiptText />
                매출전표 열기
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <a href="https://docs.tosspayments.com/guides/v2/cancel-payment" target="_blank" rel="noreferrer">
              취소 API 문서
            </a>
          </Button>
        </div>

        {evidence.rawResponse ? (
          <>
            <Separator />
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-[var(--color-claude-body)]">
                저장된 Toss 응답 JSON 보기
              </summary>
              <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-[var(--color-claude-dark)] p-4 text-xs leading-6 text-[var(--color-claude-on-dark-soft)]">
                {JSON.stringify(evidence.rawResponse, null, 2)}
              </pre>
            </details>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EvidenceMetric({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border border-[var(--color-claude-hairline)] bg-[var(--color-claude-soft)] p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-mono text-lg ${strong ? "font-semibold text-[var(--color-claude-primary)]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function EvidenceRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

function maskIdentifier(value?: string | null) {
  if (!value) {
    return "-";
  }

  if (value.length <= 12) {
    return `${value.slice(0, 3)}***`;
  }

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}
