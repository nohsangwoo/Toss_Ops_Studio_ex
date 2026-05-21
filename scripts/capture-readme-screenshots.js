/* eslint-disable @typescript-eslint/no-unused-expressions */
async (page) => {
  const hideDevTools =
    'nextjs-portal, [data-nextjs-devtools], [data-nextjs-toast], [aria-label="Open Next.js Dev Tools"], button[aria-label="Open Next.js Dev Tools"] { display: none !important; }';

  await page.setViewportSize({ width: 1365, height: 900 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: hideDevTools });
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((element) => element.remove());
    const nameInput = document.querySelector('input[autocomplete="name"]');
    const emailInput = document.querySelector('input[autocomplete="email"]');
    if (nameInput instanceof HTMLInputElement) {
      nameInput.value = "홍**";
    }
    if (emailInput instanceof HTMLInputElement) {
      emailInput.value = "b***@example.com";
    }
  });
  await page.screenshot({
    path: "docs/screenshots/00-home-overview.png",
    fullPage: true,
    scale: "css",
  });

  await page.goto("http://localhost:3000/admin/payments", { waitUntil: "networkidle" });

  if (page.url().includes("/login")) {
    await page.getByRole("button", { name: "로그인" }).click();
    await page.waitForURL("**/admin/payments", { timeout: 10000 });
  }

  await page.addStyleTag({ content: hideDevTools });
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((element) => element.remove());
    document.querySelectorAll("tbody tr").forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const orderCell = cells[1];
      const buyerCell = cells[2];

      const orderId = orderCell?.querySelector(".font-mono, [class*='font-mono']");
      if (orderId) {
        orderId.textContent = index === 0 ? "order-****-latest" : "order-****";
      }

      const buyerLines = buyerCell?.querySelectorAll("div");
      if (buyerLines?.[0]) {
        buyerLines[0].textContent = index % 2 === 0 ? "홍**" : "이**";
      }
      if (buyerLines?.[1]) {
        buyerLines[1].textContent = index % 2 === 0 ? "b***@example.com" : "s***@example.com";
      }
    });
  });
  await page.screenshot({
    path: "docs/screenshots/09-admin-dashboard-live.png",
    fullPage: true,
    scale: "css",
  });
}
