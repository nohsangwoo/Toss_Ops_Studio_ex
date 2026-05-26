"use client";

import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_ONLOAD_CALLBACK = "__tossOpsTurnstileReady";
const TURNSTILE_SCRIPT_SRC = `https://challenges.cloudflare.com/turnstile/v0/api.js?onload=${TURNSTILE_ONLOAD_CALLBACK}&render=explicit`;

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  size?: "normal" | "compact" | "flexible";
  theme?: "auto" | "light" | "dark";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": (errorCode?: string) => boolean;
  "timeout-callback": () => void;
  "unsupported-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __tossOpsTurnstileReady?: () => void;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

function normalizeTurnstileKey(value: string | undefined) {
  return value?.replace(/^\uFEFF/, "").trim();
}

function waitForTurnstileReady(timeoutMs = 10000) {
  if (window.turnstile?.render) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      if (window.turnstile?.render) {
        window.clearInterval(intervalId);
        resolve();
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        window.clearInterval(intervalId);
        reject(new Error("Turnstile API was not ready in time."));
      }
    }, 50);
  });
}

function loadTurnstileScript() {
  if (window.turnstile?.render) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    let settled = false;

    const resolveWhenReady = () => {
      if (settled) return;

      waitForTurnstileReady()
        .then(() => {
          settled = true;
          resolve();
        })
        .catch((error) => {
          settled = true;
          turnstileScriptPromise = null;
          reject(error);
        });
    };

    const rejectLoad = () => {
      if (settled) return;
      settled = true;
      turnstileScriptPromise = null;
      reject(new Error("Turnstile script failed to load."));
    };

    window.__tossOpsTurnstileReady = resolveWhenReady;

    const existingScript =
      document.getElementById(TURNSTILE_SCRIPT_ID) ??
      document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]');

    if (existingScript) {
      resolveWhenReady();
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onload = resolveWhenReady;
    script.onerror = rejectLoad;
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

function getTurnstileErrorMessage(errorCode?: string) {
  if (!errorCode) {
    return "보안 인증을 다시 시도해주세요.";
  }

  if (errorCode.startsWith("110200")) {
    return "현재 도메인이 Turnstile 위젯에 등록되어 있지 않습니다.";
  }

  if (
    errorCode.startsWith("110100") ||
    errorCode.startsWith("110110") ||
    errorCode.startsWith("400020") ||
    errorCode.startsWith("400070")
  ) {
    return "Turnstile site key 설정을 확인해주세요.";
  }

  if (errorCode.startsWith("200500")) {
    return "보안 인증 iframe을 불러오지 못했습니다. 브라우저 확장 프로그램이나 네트워크 차단을 확인해주세요.";
  }

  return `보안 인증 오류가 발생했습니다. (${errorCode})`;
}

export function TurnstileWidget({
  action,
  onVerify,
  onExpire,
}: {
  action: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const siteKey = normalizeTurnstileKey(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    let canceled = false;

    async function renderTurnstile() {
      if (!siteKey) {
        setErrorMessage("Turnstile site key가 설정되어 있지 않습니다.");
        return;
      }

      try {
        await loadTurnstileScript();

        if (canceled || !containerRef.current) {
          return;
        }

        if (!window.turnstile?.render) {
          throw new Error("Turnstile API was not initialized.");
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          size: "flexible",
          theme: "light",
          callback: (token) => {
            setErrorMessage(null);
            onVerifyRef.current(token);
          },
          "expired-callback": () => {
            onExpireRef.current();
          },
          "error-callback": (errorCode) => {
            onExpireRef.current();
            setErrorMessage(getTurnstileErrorMessage(errorCode));
            return true;
          },
          "timeout-callback": () => {
            onExpireRef.current();
            setErrorMessage("보안 인증 시간이 만료되었습니다. 다시 시도해주세요.");
          },
          "unsupported-callback": () => {
            onExpireRef.current();
            setErrorMessage("현재 브라우저에서는 보안 인증을 사용할 수 없습니다.");
          },
        });
      } catch (error) {
        if (!canceled) {
          console.error("Turnstile render failed", error);
          onExpireRef.current();
          setErrorMessage("보안 인증을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
        }
      }
    }

    renderTurnstile();

    return () => {
      canceled = true;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, siteKey]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} />
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
