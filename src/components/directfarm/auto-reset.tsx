"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function DirectFarmAutoReset({
  href = "/directfarm",
  seconds = 8,
}: {
  href?: string;
  seconds?: number;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      router.replace(href);
    }, seconds * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [href, router, seconds]);

  return (
    <p className="text-sm text-neutral-500">
      {remaining}초 후 주문 화면으로 자동 복귀합니다.
    </p>
  );
}
