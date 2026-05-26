# Project Docs

이 저장소는 하나의 Next.js/Vercel/Neon 인프라 위에 여러 목업 프로젝트를 분리해서 올리는 포트폴리오형 저장소입니다.

각 프로젝트는 라우트, API, Prisma 모델, 이미지 에셋, 문서를 프로젝트 단위로 나누어 관리합니다.

## Projects

| 프로젝트 | 공유 문서 | 배포 링크 | 성격 |
| --- | --- | --- | --- |
| Toss Ops Studio | [루트 README](../../README.md) | https://tossops.bsclinic.xyz | Toss Payments PG 연동 및 결제 관리 어드민 |
| DirectFarm | [DirectFarm README](./directfarm/README.md) | https://tossops.bsclinic.xyz/directfarm | 무인 키오스크 주문, QR 결제, 도매처 직배송 MVP |

## 분리 규칙

- 화면 라우트는 `/프로젝트명` 하위로 둡니다.
- API는 `/api/프로젝트명/*` 하위로 둡니다.
- Prisma 모델은 프로젝트 접두어를 붙여 기존 데이터와 섞이지 않게 둡니다.
- 이미지 에셋은 `public/images/프로젝트명/` 하위로 둡니다.
- 공유용 문서는 `docs/projects/프로젝트명/README.md`로 둡니다.
