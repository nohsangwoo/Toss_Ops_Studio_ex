import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CreditCard, ReceiptText, ShieldCheck, Undo2 } from "lucide-react";

import { PaymentCancelDialog } from "@/components/admin/payment-cancel-dialog";
import {
  PaymentEvidenceDialog,
  type PaymentEvidence,
} from "@/components/admin/payment-evidence-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/payments");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const prisma = getPrisma();
  const payments: AdminPaymentRow[] = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { events: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  const totalPaid = payments
    .filter((payment) => payment.status === "DONE")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalCanceled = payments.reduce((sum, payment) => sum + payment.canceledAmount, 0);
  const doneCount = payments.filter((payment) => payment.status === "DONE").length;

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              NextAuth Admin Role
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">결제 관리 어드민</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              토스페이먼츠 승인 결과, DB 로그, 취소 처리를 한 화면에서 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link href="/">결제 화면</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/api/auth/signout">로그아웃</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<ReceiptText />} label="전체 결제 로그" value={`${payments.length}건`} />
          <MetricCard icon={<CreditCard />} label="승인 완료" value={`${doneCount}건`} />
          <MetricCard icon={<CreditCard />} label="승인 금액" value={`${totalPaid.toLocaleString("ko-KR")}원`} />
          <MetricCard icon={<Undo2 />} label="취소 금액" value={`${totalCanceled.toLocaleString("ko-KR")}원`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>결제 내역</CardTitle>
            <CardDescription>결제 요청, 승인, 실패, 취소 이벤트가 최신순으로 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상태</TableHead>
                    <TableHead>주문</TableHead>
                    <TableHead>구매자</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>결제수단</TableHead>
                    <TableHead>승인일</TableHead>
                    <TableHead>최근 이벤트</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        아직 결제 로그가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => {
                      const remainingAmount = payment.amount - payment.canceledAmount;
                      const canCancel =
                        payment.status === "DONE" ||
                        (payment.status === "PARTIAL_CANCELED" && remainingAmount > 0);

                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{payment.orderName}</div>
                            <div className="font-mono text-xs text-muted-foreground">{payment.orderId}</div>
                          </TableCell>
                          <TableCell>
                            <div>{payment.customerName ?? "-"}</div>
                            <div className="text-xs text-muted-foreground">{payment.customerEmail ?? ""}</div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <div>{payment.amount.toLocaleString("ko-KR")}원</div>
                            {payment.canceledAmount > 0 ? (
                              <div className="mt-1 text-xs text-[var(--color-claude-primary)]">
                                취소 {payment.canceledAmount.toLocaleString("ko-KR")}원
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell>{payment.method ?? "-"}</TableCell>
                          <TableCell>
                            {payment.approvedAt
                              ? new Intl.DateTimeFormat("ko-KR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }).format(payment.approvedAt)
                              : "-"}
                            {payment.canceledAt ? (
                              <div className="mt-1 text-xs text-muted-foreground">
                                취소{" "}
                                {new Intl.DateTimeFormat("ko-KR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }).format(payment.canceledAt)}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell>{payment.events[0]?.type ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <PaymentEvidenceDialog evidence={createPaymentEvidence(payment)} />
                              {payment.receiptUrl ? (
                                <Button asChild variant="ghost" size="sm">
                                  <a href={payment.receiptUrl} target="_blank" rel="noreferrer">
                                    영수증
                                  </a>
                                </Button>
                              ) : null}
                              <PaymentCancelDialog
                                paymentId={payment.id}
                                amount={remainingAmount}
                                disabled={!canCancel}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Separator />
        <p className="text-xs text-muted-foreground">
          데모 관리자: admin@example.com / admin1234. 운영 환경에서는 ADMIN_PASSWORD와 NEXTAUTH_SECRET을 반드시 교체하세요.
        </p>
      </div>
    </main>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "DONE") {
    return <Badge>DONE</Badge>;
  }

  if (status.includes("CANCELED")) {
    return <Badge variant="secondary">{status}</Badge>;
  }

  if (status === "FAILED" || status === "ABORTED" || status === "EXPIRED") {
    return <Badge variant="destructive">{status}</Badge>;
  }

  return <Badge variant="outline">{status}</Badge>;
}

type AdminPaymentRow = AdminPaymentEvidenceSource & {
  id: string;
};

type AdminPaymentEvidenceSource = {
  status: string;
  orderId: string;
  orderName: string;
  customerName: string | null;
  customerEmail: string | null;
  amount: number;
  canceledAmount: number;
  method: string | null;
  approvedAt: Date | null;
  canceledAt: Date | null;
  cancelReason: string | null;
  receiptUrl: string | null;
  paymentKey: string | null;
  rawResponse: unknown;
  events: Array<{
    type: string;
    payload: unknown;
  }>;
};

function createPaymentEvidence(payment: AdminPaymentEvidenceSource): PaymentEvidence {
  const payload = payment.rawResponse ?? payment.events[0]?.payload ?? null;
  const payloadRecord = isRecord(payload) ? payload : null;
  const cancels = extractCancels(payload);
  const latestCancel = cancels.at(-1);

  return {
    status: payment.status,
    orderId: payment.orderId,
    orderName: payment.orderName,
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    amount: payment.amount,
    canceledAmount: payment.canceledAmount,
    method: payment.method,
    approvedAt: payment.approvedAt?.toISOString() ?? null,
    canceledAt:
      payment.canceledAt?.toISOString() ?? readString(latestCancel, "canceledAt") ?? null,
    cancelReason: payment.cancelReason ?? readString(latestCancel, "cancelReason") ?? null,
    receiptUrl: payment.receiptUrl,
    paymentKey: payment.paymentKey ?? readString(payloadRecord, "paymentKey") ?? null,
    latestEventType: payment.events[0]?.type ?? null,
    traceId:
      readString(payloadRecord, "xTossPaymentsTraceId") ??
      readString(payloadRecord, "X-TossPayments-Trace-Id") ??
      readString(payloadRecord, "traceId") ??
      null,
    cancels: cancels.map((cancel) => ({
      transactionKey: readString(cancel, "transactionKey"),
      cancelAmount: readNumber(cancel, "cancelAmount"),
      cancelReason: readString(cancel, "cancelReason"),
      canceledAt: readString(cancel, "canceledAt"),
      receiptKey: readString(cancel, "receiptKey"),
    })),
    rawResponse: payload ? sanitizePayload(payload) : undefined,
  };
}

function extractCancels(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.cancels)) {
    return [];
  }

  return value.cancels.filter(isRecord);
}

function sanitizePayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizePayload);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (isSensitiveKey(key) && typeof nestedValue === "string") {
        return [key, maskIdentifier(nestedValue)];
      }

      return [key, sanitizePayload(nestedValue)];
    }),
  );
}

function isSensitiveKey(key: string) {
  const normalized = key.toLowerCase();
  return (
    normalized.includes("paymentkey") ||
    normalized.includes("transactionkey") ||
    normalized.includes("trace") ||
    normalized.includes("secret") ||
    normalized.includes("authorization")
  );
}

function maskIdentifier(value: string) {
  if (value.length <= 12) {
    return `${value.slice(0, 3)}***`;
  }

  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown> | null | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readNumber(record: Record<string, unknown> | null | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
