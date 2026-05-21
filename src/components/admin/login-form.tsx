"use client";

import { Loader2, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin1234");
  const [message, setMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!turnstileToken) {
      setMessage("보안 인증을 완료해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        turnstileToken,
        callbackUrl,
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = result.url ?? callbackUrl;
        return;
      }

      setTurnstileToken(null);
      setTurnstileResetKey((key) => key + 1);
      setMessage("이메일 또는 비밀번호를 확인해주세요.");
    });
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <Label>이메일</Label>
        <Input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>비밀번호</Label>
        <Input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        <TurnstileWidget
          key={turnstileResetKey}
          action="admin_login"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={isPending || !turnstileToken}>
        {isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
        로그인
      </Button>
    </form>
  );
}
