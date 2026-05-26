export const directFarmVendors = [
  {
    name: "논산 베리팜 도매",
    managerName: "김수현",
    phone: "010-4100-2030",
  },
  {
    name: "청송 햇사과 유통",
    managerName: "박정우",
    phone: "010-5200-3040",
  },
  {
    name: "해남 뿌리상회",
    managerName: "이도윤",
    phone: "010-6300-4050",
  },
  {
    name: "지리산 꿀농장",
    managerName: "최민지",
    phone: "010-7400-5060",
  },
] as const;

export const directFarmProducts = [
  {
    slug: "nonsan-strawberry-pack",
    name: "논산 설향 딸기 1kg",
    description:
      "당일 선별한 설향 딸기를 산지에서 바로 포장해 보내는 프리미엄 생과 패키지입니다.",
    imageUrl: "/images/directfarm/strawberry-pack.jpeg",
    origin: "충남 논산",
    unit: "1kg 박스",
    salePrice: 29900,
    wholesalePrice: 21800,
    sortOrder: 1,
    vendorName: "논산 베리팜 도매",
  },
  {
    slug: "cheongsong-apple-box",
    name: "청송 꿀사과 3kg",
    description:
      "아삭한 식감과 진한 당도를 기준으로 선별한 청송 산지 직송 사과 박스입니다.",
    imageUrl: "/images/directfarm/apple-box.jpeg",
    origin: "경북 청송",
    unit: "3kg 박스",
    salePrice: 34900,
    wholesalePrice: 25400,
    sortOrder: 2,
    vendorName: "청송 햇사과 유통",
  },
  {
    slug: "haenam-sweet-potato",
    name: "해남 꿀고구마 5kg",
    description:
      "숙성 후 출고되는 해남 꿀고구마로, 가정 간식과 소포장 판매에 적합합니다.",
    imageUrl: "/images/directfarm/sweet-potato-box.jpeg",
    origin: "전남 해남",
    unit: "5kg 박스",
    salePrice: 26900,
    wholesalePrice: 18700,
    sortOrder: 3,
    vendorName: "해남 뿌리상회",
  },
  {
    slug: "jirisan-honey-gift",
    name: "지리산 야생화 꿀 세트",
    description:
      "선물용 패키지로 구성한 야생화 꿀 세트입니다. 무인 매대 고단가 상품 검증용으로 구성했습니다.",
    imageUrl: "/images/directfarm/honey-gift.jpeg",
    origin: "경남 산청",
    unit: "500g x 2병",
    salePrice: 42900,
    wholesalePrice: 31800,
    sortOrder: 4,
    vendorName: "지리산 꿀농장",
  },
] as const;

export const directFarmHeroAssets = {
  hero: "/images/directfarm/directfarm-hero.jpeg",
  packing: "/images/directfarm/farm-packing.jpeg",
  slides: [
    "/images/directfarm/directfarm-hero.jpeg",
    "/images/directfarm/directfarm-hero-market.jpeg",
    "/images/directfarm/directfarm-hero-tablet.jpeg",
    "/images/directfarm/directfarm-hero-delivery.jpeg",
  ],
} as const;
