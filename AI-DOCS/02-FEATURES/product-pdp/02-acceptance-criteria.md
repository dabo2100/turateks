# Acceptance Criteria — Product PDP

## AC-01
Add to cart stays disabled until required size (and color if any) is selected.

## AC-02
Changing qty updates unit price from the matching tier row (highlight active row).

## AC-03
Gallery: clicking a thumb changes the main image.

## AC-04
WhatsApp link includes product name (prefilled text).

## AC-05
Breadcrumb: Anasayfa / Ürünler / {product}.

## AC-06
Qty can be typed; only digits are accepted; mobile shows a numeric keypad (`inputMode=numeric`).

## AC-07
When qty reaches a cheaper tier, unit price updates and a % indirim badge may appear vs base tier.

## Programmer tests

1. Open a PDP with no size selected — Sepete Ekle disabled
2. Select size — button enables
3. Qty 1 vs 10 — unit price follows table
4. Switch color — label updates
5. Type `50` in Adet — price tier updates; try typing letters — they do not appear
6. Desktop: thumbs left of main image; mobile: thumbs under main image
