export const directFarmProposal = {
  title: "DirectFarm 무인 산지직송 주문 플랫폼 MVP 구축 견적서",
  subtitle: "야외 태블릿 키오스크 기반 단건 주문, QR 결제, 도매처 전송, 관리자 운영 시스템",
  date: "2026.05.26",
  price: "544,000,000원",
  vat: "VAT 별도",
  duration: "40일",
  people: "PM 1명, PL 1명",
  liveUrl: "https://tossops.bsclinic.xyz/directfarm",
  adminUrl: "https://tossops.bsclinic.xyz/directfarm/admin",
  githubUrl: "https://github.com/nohsangwoo/Toss_Ops_Studio_ex",
  summary:
    "소비자가 태블릿 화면에서 상품을 선택하고 배송지를 입력하면 Toss Payments QR 결제로 결제까지 완료되며, 결제 완료 주문은 도매처 전송 로그와 관리자 페이지에서 즉시 확인되는 MVP입니다.",
  scope: [
    "태블릿 키오스크용 상품 리스트, 상품 상세 팝업, 수량 선택, 단건 빠른 결제 흐름 구축",
    "Toss Payments QR/간편결제 위젯 연동, 결제 승인/실패 처리, 영수증 연결",
    "Cloudflare Turnstile 기반 결제 요청 전 보안 인증 적용",
    "상품, 판매가, 도매가, 도매처, 주문, 결제 상태, 전송 상태를 관리하는 Admin Web 구축",
    "결제 완료 후 도매처 전송 로그 저장 및 Solapi/Aligo 전환 가능한 알림 모듈 구조 설계",
    "CSV 다운로드, 운영 데이터 조회, Vercel 배포 및 PostgreSQL 기반 데이터베이스 연동",
  ],
  stack: [
    {
      label: "Frontend",
      value: "Next.js 16 App Router, React, TypeScript, Tailwind CSS, shadcn/ui",
    },
    {
      label: "Backend",
      value: "Next.js Route Handlers, Server Actions, Prisma ORM",
    },
    {
      label: "Database",
      value: "Neon PostgreSQL 기본, 프로젝트 여건에 따라 Supabase PostgreSQL 대체 가능",
    },
    {
      label: "Payment",
      value: "Toss Payments 결제위젯, QR 간편결제, 승인/실패/영수증 처리",
    },
    {
      label: "Security",
      value: "Cloudflare Turnstile, NextAuth Admin Role, 서버 금액 검증",
    },
    {
      label: "Deploy",
      value: "Vercel 배포, 커스텀 도메인, 환경변수 기반 운영 설정",
    },
    {
      label: "Expansion",
      value: "회원가입, 앱 확장, 푸시 알림이 필요하면 Firebase Auth/FCM 선택 적용 가능",
    },
  ],
  deliverables: [
    "실 구동 가능한 키오스크 주문 화면",
    "관리자 상품/도매처/주문 관리 화면",
    "결제 및 주문 로그 데이터베이스 스키마",
    "PG 결제 승인/실패 처리 API",
    "도매처 전송 로그 및 알림 모듈 인터페이스",
    "배포 환경 설정 및 운영 안내 문서",
  ],
  exclusions: [
    "PG 수수료, 문자/알림톡 발송비, Vercel/DB 등 외부 서비스 이용료는 별도입니다.",
    "도매처별 자동 정산, 복수 상품 장바구니, 실물 카드 단말기 연동은 본 견적 범위에서 제외합니다.",
    "실제 알림톡/SMS 발송은 Solapi 또는 Aligo 계정과 발송 키 발급 후 운영 환경에 연결합니다.",
  ],
};
