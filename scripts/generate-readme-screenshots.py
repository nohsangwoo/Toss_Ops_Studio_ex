from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

COLORS = {
    "canvas": "#faf9f5",
    "soft": "#f5f0e8",
    "card": "#fffdf8",
    "line": "#e6dfd8",
    "ink": "#141413",
    "muted": "#6c6a64",
    "primary": "#cc785c",
    "dark": "#16243a",
    "green": "#47c78f",
    "blue": "#eaf4ff",
}


def font(size, bold=False, mono=False):
    candidates = []
    if mono:
        candidates = [
            "C:/Windows/Fonts/consola.ttf",
            "C:/Windows/Fonts/CascadiaMono.ttf",
        ]
    elif bold:
        candidates = [
            "C:/Windows/Fonts/malgunbd.ttf",
            "C:/Windows/Fonts/NotoSansKR-Bold.otf",
        ]
    else:
        candidates = [
            "C:/Windows/Fonts/malgun.ttf",
            "C:/Windows/Fonts/NotoSansKR-Regular.otf",
        ]

    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


F = {
    "xs": font(14),
    "sm": font(16),
    "base": font(18),
    "md": font(22),
    "lg": font(28, bold=True),
    "xl": font(34, bold=True),
    "hero": font(44, bold=True),
    "mono": font(15, mono=True),
    "mono_lg": font(22, mono=True),
}


def rounded(draw, box, radius=18, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, fill=None, font_key="base", anchor=None):
    draw.text(xy, value, fill=fill or COLORS["ink"], font=F[font_key], anchor=anchor)


def pill(draw, xy, label, fill=COLORS["primary"], color="white"):
    x, y = xy
    bbox = draw.textbbox((0, 0), label, font=F["sm"])
    w = bbox[2] - bbox[0] + 26
    h = 32
    rounded(draw, (x, y, x + w, y + h), 15, fill=fill)
    text(draw, (x + 13, y + 5), label, fill=color, font_key="sm")
    return x + w


def mask(draw, box, radius=8):
    rounded(draw, box, radius, fill="#d8d5ce")
    x1, y1, x2, y2 = box
    for x in range(x1 + 8, x2 - 8, 18):
        draw.line((x, y1 + 6, x + 10, y2 - 6), fill="#c4c0b8", width=3)


def save(img, name):
    img.save(OUT / name, "PNG", optimize=True)


def payment_success():
    img = Image.new("RGB", (1200, 900), COLORS["canvas"])
    d = ImageDraw.Draw(img)
    rounded(d, (250, 430, 950, 640), 20, fill=COLORS["card"], outline=COLORS["line"])
    pill(d, (272, 452), "DONE")
    text(d, (272, 505), "결제가 완료되었습니다", font_key="md")
    text(d, (272, 540), "결제위젯 주문서 구축 패키지 승인 결과가 데이터베이스에 저장되었습니다.", COLORS["muted"], "base")
    d.line((272, 585, 928, 585), fill=COLORS["line"], width=1)
    pill(d, (272, 606), "결제 페이지")
    rounded(d, (388, 606, 492, 638), 15, fill=COLORS["soft"], outline=COLORS["line"])
    text(d, (405, 612), "관리자 페이지", font_key="sm")
    rounded(d, (508, 606, 582, 638), 15, fill=COLORS["card"], outline=COLORS["line"])
    text(d, (527, 612), "영수증", font_key="sm")
    save(img, "01-payment-success.png")


