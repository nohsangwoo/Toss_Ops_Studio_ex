import type { Metadata } from "next";
import { ArrowDownToLine, ArrowUpRight, Database, LockKeyhole, Server, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { directFarmProposal } from "@/lib/directfarm/proposal";

export const metadata: Metadata = {
  title: "야외 무인 주문 및 도매처 직배송 O2O 웹 플랫폼 MVP 개발 견적서",
  description: "무인 산지직송 주문 플랫폼 MVP 구축 견적 보고서",
};

const pdfUrl = "/docs/directfarm-estimate.pdf";

export default function DirectFarmProposalPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] px-5 py-8 text-neutral-950 print:bg-white print:px-0 print:py-0">
      <section className="mx-auto max-w-5xl rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <section className="rounded-[28px] bg-neutral-950 p-7 text-white print:rounded-2xl print:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
            Total Estimate
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-5xl font-bold tracking-tight md:text-6xl">
                {directFarmProposal.price}
              </p>
              <p className="mt-2 text-lg font-semibold text-[#ff8aa0]">{directFarmProposal.vat}</p>
            </div>
            <a
              href={pdfUrl}
              download
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 print:hidden"
            >
              <ArrowDownToLine className="h-4 w-4" />
              PDF 다운로드
            </a>
          </div>
          <p className="mt-5 max-w-3xl leading-7 text-white/72">{directFarmProposal.summary}</p>
        </section>

        <div className="my-8 border-b border-neutral-200 pb-6 print:my-5 print:pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
            Estimate Report
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {directFarmProposal.title}
          </h1>
          <p className="mt-2 text-neutral-600">{directFarmProposal.subtitle}</p>
        </div>

        <section className="grid gap-3 py-6 md:grid-cols-4 print:grid-cols-4 print:py-4">
          <Metric label="작업기간" value={directFarmProposal.duration} />
          <Metric label="투입인력" value={directFarmProposal.people} />
          <Metric label="견적 기준일" value={directFarmProposal.date} />
          <Metric label="진행 방식" value="MVP 구축" />
        </section>

        <section className="grid gap-6 md:grid-cols-3 print:grid-cols-3">
          {directFarmProposal.projectBackground.map((item) => (
            <ReportBlock key={item.label} title={item.label}>
              <p className="leading-7 text-neutral-700">{item.value}</p>
            </ReportBlock>
          ))}
        </section>

        <section className="mt-6 rounded-[24px] border border-neutral-200 bg-white p-6 print:mt-4 print:p-4">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                Verified Screens
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">시연 화면 기준 구현 내용</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-neutral-600">
              첨부된 실제 시연 캡처를 기준으로 소비자 주문 화면과 관리자 운영 화면에 포함되는 범위를
              분리해 정리했습니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 print:grid-cols-2">
            {directFarmProposal.verifiedScreens.map((screen) => (
              <div key={screen.title} className="overflow-hidden rounded-[24px] border border-neutral-200">
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Image
                    src={screen.imageUrl}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-semibold tracking-tight">{screen.title}</h3>
                  <p className="text-sm leading-6 text-neutral-700">{screen.description}</p>
                  <ul className="space-y-2 text-sm leading-6 text-neutral-600">
                    {screen.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff385c]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2 print:mt-4 print:grid-cols-2">
          <FlowBlock title="소비자 주문 흐름" items={directFarmProposal.customerFlow} />
          <FlowBlock title="관리자 운영 흐름" items={directFarmProposal.adminFlow} />
        </section>

        <section className="mt-6 rounded-[24px] border border-neutral-200 bg-white p-6 print:mt-4 print:p-4">
          <h2 className="text-2xl font-semibold tracking-tight print:text-xl">
            시연 화면에서 확인된 전체 시나리오
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 print:grid-cols-2">
            {directFarmProposal.verifiedScenarios.map((scenario) => (
              <div key={scenario.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="font-semibold tracking-tight">{scenario.title}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-700">{scenario.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-neutral-200 bg-white p-6 print:mt-4 print:p-4">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff385c]">
                Payment Evidence
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">결제 진행 및 증빙 화면</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-neutral-600">
              상품 선택 이후 결제 직전, QR 결제 호출, 결제 완료, 매출전표까지 이어지는 증빙 화면입니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 print:grid-cols-2">
            {directFarmProposal.paymentScreens.map((screen) => (
              <div key={screen.title} className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white">
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Image
                    src={screen.imageUrl}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-contain object-top"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold tracking-tight">{screen.title}</h3>
                  <p className="text-sm leading-6 text-neutral-700">{screen.description}</p>
                  <ul className="space-y-2 text-sm leading-6 text-neutral-600">
                    {screen.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff385c]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-3 print:mt-4 print:grid-cols-3">
          {directFarmProposal.implementationDetails.map((detail) => (
            <FlowBlock key={detail.title} title={detail.title} items={detail.items} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-[1.05fr_0.95fr] print:mt-4 print:grid-cols-[1.05fr_0.95fr]">
          <ReportBlock title="수행 범위">
            <ul className="space-y-3">
              {directFarmProposal.scope.map((item) => (
                <li key={item} className="flex gap-3 leading-6 text-neutral-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff385c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ReportBlock>

          <ReportBlock title="배포 인프라 아키텍처">
            <ArchitectureDiagram />
          </ReportBlock>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-[0.95fr_1.05fr] print:mt-4 print:grid-cols-[0.95fr_1.05fr]">
          <ReportBlock title="사용 기술 및 도구">
            <div className="grid gap-3">
              {directFarmProposal.stack.map((item) => (
                <div key={item.label} className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff385c]">
                    {item.label}
                  </p>
                  <p className="mt-2 leading-6 text-neutral-700">{item.value}</p>
                </div>
              ))}
            </div>
          </ReportBlock>

          <div className="grid gap-6">
            <ReportBlock title="산출물">
              <div className="grid gap-2 sm:grid-cols-2">
                {directFarmProposal.deliverables.map((item) => (
                  <div key={item} className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium leading-6">
                    {item}
                  </div>
                ))}
              </div>
            </ReportBlock>

            <ReportBlock title="참고 링크">
              <div className="grid gap-3">
                <ReportLink href={directFarmProposal.liveUrl} label="DirectFarm 키오스크 화면" />
                <ReportLink href={directFarmProposal.adminUrl} label="DirectFarm 관리자 화면" />
                <ReportLink href={directFarmProposal.githubUrl} label="GitHub 저장소" />
              </div>
            </ReportBlock>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-neutral-200 bg-[#fff8fa] p-5 print:mt-4">
          <h2 className="text-xl font-semibold tracking-tight">견적 조건</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
            {directFarmProposal.exclusions.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#ff385c]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-neutral-200 bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function ReportBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white p-6 print:p-4">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight print:text-xl">{title}</h2>
      {children}
    </section>
  );
}

function FlowBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white p-6 print:p-4">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight print:text-xl">{title}</h2>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 leading-6 text-neutral-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff385c] font-mono text-xs font-semibold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReportLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold hover:border-[#ff385c]"
    >
      {label}
      <ArrowUpRight className="h-4 w-4 text-[#ff385c]" />
    </a>
  );
}

function ArchitectureDiagram() {
  const boxes = [
    { icon: <Server />, title: "Vercel", desc: "Next.js 16 App Router" },
    { icon: <Database />, title: "Neon PostgreSQL", desc: "Prisma schema and migration" },
    { icon: <ShieldCheck />, title: "Toss Payments", desc: "QR payment and receipt" },
    { icon: <LockKeyhole />, title: "Turnstile + NextAuth", desc: "Bot check and admin role" },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Tablet Kiosk / Admin Browser
        </p>
        <p className="mt-2 text-sm text-neutral-600">HTTPS로 주문 화면과 관리자 화면 접속</p>
      </div>
      <div className="text-center text-sm font-semibold text-[#ff385c]">↓</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {boxes.map((box) => (
          <div key={box.title} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-[#ff385c] [&_svg]:h-4 [&_svg]:w-4">
              {box.icon}
              <p className="font-semibold text-neutral-950">{box.title}</p>
            </div>
            <p className="mt-2 text-sm leading-5 text-neutral-600">{box.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-neutral-300 p-4 text-sm leading-6 text-neutral-600">
        결제 완료 후 주문 데이터는 PostgreSQL에 저장되고, 도매처 전송은 Mock 로그로 검증한 뒤
        Solapi 또는 Aligo로 교체할 수 있는 구조입니다.
      </div>
    </div>
  );
}
