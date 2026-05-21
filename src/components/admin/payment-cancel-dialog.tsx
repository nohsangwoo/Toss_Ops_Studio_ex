"use client";

import { RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";

import { cancelPaymentAction } from "@/app/admin/payments/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PaymentCancelDialog({
  paymentId,
  amount,
  disabled,
}: {
  paymentId: string;
  amount: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("관리자 요청 환불");
  const [cancelAmount, setCancelAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitCancel() {
    setMessage(null);
    const formData = new FormData();
    formData.set("paymentId", paymentId);
    formData.set("cancelReason", reason);
    formData.set("cancelAmount", cancelAmount);

    startTransition(async () => {
      const result = await cancelPaymentAction(formData);

      if (result.ok) {
        setOpen(false);
        return;
      }

      setMessage(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <RotateCcw />
          취소
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>결제 취소 처리</DialogTitle>
          <DialogDescription>
            토스페이먼츠 결제 취소 API를 호출하고 결과를 결제 로그에 저장합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>취소 사유</Label>
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>부분 취소 금액</Label>
            <Input
              inputMode="numeric"
              placeholder={`미입력 시 전액 취소 (${amount.toLocaleString("ko-KR")}원)`}
              value={cancelAmount}
              onChange={(event) => setCancelAmount(event.target.value)}
            />
          </div>
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            닫기
          </Button>
          <Button onClick={submitCancel} disabled={isPending}>
            취소 실행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
