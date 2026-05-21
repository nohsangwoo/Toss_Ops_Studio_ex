import { z } from "zod";

const TOSS_API_BASE_URL = "https://api.tosspayments.com";

const tossPaymentSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  orderName: z.string().optional(),
  status: z.string(),
  method: z.string().nullable().optional(),
  totalAmount: z.number(),
  currency: z.string().optional(),
  requestedAt: z.string().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  receipt: z.object({ url: z.string().optional() }).nullable().optional(),
  cancels: z.array(z.unknown()).nullable().optional(),
});

export type TossPayment = z.infer<typeof tossPaymentSchema> & Record<string, unknown>;

function getSecretKey() {
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TOSS_PAYMENTS_SECRET_KEY is missing.");
  }

  return secretKey;
}

function getAuthorizationHeader() {
  return `Basic ${Buffer.from(`${getSecretKey()}:`).toString("base64")}`;
}

async function requestToss<T>(path: string, body: unknown) {
  const response = await fetch(`${TOSS_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: getAuthorizationHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json()) as T & {
    code?: string;
    message?: string;
  };
  const traceId = response.headers.get("X-TossPayments-Trace-Id");

  if (traceId && typeof payload === "object" && payload !== null) {
    (payload as Record<string, unknown>).xTossPaymentsTraceId = traceId;
  }

  if (!response.ok) {
    throw new Error(payload.message ?? payload.code ?? "Toss Payments request failed.");
  }

  return payload;
}

export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const payload = await requestToss<TossPayment>("/v1/payments/confirm", input);
  return tossPaymentSchema.passthrough().parse(payload) as TossPayment;
}

export async function cancelTossPayment(input: {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
}) {
  const payload = await requestToss<TossPayment>(
    `/v1/payments/${encodeURIComponent(input.paymentKey)}/cancel`,
    {
      cancelReason: input.cancelReason,
      ...(input.cancelAmount ? { cancelAmount: input.cancelAmount } : {}),
    },
  );

  return tossPaymentSchema.passthrough().parse(payload) as TossPayment;
}

export type AppPaymentStatus =
  | "READY"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELED"
  | "PARTIAL_CANCELED"
  | "ABORTED"
  | "EXPIRED"
  | "FAILED";

const APP_PAYMENT_STATUSES = [
  "READY",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
  "PARTIAL_CANCELED",
  "ABORTED",
  "EXPIRED",
] as const;

export function mapTossStatus(status: string): AppPaymentStatus {
  return APP_PAYMENT_STATUSES.some((candidate) => candidate === status)
    ? (status as AppPaymentStatus)
    : "FAILED";
}
