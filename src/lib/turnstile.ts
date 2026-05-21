const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string | undefined,
  options: {
    action: string;
    remoteIp?: string | null;
  },
) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey || !token) {
    return { success: false, errorCodes: ["missing_turnstile_token"] };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (options.remoteIp) {
    body.set("remoteip", options.remoteIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const payload = (await response.json()) as TurnstileVerifyResponse;

  if (!response.ok || !payload.success) {
    return { success: false, errorCodes: payload["error-codes"] ?? ["turnstile_failed"] };
  }

  if (payload.action !== options.action) {
    return { success: false, errorCodes: ["turnstile_action_mismatch"] };
  }

  return {
    success: true,
    hostname: payload.hostname,
  };
}

export function getClientIp(headers: Headers) {
  return headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