def receipt():
    img = Image.new("RGB", (520, 1020), "#f4f7fb")
    d = ImageDraw.Draw(img)
    rounded(d, (32, 20, 488, 1000), 4, fill="white")
    for y in range(30, 990, 55):
        text(d, (48, y), "테스트결제", fill="#d8dde6", font_key="sm")
        text(d, (242, y + 8), "테스트결제", fill="#d8dde6", font_key="sm")
    text(d, (64, 72), "신용·체크카드 매출전표", fill="#253954", font_key="lg")
    text(d, (64, 146), "주문번호", fill=COLORS["muted"], font_key="sm")
    text(d, (230, 146), "order-************7ef8", fill="#253954", font_key="sm")
    text(d, (64, 190), "구매자", fill=COLORS["muted"], font_key="sm")
    mask(d, (300, 184, 388, 208))
    text(d, (64, 234), "구매상품", fill=COLORS["muted"], font_key="sm")
    text(d, (254, 234), "결제위젯 주문서 구축 패키지", fill="#253954", font_key="sm")
    d.line((64, 274, 456, 274), fill="#dde3ea")
    rows = [
        ("카드종류", "삼성"),
        ("카드번호", "5361**** **** ****"),
        ("할부", "일시불"),
        ("결제상태", "완료"),
        ("승인번호", "00000000"),
        ("결제일시", "2026-05-21 18:57:57"),
    ]
    y = 304
    for k, v in rows:
        text(d, (64, y), k, fill=COLORS["muted"], font_key="sm")
        text(d, (456, y), v, fill="#253954", font_key="sm", anchor="ra")
        y += 42
    d.line((64, y + 8, 456, y + 8), fill="#dde3ea")
    y += 42
    totals = [("공급가액", "718,182 원"), ("면세가액", "0 원"), ("부가세", "71,818 원"), ("합계", "790,000 원")]
    for k, v in totals:
        color = "#1d6eff" if k == "합계" else "#253954"
        text(d, (64, y), k, fill="#1d6eff" if k == "합계" else COLORS["muted"], font_key="sm")
        text(d, (456, y), v, fill=color, font_key="sm", anchor="ra")
        y += 42
    d.line((64, y + 8, 456, y + 8), fill="#dde3ea")
    text(d, (64, y + 44), "이용상점", fill=COLORS["muted"], font_key="sm")
    text(d, (64, y + 76), "상호·사업자등록번호·주소는 공유용 이미지에서 마스킹 처리", fill="#253954", font_key="xs")
    text(d, (64, 948), "toss payments", fill="#152238", font_key="md")
    save(img, "02-sales-receipt-masked.png")


