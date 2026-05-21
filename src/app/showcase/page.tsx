import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  CreditCard,
  Database,
  FileText,
  LockKeyhole,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Toss Ops Studio Showcase",
  description: "토스페이먼츠 PG 연동 및 결제 관리 어드민 목업 시연 페이지",
};

const highlights = [
  { label: "Payment Flow", value: "상품 선택부터 승인 저장까지", icon: CreditCard },
  { label: "Admin Ops", value: "결제 조회, 영수증, 환불 증빙", icon: ReceiptText },
  { label: "Data Layer", value: "Prisma ORM + Neon 로그", icon: Database },
  { label: "Auth Guard", value: "NextAuth ADMIN Role 보호", icon: ShieldCheck },
];

const stack = [
  "Next.js 15 App Router",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Prisma ORM",
  "Neon PostgreSQL",
  "NextAuth Credentials",
  "Toss Payments V2 SDK",
  "Toss Payments REST API",
];

const paymentFlow = [
  "상품 상세 또는 홈 주문서에서 결제 상품과 금액을 선택합니다.",
  "클라이언트는 Toss Payments V2 SDK로 결제위젯을 렌더링합니다.",
  "결제 요청 전 서버 API가 DB에 READY 주문 초안을 생성합니다.",
  "success URL에서 서버가 저장 금액과 URL 금액을 다시 비교합니다.",
  "서버가 Toss Confirm API를 호출하고 승인 결과와 이벤트 로그를 저장합니다.",
  "관리자 페이지에서 결제 상태, 매출전표, 최근 이벤트를 확인합니다.",
];

const refundFlow = [
  "관리자가 DONE 결제의 취소 모달을 엽니다.",
  "취소 사유와 선택적 부분 취소 금액을 입력합니다.",
  "Server Action이 Toss Cancel API를 호출합니다.",
  "응답의 cancels 배열 기준으로 누적 취소 금액을 계산합니다.",
  "DB 상태와 이벤트 로그를 갱신하고 어드민 테이블에 즉시 반영합니다.",
  "환불 증빙 모달에서 transactionKey, Trace ID, 취소 사유와 금액을 확인합니다.",
];

const screenshots = [
  {
    title: "상품형 결제 랜딩",
    caption: "제안 범위를 상품 카드와 주문서 흐름으로 연결한 첫 화면입니다.",
    src: "/showcase/screenshots/00-home-overview.webp",
    width: 2560,
    height: 3633,
    featured: true,
  },
  {
    title: "관리자 결제 대시보드",
    caption: "승인, 취소, 합계, 영수증, 이벤트 상태를 한 화면에서 확인합니다.",
    src: "/showcase/screenshots/09-admin-dashboard-live.webp",
    width: 1365,
    height: 900,
  },
  {
    title: "결제 성공 결과",
    caption: "서버 승인 후 DONE 상태와 후속 액션을 노출합니다.",
    src: "/showcase/screenshots/01-payment-success.webp",
    width: 1200,
    height: 900,
  },
  {
    title: "결제위젯 인증",
    caption: "Toss 결제위젯의 QR 및 간편결제 인증 화면입니다.",
    src: "/showcase/screenshots/04-widget-qr-masked.webp",
    width: 1240,
    height: 980,
  },
  {
    title: "환불 처리 모달",
    caption: "취소 사유와 부분 취소 금액을 입력하는 관리자 액션입니다.",
    src: "/showcase/screenshots/05-cancel-dialog.webp",
    width: 1120,
    height: 864,
  },
  {
    title: "Toss API 로그",
    caption: "Confirm과 Cancel 호출 결과를 개발자센터 로그로 검증했습니다.",
    src: "/showcase/screenshots/07-api-log-cancel-masked.webp",
    width: 1500,
    height: 960,
  },
];

