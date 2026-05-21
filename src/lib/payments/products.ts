export const MOCK_PRODUCTS = [
  {
    id: "pg-integration",
    slug: "pg-integration",
    name: "토스페이먼츠 PG 연동 패키지",
    eyebrow: "Core integration",
    shortName: "PG 연동",
    description:
      "Next.js 서버 라우트와 Prisma 스키마를 기준으로 결제 요청, 승인 검증, 실패 처리, 영수증 저장까지 연결하는 기본 구축 패키지입니다.",
    detail:
      "이미 디자인과 결제 랜딩이 준비된 서비스에 토스페이먼츠 V2 SDK와 서버 승인 API를 안전하게 붙입니다. 결제 금액 위변조 방지를 위해 서버 저장 주문 금액을 기준으로 승인하고, 원본 응답과 이벤트 로그를 모두 보존합니다.",
    price: 490000,
    period: "3-5 영업일",
    image: "/images/products/pg-integration-suite.jpeg",
    accent: "coral",
    bestFor: "기존 랜딩/주문 페이지가 있고 실제 PG 승인 흐름만 빠르게 붙여야 하는 팀",
    includes: [
      "Toss Payments V2 SDK 초기화",
      "주문 초안 생성 API",
      "결제 성공/실패 리다이렉트 처리",
      "서버 승인 API 및 금액 검증",
      "Prisma 결제 로그 스키마",
    ],
    outputs: ["결제 요청 UI", "승인/실패 페이지", "결제 로그 테이블", "연동 README"],
  },
  {
    id: "payment-widget",
    slug: "payment-widget",
    name: "결제위젯 주문서 구축 패키지",
    eyebrow: "Checkout experience",
    shortName: "결제위젯",
    description:
      "토스페이먼츠 결제위젯을 주문서 안에 직접 렌더링하고, 결제수단 UI와 약관 UI를 실제 구매 흐름처럼 구성합니다.",
    detail:
      "결제수단 선택 UI를 직접 만들지 않고 Toss Payments 위젯을 렌더링합니다. 상품 상세, 구매자 정보, 주문 요약, 결제수단, 약관, 결제 요청 버튼까지 하나의 주문서로 연결해 전환 흐름을 자연스럽게 만듭니다.",
    price: 790000,
    period: "5-7 영업일",
    image: "/images/products/payment-widget-suite.jpeg",
    accent: "dark",
    bestFor: "카드, 간편결제, 계좌이체 등 결제수단 확장 가능성을 열어두고 싶은 서비스",
    includes: [
      "tossPayments.widgets() 기반 결제위젯",
      "renderPaymentMethods / renderAgreement 연동",
      "상품 상세 및 주문 요약 UI",
      "결제 금액 변경 시 위젯 금액 동기화",
      "성공 리다이렉트 후 서버 승인 처리",
    ],
    outputs: ["상품 상세 페이지", "결제위젯 주문서", "구매자 정보 폼", "모바일 대응 체크아웃"],
  },
  {
    id: "admin-operations",
    slug: "admin-operations",
    name: "결제 운영 어드민 패키지",
    eyebrow: "Admin operations",
    shortName: "운영 어드민",
    description:
      "NextAuth 관리자 Role을 기준으로 결제 내역, 상태 로그, 영수증 링크, 전체/부분 환불 액션을 운영 화면으로 제공합니다.",
    detail:
      "관리자가 실제로 매일 보는 결제 운영 화면을 구축합니다. 결제 상태별 요약, 상세 로그, 실패 사유, 영수증, 결제 취소 API 호출까지 한 화면에서 처리하도록 구성합니다.",
    price: 980000,
    period: "6-9 영업일",
    image: "/images/products/admin-operations-suite.jpeg",
    accent: "cream",
    bestFor: "PG 연동 이후 운영팀이 직접 결제 상태와 환불을 관리해야 하는 서비스",
    includes: [
      "NextAuth Credentials 관리자 Role",
      "결제 내역 대시보드",
      "상태별 요약 지표",
      "Toss Payments 취소 API",
      "전체/부분 취소 로그 저장",
    ],
    outputs: ["관리자 결제 테이블", "환불 다이얼로그", "권한 보호 라우트", "운영 가이드"],
  },
] as const;

export type MockProduct = (typeof MOCK_PRODUCTS)[number];
export type MockProductId = MockProduct["id"];

export function getProduct(productId: string) {
  return (
    MOCK_PRODUCTS.find((product) => product.id === productId || product.slug === productId) ??
    MOCK_PRODUCTS[0]
  );
}

export function getProductBySlug(slug: string) {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}
