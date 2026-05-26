export function normalizeMobilePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : undefined;
}

export function getPaymentSdkErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const payload = error as { code?: unknown; message?: unknown };
    const code = typeof payload.code === "string" ? payload.code : undefined;
    const message = typeof payload.message === "string" ? payload.message : undefined;

    if (code && message) {
      return `${message} (${code})`;
    }

    if (message) {
      return message;
    }

    if (code) {
      return `결제 요청 실패 (${code})`;
    }
  }

  return fallback;
}
