export const directFarmProposal = {
  title: "야외 무인 주문(키오스크형) 및 도매처 직배송 O2O 웹 플랫폼 MVP 개발",
  subtitle: "야외 태블릿 키오스크 기반 단건 주문, QR 결제, 도매처 전송, 관리자 운영 시스템",
  date: "2026.05.26",
  price: "5,440,000원",
  vat: "VAT 별도",
  duration: "40일",
  people: "PM 1명, PL 1명",
  liveUrl: "https://tossops.bsclinic.xyz/directfarm",
  adminUrl: "https://tossops.bsclinic.xyz/directfarm/admin",
  githubUrl: "https://github.com/nohsangwoo/Toss_Ops_Studio_ex",
  summary:
    "소비자가 태블릿 화면에서 상품을 선택하고 배송지를 입력하면 Toss Payments QR 결제로 결제까지 완료되며, 결제 완료 주문은 도매처 전송 로그와 관리자 페이지에서 즉시 확인되는 MVP입니다.",
  projectBackground: [
    {
      label: "사업 배경",
      value:
        "유동인구가 많은 야외 공간에 태블릿 기반 주문 화면을 설치하고, 고객이 현장에서 상품을 고르면 산지 또는 도매처가 직접 배송하는 O2O 유통 모델입니다.",
    },
    {
      label: "핵심 목표",
      value:
        "초기 MVP 단계에서 복잡한 장바구니와 자동 정산을 제외하고, 단건 상품 선택, QR 결제, 주문 로그, 도매처 전달, 관리자 운영 기능을 빠르게 검증합니다.",
    },
    {
      label: "운영 전제",
      value:
        "1대의 샘플 태블릿 또는 키오스크 환경에서 먼저 검증하고, 상품/가격/도매처는 관리자가 웹에서 직접 수정하는 구조로 확장성을 확보합니다.",
    },
  ],
  customerFlow: [
    "키오스크 홈에서 사진 중심 상품 카탈로그를 확인합니다.",
    "상품 카드를 누르면 현재 화면 위에 상세 팝업이 열리고 수량을 선택합니다.",
    "결제 진행을 누르면 같은 팝업 안에서 배송지 입력 폼과 결제위젯이 자연스럽게 확장됩니다.",
    "수령인, 연락처, 주소, 상세주소 또는 요청사항을 입력합니다.",
    "Cloudflare Turnstile 보안 인증을 통과한 뒤 Toss Payments QR 간편결제를 호출합니다.",
    "고객은 휴대폰으로 QR을 스캔해 결제를 완료하고, 성공 페이지와 영수증 링크를 확인합니다.",
  ],
  adminFlow: [
    "NextAuth ADMIN 권한으로 관리자 페이지에 접근합니다.",
    "상품명, 원산지, 단위, 판매가, 도매가, 노출 여부, 이미지 URL을 등록/수정합니다.",
    "상품별 도매처를 매핑하고 도매처명, 담당자, 연락처, 활성 상태를 관리합니다.",
    "주문 목록에서 결제 상태, 수량, 금액, 도매처, 전송 상태, 주문일을 확인합니다.",
    "결제 완료 주문은 영수증 링크와 도매처 재전송 버튼으로 운영 확인이 가능합니다.",
    "주문 데이터는 Excel 호환 CSV로 다운로드해 수동 정산과 운영 보고에 활용할 수 있습니다.",
  ],
  verifiedScreens: [
    {
      title: "소비자용 키오스크 주문 화면",
      imageUrl: "/images/directfarm/proposal/kiosk-flow.webp",
      alt: "DirectFarm 키오스크 주문 화면 전체 캡처",
      description:
        "야외 무인 주문 화면, 상품 카탈로그, 상품 선택 팝업, 수량 선택, 배송지 입력, Turnstile 인증, Toss Payments 결제위젯, QR 결제 호출까지 한 흐름으로 구성했습니다.",
      points: [
        "사진 중심 상품 카드와 큰 터치 CTA로 태블릿 환경에 맞춘 주문 UX",
        "팝업 안에서 상품 확인, 수량 선택, 배송지 입력, 결제위젯이 단계적으로 확장되는 흐름",
        "QR 간편결제를 호출해 실물 카드 단말기 없이 휴대폰 결제를 유도",
      ],
    },
    {
      title: "관리자 상품/도매처/주문 운영 화면",
      imageUrl: "/images/directfarm/proposal/admin-flow.webp",
      alt: "DirectFarm 관리자 화면 전체 캡처",
      description:
        "상품 가격, 도매가, 도매처 매핑, 주문 목록, 결제 상태, 도매처 전송 상태를 한 화면에서 관리하는 운영자 대시보드입니다.",
      points: [
        "상품 등록과 수정, 노출 여부 변경, 도매처 매핑을 관리자 화면에서 처리",
        "결제 완료/대기 주문과 도매처 전송 상태를 테이블에서 즉시 확인",
        "영수증 확인, 도매처 재전송, CSV 다운로드로 운영 증빙과 정산 보조",
      ],
    },
  ],
  verifiedScenarios: [
    {
      title: "01. 키오스크 랜딩과 상품 탐색",
      value:
        "홈 화면에서 서비스 콘셉트, 상품 카탈로그, 주문 시작 CTA가 노출되고 고객은 사진 중심 카드로 상품을 빠르게 고릅니다.",
    },
    {
      title: "02. 상품 선택 팝업과 수량 선택",
      value:
        "상품 클릭 시 페이지 이동 없이 팝업이 열리며 이미지, 원산지, 설명, 단가, 수량, 총 결제 금액을 즉시 확인합니다.",
    },
    {
      title: "03. 배송지 입력과 보안 인증",
      value:
        "수령인, 연락처, 주소, 상세주소를 큰 입력창으로 받고 Turnstile 인증 성공 후에만 결제 요청 버튼이 활성화됩니다.",
    },
    {
      title: "04. Toss QR 간편결제 호출",
      value:
        "Toss Payments 결제위젯에서 QR 결제창을 호출해 고객이 본인 휴대폰으로 스캔하고 결제를 완료하는 흐름을 제공합니다.",
    },
    {
      title: "05. 결제 완료와 영수증 확인",
      value:
        "승인 완료 후 주문 상태를 PAID로 저장하고 완료 화면에서 주문 화면, 관리자, Toss 매출전표 링크로 이동할 수 있습니다.",
    },
    {
      title: "06. 관리자 주문 로그와 도매처 전송",
      value:
        "관리자 화면에서 결제 상태, 주문번호, 구매자, 수량, 금액, 도매처, 전송 상태, 주문일, 영수증, 재전송 기능을 확인합니다.",
    },
  ],
  paymentScreens: [
    {
      title: "상품 선택 후 결제 전 확인",
      imageUrl: "/images/directfarm/proposal/product-detail.webp",
      alt: "DirectFarm 상품 선택 후 결제 전 상세 확인 화면",
      description:
        "상품 이미지, 원산지, 단위, 배송 방식, 결제 금액을 확인한 뒤 결제 흐름으로 진입하는 화면입니다.",
      points: ["상품 상세 정보 확인", "단건 결제 금액 확인", "도매처 전송 대상 상품 확인"],
    },
    {
      title: "배송지 입력 및 결제 직전",
      imageUrl: "/images/directfarm/proposal/checkout-before-payment.webp",
      alt: "DirectFarm 배송지 입력 및 Toss 결제위젯 화면",
      description:
        "수령인, 연락처, 주소, 상세주소를 입력하고 Toss Payments 결제위젯과 Turnstile 인증을 함께 확인하는 결제 직전 화면입니다.",
      points: ["배송지 입력 폼", "Toss 결제수단 UI", "Turnstile 보안 인증"],
    },
    {
      title: "QR 간편결제 호출",
      imageUrl: "/images/directfarm/proposal/qr-payment.webp",
      alt: "Toss Payments QR 결제창",
      description:
        "결제 요청 후 고객 휴대폰 카메라로 QR을 스캔해 결제를 이어가는 Toss Payments 결제창입니다.",
      points: ["QR 결제창 호출", "휴대폰 결제 유도", "실물 카드 단말기 대체"],
    },
    {
      title: "결제 완료 화면",
      imageUrl: "/images/directfarm/proposal/payment-success.webp",
      alt: "DirectFarm 결제 완료 화면",
      description:
        "결제 승인 후 주문 상태를 PAID로 저장하고 주문 화면, 관리자 화면, 영수증으로 이동할 수 있는 완료 화면입니다.",
      points: ["결제 승인 결과 표시", "주문 화면 자동 복귀", "영수증 링크 제공"],
    },
    {
      title: "매출전표/영수증 화면",
      imageUrl: "/images/directfarm/proposal/sales-receipt.webp",
      alt: "Toss Payments 매출전표 화면",
      description:
        "Toss Payments에서 제공하는 카드 매출전표로 주문번호, 구매상품, 결제상태, 결제일시, 금액을 확인합니다.",
      points: ["결제 증빙 확인", "주문번호 대조", "공급가/부가세/합계 확인"],
    },
  ],
  implementationDetails: [
    {
      title: "결제 및 보안",
      items: [
        "Toss Payments 결제위젯을 사용해 QR/간편결제 흐름을 구성합니다.",
        "결제 금액은 클라이언트 입력이 아니라 DB 상품 판매가와 수량 기준으로 서버에서 검증합니다.",
        "결제 요청 전 Cloudflare Turnstile 토큰을 서버에서 검증해 공개 키오스크 환경의 자동 요청을 줄입니다.",
      ],
    },
    {
      title: "주문 및 도매처 전송",
      items: [
        "결제 전 주문 초안을 만들고, 결제 승인 후 주문 상태를 PAID로 갱신합니다.",
        "결제 완료 주문은 상품에 연결된 도매처 담당자에게 전달할 payload를 생성합니다.",
        "MVP에서는 Mock 전송 로그를 저장하고, 실제 운영 시 Solapi 또는 Aligo로 교체 가능한 구조입니다.",
      ],
    },
    {
      title: "관리 및 데이터",
      items: [
        "상품, 도매처, 주문, 알림 로그를 DirectFarm 전용 Prisma 테이블로 분리합니다.",
        "기존 Toss Ops 결제 관리 데이터와 DirectFarm 주문 데이터가 섞이지 않도록 라우트와 스키마를 분리합니다.",
        "관리자는 CSV 다운로드로 주문 내역을 외부 정산/보고 자료로 활용할 수 있습니다.",
      ],
    },
  ],
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