def admin_dashboard(name, canceled=False):
    img = Image.new("RGB", (1300, 820), COLORS["canvas"])
    d = ImageDraw.Draw(img)
    text(d, (28, 28), "♡  NextAuth Admin Role", fill=COLORS["muted"], font_key="base")
    text(d, (28, 68), "결제 관리 어드민", font_key="xl")
    text(d, (28, 110), "토스페이먼츠 승인 결과, DB 로그, 취소 처리를 한 화면에서 관리합니다.", fill=COLORS["muted"], font_key="base")
    rounded(d, (1110, 52, 1192, 88), 16, fill=COLORS["soft"])
    text(d, (1130, 60), "결제 화면", font_key="sm")
    rounded(d, (1204, 52, 1282, 88), 16, fill=COLORS["card"], outline=COLORS["line"])
    text(d, (1226, 60), "로그아웃", font_key="sm")
    metrics = [
        ("전체 결제 로그", "5건" if not canceled else "6건"),
        ("승인 완료", "2건" if not canceled else "1건"),
        ("승인 금액", "1,089,000원" if not canceled else "299,000원"),
        ("취소 금액", "0원" if not canceled else "790,000원"),
    ]
    for i, (label, value) in enumerate(metrics):
        x = 24 + i * 318
        rounded(d, (x, 150, x + 300, 292), 18, fill=COLORS["card"], outline=COLORS["line"])
        text(d, (x + 24, 196), label, fill=COLORS["muted"], font_key="sm")
        text(d, (x + 24, 224), value, font_key="lg")
    rounded(d, (24, 318, 1276, 760), 18, fill=COLORS["card"], outline=COLORS["line"])
    text(d, (48, 344), "결제 내역", font_key="md")
    text(d, (48, 374), "결제 요청, 승인, 실패, 취소 이벤트가 최신순으로 표시됩니다.", fill=COLORS["muted"], font_key="sm")
    headers = ["상태", "주문", "구매자", "금액", "결제수단", "승인일", "최근 이벤트", "관리"]
    xs = [48, 130, 400, 620, 696, 770, 890, 1138]
    y = 420
    for x, h in zip(xs, headers):
        text(d, (x, y), h, font_key="sm")
    d.line((48, 452, 1254, 452), fill=COLORS["line"])
    rows = [
        ("DONE" if not canceled else "READY", "결제위젯 주문서 구축 패키지", "홍**\nb***@example.com", "790,000원", "간편결제" if not canceled else "-", "26. 5. 21. PM 6:57" if not canceled else "-", "PAYMENT_CONFIRMED" if not canceled else "PAYMENT_DRAFT_CREATED", "영수증  취소" if not canceled else "증빙  취소"),
        ("READY" if not canceled else "CANCELED", "결제위젯 주문서 구축 패키지", "홍**\nb***@example.com", "790,000원\n취소 790,000원" if canceled else "49,000원", "간편결제" if canceled else "-", "26. 5. 21. PM 6:57\n취소 26. 5. 21. PM 6:59" if canceled else "-", "PAYMENT_CANCELED" if canceled else "PAYMENT_DRAFT_CREATED", "환불 증빙  영수증"),
        ("READY", "스타터 통합 점검", "김**\nm***@example.com", "49,000원", "-", "-", "-", "증빙  취소"),
        ("DONE", "토스페이먼츠 PG 연동", "이**\ns***@example.com", "299,000원", "카드", "26. 5. 21. PM 5:09", "-", "증빙  취소"),
    ]
    y = 476
    for row in rows:
        pill_color = COLORS["primary"] if row[0] in ["DONE", "CANCELED"] else COLORS["card"]
        rounded(d, (48, y - 10, 118, y + 18), 14, fill=pill_color, outline=COLORS["line"])
        text(d, (64, y - 5), row[0], fill="white" if pill_color == COLORS["primary"] else COLORS["ink"], font_key="xs")
        text(d, (130, y - 6), row[1], font_key="sm")
        mask(d, (130, y + 18, 320, y + 32), radius=3)
        for x, value in zip(xs[2:], row[2:]):
            parts = value.split("\n")
            text(d, (x, y - 6), parts[0], font_key="sm")
            if len(parts) > 1:
                text(d, (x, y + 18), parts[1], fill=COLORS["muted"], font_key="xs")
        d.line((48, y + 46, 1254, y + 46), fill=COLORS["line"])
        y += 64
    save(img, name)


def qr_modal():
    img = Image.new("RGB", (1240, 980), "#20100d")
    d = ImageDraw.Draw(img)
    rounded(d, (30, 68, 1210, 930), 20, fill="#6d3528")
    rounded(d, (680, 90, 1210, 920), 14, fill="#ece7dd")
    text(d, (72, 96), "LIVE CHECKOUT", fill="#d7b8aa", font_key="sm")
    text(d, (72, 132), "이 화면에서 바로 결제위젯을\n테스트하세요", fill="#e8d8cf", font_key="hero")
    rounded(d, (390, 280, 880, 980), 8, fill="white")
    text(d, (420, 346), "pay", fill="#172034", font_key="lg")
    text(d, (760, 294), "×", fill="#aab1bb", font_key="lg")
    text(d, (520, 410), "휴대폰번호", fill="#768397", font_key="base")
    text(d, (710, 410), "QR코드", fill="#253247", font_key="base")
    d.line((420, 446, 846, 446), fill="#d8dce2")
    d.line((628, 446, 846, 446), fill="#172034", width=2)
    text(d, (620, 500), "QR코드를 카메라로 찍어", fill="#253247", font_key="md", anchor="ma")
    text(d, (620, 536), "링크를 들어가주세요", fill="#253247", font_key="md", anchor="ma")
    text(d, (620, 588), "기본 카메라 앱을 사용해주세요.", fill="#6a7587", font_key="base", anchor="ma")
    rounded(d, (546, 646, 720, 820), 6, fill="#111")
    inner = Image.new("RGB", (174, 174), "white")
    idr = ImageDraw.Draw(inner)
    for i in range(0, 174, 12):
        for j in range(0, 174, 12):
            if (i * 7 + j * 11) % 5 in [0, 1]:
                idr.rectangle((i, j, i + 8, j + 8), fill="black")
    inner = inner.filter(ImageFilter.GaussianBlur(radius=4))
    img.paste(inner, (546, 646))
    save(img, "04-widget-qr-masked.png")


