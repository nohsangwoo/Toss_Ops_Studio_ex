import type { Metadata } from "next";
import { ArrowUpRight, Download, FileText } from "lucide-react";

import { estimate } from "@/lib/proposal/estimate";

export const metadata: Metadata = {
  title: "토스페이먼츠 PG 연동 견적서",
  description: "토스페이먼츠 PG 연동 및 결제 관리 어드민 구축 견적서",
};

export default function EstimatePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-10 text-[#171512]">
      <section className="mx-auto max-w-4xl rounded-lg border border-[#ded6ca] bg-[#fffdf8] p-8 shadow-sm">
        <div className="flex flex-col gap-6 border-b border-[#ded6ca] pb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#cc785c]">Estimate</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
              {estimate.title}
            </h1>
            <p className="mt-3 text-[#6c6a64]">{estimate.subtitle}</p>
          </div>
          <a
            href="/proposal/toss-payments-admin-estimate.pdf"
            download
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#cc785c] px-5 text-sm font-semibold text-white hover:bg-[#a9583e] print:hidden"
          >
            <Download className="size-4" />
            PDF 다운로드
          </a>
        </div>

        <div className="grid gap-4 border-b border-[#ded6ca] py-8 md:grid-cols-4">
          <Metric label="작업기간" value={estimate.duration} />
          <Metric label="지원 금액" value={estimate.price} />
          <Metric label="투입 인력" value={estimate.people} />
          <Metric label="작성일" value={estimate.date} />
        </div>

        <div className="grid gap-8 py-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">이벤트 제안가</h2>
            <p className="mt-3 leading-7 text-[#5e574f]">{estimate.note}</p>
          </div>
          <div className="rounded-lg border border-[#ded6ca] bg-[#f7f4ee] p-5">
            <p className="text-sm font-semibold text-[#6c6a64]">발주처 기술 스택 수용 범위</p>
            <p className="mt-2 leading-7">
              Next.js 15, Server Action, API Routes, PostgreSQL, Prisma ORM, shadcn/ui 기준의
              제안 내용을 100% 수용 가능합니다.
            </p>
          </div>
        </div>

        <div className="grid gap-8 border-t border-[#ded6ca] pt-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">작업 범위</h2>
            <ul className="mt-4 space-y-2 text-[#5e574f]">
              {estimate.scope.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-[#cc785c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">참고 링크</h2>
            <div className="mt-4 grid gap-3">
              <EstimateLink href={estimate.projectUrl} label="배포 프로젝트" />
              <EstimateLink href={estimate.githubUrl} label="GitHub 저장소" />
            </div>
            <div className="mt-6 rounded-lg border border-[#ded6ca] p-5">
              <FileText className="size-5 text-[#cc785c]" />
              <p className="mt-3 text-sm leading-6 text-[#5e574f]">
                이 페이지는 메뉴에 노출하지 않는 견적서 전용 페이지입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ded6ca] bg-[#f7f4ee] p-4">
      <p className="text-sm text-[#6c6a64]">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function EstimateLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-lg border border-[#ded6ca] bg-[#f7f4ee] px-4 py-3 font-medium hover:border-[#cc785c]"
    >
      {label}
      <ArrowUpRight className="size-4 text-[#cc785c]" />
    </a>
  );
}
