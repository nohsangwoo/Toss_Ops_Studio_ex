export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function maskPhone(value: string) {
  return value.replace(/(\d{3})-?(\d{3,4})-?(\d{4})/, "$1-****-$3");
}