def cancel_dialog():
    bg = Image.new("RGB", (1120, 864), COLORS["canvas"])
    d = ImageDraw.Draw(bg)
    text(d, (12, 52), "결제 관리 어드민", font_key="xl")
    for i in range(4):
        rounded(d, (8 + i * 326, 150, 312 + i * 326, 292), 18, fill=COLORS["card"], outline=COLORS["line"])
    rounded(d, (8, 318, 1112, 720), 18, fill=COLORS["card"], outline=COLORS["line"])
    bg = bg.filter(ImageFilter.GaussianBlur(radius=5))
    d = ImageDraw.Draw(bg)
    rounded(d, (396, 376, 818, 740), 18, fill=COLORS["card"], outline="#cfc8be")
    text(d, (414, 394), "결제 취소 처리", font_key="md")
    text(d, (792, 392), "×", font_key="md")
    text(d, (414, 428), "토스페이먼츠 결제 취소 API를 호출하고 결과를 결제 로그에\n저장합니다.", fill=COLORS["muted"], font_key="sm")
    text(d, (414, 486), "취소 사유", font_key="sm")
    rounded(d, (414, 506, 798, 574), 10, fill="white", outline=COLORS["line"])
    text(d, (426, 524), "관리자 요청 환불", font_key="sm")
    text(d, (414, 598), "부분 취소 금액", font_key="sm")
    rounded(d, (414, 618, 798, 652), 14, fill="white", outline=COLORS["line"])
    text(d, (426, 626), "미입력 시 전액 취소 (790,000원)", fill=COLORS["muted"], font_key="sm")
    d.line((396, 670, 818, 670), fill=COLORS["line"])
    rounded(d, (654, 690, 706, 724), 14, fill=COLORS["soft"])
    text(d, (670, 698), "닫기", font_key="sm")
    rounded(d, (718, 690, 800, 724), 14, fill="#e5aa96")
    text(d, (736, 698), "취소 실행", fill="white", font_key="sm")
    save(bg, "05-cancel-dialog.png")


