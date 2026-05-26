import type { DirectFarmVendor, Prisma } from "@prisma/client";
import {
  Download,
  PackagePlus,
  ReceiptText,
  Send,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import {
  createDirectFarmProductAction,
  createDirectFarmVendorAction,
  resendDirectFarmNotificationAction,
  updateDirectFarmProductAction,
  updateDirectFarmVendorAction,
} from "@/app/directfarm/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { authOptions } from "@/lib/auth-options";
import { directFarmProducts } from "@/lib/directfarm/demo-data";
import {
  formatDateTime,
  formatWon,
  maskPhone,
} from "@/lib/directfarm/format";
import { createDirectFarmNotificationSummary } from "@/lib/directfarm/notifications";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type VendorRow = DirectFarmVendor;
type ProductRow = Prisma.DirectFarmProductGetPayload<{ include: { vendor: true } }>;
type OrderRow = Prisma.DirectFarmOrderGetPayload<{
  include: { product: true; vendor: true; notificationLogs: true };
}>;

export default async function DirectFarmAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/directfarm/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/directfarm");
  }

  const prisma = getPrisma();
  const [vendors, products, orders] = await Promise.all([
    prisma.directFarmVendor.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.directFarmProduct.findMany({
      include: { vendor: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.directFarmOrder.findMany({
      include: {
        product: true,
        vendor: true,
        notificationLogs: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
  ]);

  const paidOrders = orders.filter((order) => order.status === "PAID");
  const revenue = paidOrders.reduce((sum, order) => sum + order.amount, 0);
  const sentCount = orders.filter((order) => order.notificationStatus === "SENT").length;
  const activeProductCount = products.filter((product) => product.isActive).length;

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-neutral-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-[#ff385c]" />
              NextAuth ADMIN · DirectFarm
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">무인 주문 관리자</h1>
            <p className="mt-2 text-neutral-600">
              상품 가격, 도매처 매핑, 주문 결제 상태, 도매처 전송 상태를 한 화면에서 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/directfarm">키오스크 화면</Link>
            </Button>
            <Button asChild className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
              <a href="/api/directfarm/admin/orders.csv">
                <Download />
                CSV 다운로드
              </a>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<PackagePlus />} label="노출 상품" value={`${activeProductCount}개`} />
          <MetricCard icon={<ReceiptText />} label="전체 주문" value={`${orders.length}건`} />
          <MetricCard icon={<Store />} label="결제 완료" value={`${paidOrders.length}건`} />
          <MetricCard icon={<Send />} label="전송 완료" value={`${sentCount}건`} description={formatWon(revenue)} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="rounded-[28px] border-neutral-200 bg-white">
            <CardHeader>
              <CardTitle>도매처 등록</CardTitle>
              <CardDescription>상품별 주문을 받을 도매처 담당자 정보를 등록합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createDirectFarmVendorAction} className="grid gap-3 sm:grid-cols-2">
                <AdminField label="도매처명" name="name" placeholder="논산 베리팜 도매" />
                <AdminField label="담당자" name="managerName" placeholder="김수현" />
                <AdminField label="연락처" name="phone" placeholder="010-0000-0000" />
                <label className="flex items-end gap-2 pb-3 text-sm text-neutral-600">
                  <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4 accent-[#ff385c]" />
                  활성화
                </label>
                <Button className="h-11 rounded-full bg-[#ff385c] text-white hover:bg-[#e31c5f] sm:col-span-2">
                  도매처 추가
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-neutral-200 bg-white">
            <CardHeader>
              <CardTitle>상품 등록</CardTitle>
              <CardDescription>판매가와 도매가를 분리해 MVP 마진 구조를 빠르게 검증합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createDirectFarmProductAction} className="grid gap-3 md:grid-cols-3">
                <AdminField label="상품명" name="name" placeholder="논산 설향 딸기 1kg" />
                <AdminField label="Slug" name="slug" placeholder="nonsan-strawberry-pack" />
                <div className="space-y-2">
                  <Label>도매처</Label>
                  <select
                    name="vendorId"
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <AdminField label="원산지" name="origin" placeholder="충남 논산" />
                <AdminField label="단위" name="unit" placeholder="1kg 박스" />
                <AdminField label="정렬" name="sortOrder" placeholder="10" type="number" />
                <AdminField label="판매가" name="salePrice" placeholder="29900" type="number" />
                <AdminField label="도매가" name="wholesalePrice" placeholder="21800" type="number" />
                <AdminField
                  label="이미지 URL"
                  name="imageUrl"
                  placeholder={directFarmProducts[0]?.imageUrl ?? "/images/directfarm/strawberry-pack.jpeg"}
                />
                <div className="space-y-2 md:col-span-3">
                  <Label>설명</Label>
                  <Textarea name="description" required className="min-h-20" placeholder="상품 설명" />
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-600 md:col-span-3">
                  <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4 accent-[#ff385c]" />
                  키오스크 화면에 노출
                </label>
                <Button className="h-11 rounded-full bg-[#ff385c] text-white hover:bg-[#e31c5f] md:col-span-3">
                  상품 추가
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-[28px] border-neutral-200 bg-white">
          <CardHeader>
            <CardTitle>상품 가격 및 도매처 매핑</CardTitle>
            <CardDescription>운영 중에도 판매가, 도매가, 노출 여부를 즉시 수정할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            {products.map((product) => (
              <ProductEditor key={product.id} product={product} vendors={vendors} />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-neutral-200 bg-white">
          <CardHeader>
            <CardTitle>도매처 목록</CardTitle>
            <CardDescription>알림톡/SMS 실제 연동 전까지는 Mock 발송 로그로 운영 흐름을 검증합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {vendors.map((vendor) => (
              <form key={vendor.id} action={updateDirectFarmVendorAction} className="rounded-3xl border border-neutral-200 p-4">
                <input type="hidden" name="id" value={vendor.id} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <AdminField label="도매처명" name="name" defaultValue={vendor.name} />
                  <AdminField label="담당자" name="managerName" defaultValue={vendor.managerName} />
                  <AdminField label="연락처" name="phone" defaultValue={vendor.phone} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-neutral-600">
                    <input name="isActive" type="checkbox" defaultChecked={vendor.isActive} className="h-4 w-4 accent-[#ff385c]" />
                    활성화
                  </label>
                  <Button variant="outline" className="rounded-full">
                    저장
                  </Button>
                </div>
              </form>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-neutral-200 bg-white">
          <CardHeader>
            <CardTitle>주문 내역</CardTitle>
            <CardDescription>결제 상태와 도매처 전송 상태가 최신순으로 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상태</TableHead>
                    <TableHead>주문</TableHead>
                    <TableHead>구매자</TableHead>
                    <TableHead className="text-right">수량</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>도매처</TableHead>
                    <TableHead>전송</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                      <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-neutral-500">
                        아직 DirectFarm 주문이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.product.name}</div>
                          <div className="font-mono text-xs text-neutral-500">{order.orderId}</div>
                        </TableCell>
                        <TableCell>
                          <div>{order.buyerName}</div>
                          <div className="text-xs text-neutral-500">{maskPhone(order.buyerPhone)}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{order.quantity}개</TableCell>
                        <TableCell className="text-right font-mono">{formatWon(order.amount)}</TableCell>
                        <TableCell>
                          <div>{order.vendor.name}</div>
                          <div className="text-xs text-neutral-500">{order.vendor.managerName}</div>
                        </TableCell>
                        <TableCell>
                          <NotificationBadge status={order.notificationStatus} />
                          <div className="mt-1 text-xs text-neutral-500">
                            {createDirectFarmNotificationSummary(order.notificationStatus)}
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {order.receiptUrl ? (
                              <Button asChild variant="ghost" size="sm">
                                <a href={order.receiptUrl} target="_blank" rel="noreferrer">
                                  영수증
                                </a>
                              </Button>
                            ) : null}
                            <form action={resendDirectFarmNotificationAction}>
                              <input type="hidden" name="orderId" value={order.orderId} />
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={order.status !== "PAID"}
                                className="rounded-full"
                              >
                                <Send className="h-4 w-4" />
                                재전송
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <Card className="rounded-[28px] border-neutral-200 bg-white">
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-[#ff385c] [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

function AdminField({
  label,
  name,
  placeholder,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} type={type} required placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  );
}

function ProductEditor({ product, vendors }: { product: ProductRow; vendors: VendorRow[] }) {
  return (
    <form action={updateDirectFarmProductAction} className="rounded-3xl border border-neutral-200 p-4">
      <input type="hidden" name="id" value={product.id} />
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#ff385c]" />
          <span className="font-semibold">{product.name}</span>
        </div>
        <Badge variant={product.isActive ? "default" : "secondary"}>{product.isActive ? "노출" : "숨김"}</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="상품명" name="name" defaultValue={product.name} />
        <AdminField label="Slug" name="slug" defaultValue={product.slug} />
        <AdminField label="원산지" name="origin" defaultValue={product.origin} />
        <AdminField label="단위" name="unit" defaultValue={product.unit} />
        <AdminField label="판매가" name="salePrice" type="number" defaultValue={product.salePrice} />
        <AdminField label="도매가" name="wholesalePrice" type="number" defaultValue={product.wholesalePrice} />
        <AdminField label="정렬" name="sortOrder" type="number" defaultValue={product.sortOrder} />
        <div className="space-y-2">
          <Label>도매처</Label>
          <select
            name="vendorId"
            required
            defaultValue={product.vendorId}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>이미지 URL</Label>
          <Input name="imageUrl" required defaultValue={product.imageUrl} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>설명</Label>
          <Textarea name="description" required defaultValue={product.description} className="min-h-20" />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input name="isActive" type="checkbox" defaultChecked={product.isActive} className="h-4 w-4 accent-[#ff385c]" />
          키오스크 노출
        </label>
        <Button variant="outline" className="rounded-full">
          상품 저장
        </Button>
      </div>
    </form>
  );
}

function OrderStatusBadge({ status }: { status: OrderRow["status"] }) {
  const isPaid = status === "PAID";
  const isFailed = status === "FAILED" || status === "CANCELED";

  return (
    <Badge variant={isFailed ? "destructive" : isPaid ? "default" : "secondary"}>
      {status}
    </Badge>
  );
}

function NotificationBadge({ status }: { status: OrderRow["notificationStatus"] }) {
  if (status === "SENT") {
    return <Badge className="bg-[#ff385c] text-white">SENT</Badge>;
  }

  if (status === "FAILED") {
    return <Badge variant="destructive">FAILED</Badge>;
  }

  return <Badge variant="secondary">{status}</Badge>;
}
