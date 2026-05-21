"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth-options";
import { cancelTossPayment, mapTossStatus } from "@/lib/payments/toss";
import { getPrisma } from "@/lib/prisma";

export async function cancelPaymentAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return { ok: false, message: "관리자 권한이 필요합니다." };
  }

  const paymentId = String(formData.get("paymentId") ?? "");
  const cancelReason = String(formData.get("cancelReason") ?? "").trim();
  const cancelAmountValue = String(formData.get("cancelAmount") ?? "").trim();
  const cancelAmount = cancelAmountValue ? Number(cancelAmountValue.replaceAll(",", "")) : undefined;

  if (!paymentId || !cancelReason) {
    return { ok: false, message: "취소 사유를 입력해주세요." };
  }

  if (cancelAmount !== undefined && (!Number.isInteger(cancelAmount) || cancelAmount <= 0)) {
    return { ok: false, message: "부분 취소 금액은 1원 이상의 정수여야 합니다." };
  }

  const prisma = getPrisma();
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment?.paymentKey || payment.status !== "DONE") {
    return { ok: false, message: "취소 가능한 완료 결제가 아닙니다." };
  }

  if (cancelAmount !== undefined && cancelAmount > payment.amount - payment.canceledAmount) {
    return { ok: false, message: "남은 결제 금액보다 큰 금액은 취소할 수 없습니다." };
  }

  try {
    const canceled = await cancelTossPayment({
      paymentKey: payment.paymentKey,
      cancelReason,
      cancelAmount,
    });

    const canceledTotal =
      Array.isArray(canceled.cancels) && canceled.cancels.length > 0
        ? canceled.cancels.reduce<number>((sum, cancel) => {
            if (typeof cancel === "object" && cancel && "cancelAmount" in cancel) {
              const value = Number((cancel as { cancelAmount: unknown }).cancelAmount);
              return Number.isFinite(value) ? sum + value : sum;
            }

            return sum;
          }, 0)
        : payment.amount;

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: mapTossStatus(canceled.status),
        canceledAmount: canceledTotal,
        cancelReason,
        canceledAt: getLatestCanceledAt(canceled) ?? new Date(),
        receiptUrl: canceled.receipt?.url ?? payment.receiptUrl,
        rawResponse: canceled as Prisma.InputJsonValue,
        events: {
          create: {
            type: "PAYMENT_CANCELED",
            payload: canceled as Prisma.InputJsonValue,
          },
        },
      },
    });

    revalidatePath("/admin/payments");
    return { ok: true, message: "결제 취소가 완료되었습니다." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "결제 취소 중 오류가 발생했습니다.",
    };
  }
}

function getLatestCanceledAt(canceled: { cancels?: unknown[] | null }) {
  if (!Array.isArray(canceled.cancels)) {
    return null;
  }

  const latestCanceledAt = canceled.cancels
    .map((cancel) => {
      if (typeof cancel === "object" && cancel && "canceledAt" in cancel) {
        const value = (cancel as { canceledAt?: unknown }).canceledAt;
        return typeof value === "string" ? value : null;
      }

      return null;
    })
    .filter(Boolean)
    .at(-1);

  return latestCanceledAt ? new Date(latestCanceledAt) : null;
}