def api_log(name, request=False):
    img = Image.new("RGB", (1500, 960), "white")
    d = ImageDraw.Draw(img)
    text(d, (70, 26), "API 로그", fill="#26364c", font_key="xl")
    text(d, (70, 72), "최신버전 API로그를 확인할 수 있어요.", fill="#1d6eff", font_key="sm")
    rounded(d, (70, 108, 330, 140), 8, fill="#f0f2f5")
    rounded(d, (72, 110, 196, 138), 8, fill="white")
    text(d, (112, 116), "테스트", font_key="sm")
    text(d, (246, 116), "라이브", fill=COLORS["muted"], font_key="sm")
    rounded(d, (340, 108, 620, 140), 8, fill="white", outline="#dde3ea")
    text(d, (356, 116), "paymentKey, orderId, traceId 검색", fill="#93a0ad", font_key="sm")
    d.line((70, 164, 760, 164), fill="#dde3ea")
    headers = ["응답 상태", "메서드", "엔드포인트", "상점아이디(MID)", "요청시간"]
    xs = [86, 190, 280, 420, 570]
    for x, h in zip(xs, headers):
        text(d, (x, 174), h, fill="#526071", font_key="sm")
    rows = [("/v1/payments/****/cancel", "2026-05-21 18:59:58"), ("/v1/payments/confirm", "2026-05-21 18:57:56")]
    y = 216
    for endpoint, time_value in rows:
        rounded(d, (84, y - 7, 120, y + 18), 12, fill="#d5f8e6")
        text(d, (92, y - 3), "200", fill="#12815a", font_key="xs")
        text(d, (190, y - 2), "POST", fill="#526071", font_key="sm")
        text(d, (280, y - 2), endpoint, fill="#526071", font_key="sm")
        mask(d, (420, y - 2, 512, y + 16), radius=4)
        text(d, (570, y - 2), time_value, fill="#526071", font_key="sm")
        d.line((70, y + 36, 760, y + 36), fill="#dde3ea")
        y += 64
    panel_x = 790
    text(d, (panel_x, 210 if not request else 132), "POST /v1/payments/****/cancel", fill="#26364c", font_key="md")
    info_y = 270 if not request else 188
    for label, value in [("응답 상태", "200"), ("상점아이디(MID)", "********"), ("paymentKey", "tpay_demo...****"), ("orderId", "order-****...****"), ("Trace-Id", "trace-****...****"), ("요청 시간", "2026-05-21 18:59:58")]:
        text(d, (panel_x, info_y), label, fill="#526071", font_key="sm")
        if label == "응답 상태":
            rounded(d, (panel_x + 170, info_y - 4, panel_x + 214, info_y + 20), 12, fill="#d5f8e6")
            text(d, (panel_x + 182, info_y - 1), "200", fill="#12815a", font_key="xs")
        elif "Key" in label or "Id" in label or "MID" in label:
            mask(d, (panel_x + 170, info_y, panel_x + 370, info_y + 18), radius=4)
        else:
            text(d, (panel_x + 170, info_y), value, fill="#526071", font_key="sm")
        info_y += 32
    box_title = "Request Body" if request else "Response Body"
    text(d, (panel_x, info_y + 20), box_title, fill="#26364c", font_key="base")
    rounded(d, (panel_x, info_y + 60, 1430, 900), 12, fill="#132743")
    code = [
        "{",
        '  "orderId": "order-****",',
        '  "orderName": "결제위젯 주문서 구축 패키지",',
        '  "status": "CANCELED",',
        '  "method": "간편결제",',
        '  "totalAmount": 790000,',
        '  "cancels": [',
        "    {",
        '      "cancelReason": "관리자 요청 환불",',
        '      "cancelAmount": 790000,',
        '      "transactionKey": "txrd_********",',
        '      "canceledAt": "2026-05-21T18:59:58+09:00"',
        "    }",
        "  ]",
        "}",
    ] if not request else [
        "{",
        '  "currency": null,',
        '  "cancelAmount": null,',
        '  "cancelReason": "관리자 요청 환불",',
        '  "taxFreeAmount": null,',
        '  "refundReceiveAccount": null,',
        '  "isDividedPayment": false,',
        '  "refundId": null',
        "}",
    ]
    y = info_y + 88
    for line in code:
        text(d, (panel_x + 28, y), line, fill="#38f0a4" if ":" in line else "#e6f1ff", font_key="mono")
        y += 28
    save(img, name)


def main():
    payment_success()
    receipt()
    admin_dashboard("03-admin-approved.png", canceled=False)
    qr_modal()
    cancel_dialog()
    admin_dashboard("06-admin-canceled.png", canceled=True)
    api_log("07-api-log-cancel-masked.png", request=False)
    api_log("08-api-log-request-masked.png", request=True)


if __name__ == "__main__":
    main()