const files = [
  ["src/app/page.tsx", "상품형 결제 랜딩과 결제위젯 데모"],
  ["src/app/products/[slug]/page.tsx", "상품 상세 및 상품별 주문서"],
  ["src/components/payments/payment-widget-checkout.tsx", "Toss 결제위젯 클라이언트 컴포넌트"],
  ["src/app/payments/success/page.tsx", "결제 성공 후 서버 승인"],
  ["src/app/admin/payments/page.tsx", "관리자 결제 관리 대시보드"],
  ["src/components/admin/payment-evidence-dialog.tsx", "결제 및 환불 증빙 모달"],
  ["src/lib/payments/toss.ts", "Toss REST API 클라이언트"],
  ["prisma/schema.prisma", "User, Payment, PaymentEvent 스키마"],
];

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171512]">
      <ShowcaseNav />

      <section className="border-b border-[#ded6ca] bg-[#171512] text-[#f8f3eb]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Badge className="h-7 rounded-full border-[#4c4740] bg-[#25211d] px-3 text-[#f8d7ca]">
              Next.js 15 · Prisma · Neon · Toss Payments
            </Badge>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-none md:text-6xl">
              결제 연동과 운영 어드민을 한 흐름으로 검증하는 시연 페이지
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#c9c0b5] md:text-lg">
              위시켓 제안 범위를 실제 동작하는 제품 화면으로 구성했습니다. 결제 상품,
              결제위젯, 서버 승인, DB 로그 저장, 관리자 조회, 환불 증빙까지 하나의
              포트폴리오 화면에서 빠르게 확인할 수 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-10 rounded-md bg-[#d47a5e] px-5 text-white hover:bg-[#b9664e]">
                <Link href="/products/payment-widget">
                  결제위젯 테스트
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-md border-[#514b44] bg-transparent px-5 text-[#f8f3eb] hover:bg-[#25211d] hover:text-[#f8f3eb]"
              >
                <Link href="/admin/payments">관리자 화면</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#3a352f] bg-[#0f0e0c]">
            <video
              className="aspect-video w-full bg-black object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/showcase/videos/mockup-demo-poster.webp"
            >
              <source src="/showcase/videos/mockup-demo.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-10 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {highlights.map((item) => (
          <Card key={item.label} className="rounded-lg border-[#ded6ca] bg-[#fffdf8] shadow-none">
            <CardContent className="flex items-start gap-4 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#efe6da] text-[#a75d45]">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-mono text-xs text-[#6f675e]">{item.label}</p>
                <p className="mt-1 font-medium leading-6">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="border-y border-[#ded6ca] bg-[#fcfaf5]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[360px_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#b7664d]">Implementation Scope</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight">
              요구사항을 화면, 서버, 데이터 흐름으로 나누어 구현했습니다
            </h2>
            <p className="mt-5 leading-7 text-[#5e574f]">
              목업이지만 단순 소개 페이지가 아니라, 결제 요청과 취소 요청이 실제 API와
              데이터베이스 로그까지 이어지도록 구성했습니다.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FlowPanel title="결제 진행 흐름" icon={<CreditCard className="size-5" />} items={paymentFlow} />
            <FlowPanel title="환불 및 증빙 흐름" icon={<RotateCcw className="size-5" />} items={refundFlow} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#b7664d]">Screen Evidence</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight">
            README의 검증 화면을 배포 페이지에서 더 보기 좋게 재배치했습니다
          </h2>
        </div>
        <p className="leading-7 text-[#5e574f]">
          GitHub README에는 WebP와 GIF로 가볍게 노출하고, Vercel 배포 화면에서는 WebM
          영상과 주요 캡처를 섹션별로 확인할 수 있습니다.
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {screenshots.map((shot) => (
            <figure
              key={shot.src}
              className={shot.featured ? "lg:col-span-2" : ""}
            >
              <div className="overflow-hidden rounded-lg border border-[#ded6ca] bg-[#fffdf8]">
                <Image
                  src={shot.src}
                  alt={shot.title}
                  width={shot.width}
                  height={shot.height}
                  sizes={shot.featured ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
                  className={shot.featured ? "h-[620px] w-full object-cover object-top" : "aspect-[16/10] w-full object-cover object-top"}
                  priority={shot.featured}
                />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium">{shot.title}</span>
                <span className="text-sm leading-6 text-[#6f675e]">{shot.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-y border-[#ded6ca] bg-[#171512] text-[#f8f3eb]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[420px_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#f0b49f]">Build Notes</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight">
              제안서에서 설명해야 할 기술 포인트를 코드 단위로 정리했습니다
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {stack.map((item) => (
                <Badge key={item} variant="outline" className="h-7 border-[#4c4740] px-3 text-[#d8cfc4]">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#3a352f]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {files.map(([file, role]) => (
                  <tr key={file} className="border-b border-[#3a352f] last:border-0">
                    <th className="w-[46%] bg-[#211e1a] px-4 py-4 align-top font-mono text-xs font-medium text-[#f0b49f]">
                      {file}
                    </th>
                    <td className="px-4 py-4 leading-6 text-[#c9c0b5]">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <ProofCard
            icon={<LockKeyhole className="size-5" />}
            title="관리자 접근 제어"
            body="NextAuth Credentials와 User.role 기반으로 ADMIN 권한만 결제 관리 화면에 접근하도록 보호했습니다."
          />
          <ProofCard
            icon={<FileText className="size-5" />}
            title="환불 증빙 모달"
            body="취소 거래별 금액, 사유, 일시, transactionKey, Trace ID를 관리자 화면 안에서 확인할 수 있습니다."
          />
          <ProofCard
            icon={<BadgeCheck className="size-5" />}
            title="운영 전환 체크"
            body="운영 DB 전환, Toss 키 교체, 관리자 계정 정책, 웹훅 동기화까지 README에 인수 항목으로 정리했습니다."
          />
        </div>
      </section>

      <footer className="border-t border-[#ded6ca] bg-[#fcfaf5] px-6 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-[#5e574f] md:flex-row md:items-center md:justify-between">
          <div className="font-medium text-[#171512]">Toss Ops Studio</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Braces className="size-4" />
              홈
            </Link>
            <Link href="/products/payment-widget" className="inline-flex items-center gap-2">
              <CreditCard className="size-4" />
              결제위젯
            </Link>
            <Link href="/admin/payments" className="inline-flex items-center gap-2">
              <ReceiptText className="size-4" />
              운영 어드민
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ShowcaseNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded6ca] bg-[#f7f4ee]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/showcase" className="flex items-center gap-3 font-medium">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#171512] text-[#f8f3eb]">
            ✣
          </span>
          Toss Ops Showcase
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[#5e574f] md:flex">
          <Link href="/">홈</Link>
          <Link href="/products/payment-widget">결제위젯</Link>
          <Link href="/admin/payments">어드민</Link>
        </nav>
      </div>
    </header>
  );
}

function FlowPanel({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <Card className="rounded-lg border-[#ded6ca] bg-[#fffdf8] shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#efe6da] text-[#a75d45]">
            {icon}
          </span>
          <h3 className="font-display text-2xl font-medium">{title}</h3>
        </div>
        <ol className="mt-6 space-y-4">
          {items.map((item, index) => (
            <li key={item} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#171512] font-mono text-xs text-[#f8f3eb]">
                {index + 1}
              </span>
              <span className="leading-7 text-[#5e574f]">{item}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function ProofCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="rounded-lg border-[#ded6ca] bg-[#fffdf8] shadow-none">
      <CardContent className="p-6">
        <span className="flex size-10 items-center justify-center rounded-md bg-[#efe6da] text-[#a75d45]">
          {icon}
        </span>
        <h3 className="mt-5 font-display text-2xl font-medium">{title}</h3>
        <p className="mt-3 leading-7 text-[#5e574f]">{body}</p>
      </CardContent>
    </Card>
  );
}
